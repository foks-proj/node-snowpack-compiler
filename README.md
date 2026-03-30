# node-snowpack-compiler

The original TypeScript implementation of the Snowpack IDL compiler. Generates type-safe Go and TypeScript code for RPC services and cryptographic operations from `.snowp` protocol definition files.

A [Go port](https://github.com/foks-proj/go-snowpack-compiler) is also available.

## Motivation

Building distributed systems means writing a lot of boilerplate: struct definitions, serialization/deserialization, RPC dispatch, client stubs, error wrapping. When protocols span multiple services (client, server, internal infrastructure), keeping types in sync becomes a real problem.

Cryptographic systems add another dimension: every hash, signature, encryption, and commitment must be domain-separated to prevent cross-type attacks. If the same byte sequence can be valid as both a "user profile" and a "payment authorization", an attacker can trick a system into signing one when it thinks it's signing the other. Manually managing domain separators is error-prone and audit-unfriendly.

Snowpack solves both problems by letting you define your types and protocols in a single IDL, then generating all the code you need. The generated code uses the Snowpack RPC runtime ([go-snowpack-rpc](https://github.com/foks-proj/go-snowpack-rpc) for Go, `snowpack` npm package for TypeScript) for the wire format (msgpack) and RPC transport, giving you:

- Strongly typed RPC methods with compile-time checking
- Automatic msgpack encode/decode via internal wire types
- Discriminated unions (variants) with type-safe accessors and constructors
- Optional types, lists, fixed-size byte arrays, and futures
- Cryptographic domain separation enforced through the type system
- Code generation for both Go and TypeScript from the same `.snowp` source

The [go-foks](https://github.com/foks-proj/go-foks) project uses Snowpack extensively, with 60+ `.snowp` files defining protocols across its client-server architecture.

## Installation

```bash
npm install -g @foks-proj/snowpack-compiler
```

Or as a dev dependency:

```bash
npm install --save-dev @foks-proj/snowpack-compiler
```

## Usage

### Single file

```bash
snowpc -l go -p mypackage -i input.snowp -o output.go
snowpc -l ts -p mymodule -i input.snowp -o output.ts
```

### Batch (entire directory)

```bash
snowpc -l go -p mypackage -d ./proto-src -D ./proto
```

### Stdin/stdout

```bash
cat input.snowp | snowpc -l go -p mypackage
```

### Flags

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--lang` | `-l` | Output language (`go`, `ts`) | (required) |
| `--package` | `-p` | Package/module name | (required) |
| `--input` | `-i` | Input file | stdin |
| `--output` | `-o` | Output file | stdout |
| `--input-dir` | `-d` | Input directory (batch mode) | |
| `--output-dir` | `-D` | Output directory (batch mode) | |
| `--extension` | `-e` | File extension to match | `.snowp` |

## IDL Reference

Every `.snowp` file starts with a randomly generated unique file ID (64-bit):

```
@0xdcb1c7e83fa16a34;
```

Generate this randomly when creating a new file. It serves as a namespace identifier for the file.

### Imports

Import types from other packages using language-specific imports:

```
go:import "github.com/myorg/myproject/proto/lib" as lib;
ts:import "./lib" as lib;
```

Generic imports (language-agnostic) are also supported:

```
import "foo.bar/pickle" as bizzle;
```

### Primitive Types

| Type | Go | TypeScript | Description |
|------|----|-----------|-------------|
| `Text` | `string` | `string` | UTF-8 string |
| `Uint` | `uint64` | `number` | Unsigned 64-bit integer |
| `Int` | `int64` | `number` | Signed 64-bit integer |
| `Bool` | `bool` | `boolean` | Boolean |
| `Blob` | `[]byte` | `Buffer` | Variable-length byte array |
| `Blob(n)` | `[n]byte` | `Buffer` | Fixed-length byte array |
| `Void` | — | — | No data |

### Container Types

| Type | Go | TypeScript | Description |
|------|----|-----------|-------------|
| `List(T)` | `[]T` | `T[]` | Array of T |
| `Option(T)` | `*T` | `T \| null` | Nullable/optional value |
| `Future(T)` | `[]byte` | `Buffer` | Deferred data (stored as blob, decoded later) |

### Typedef

Type aliases, optionally with a unique ID:

```
typedef EntityID = Blob;
typedef UID = Blob(33);
typedef HostID @0xa2f3bf71638e062d = Blob(33);
typedef TeamList = List(TeamEntry);
```

### Struct

Product types with explicitly positioned fields:

```
struct FQUser @0x98c90258bf748a2f {
    uid @0 : UID;
    hostID @1 : HostID;
}
```

Each field has a position (`@0`, `@1`, ...) that determines its order in the serialized msgpack array. Fields can use any type including `Option(T)` for optional values:

```
struct LoadUserChainArg {
    uid @0 : lib.UID;
    start @1 : lib.Seqno;
    username @2 : Option(NameSeqnoPair);
    auth @3 : LoadUserChainAuth;
}
```

### Unique IDs and Cryptographic Domain Separation

The `@0x...` tag on structs, variants, and typedefs is a randomly generated 64-bit hex identifier (16 hex chars) used for **cryptographic domain separation**. Protocols also take a unique ID, but use a shorter 32-bit identifier (8 hex chars) to save bandwidth since protocol IDs are transmitted with every RPC message.

Every tag must be globally unique across the entire project. This uniqueness is enforced at three levels:

1. **Compile-time**: A checker tool (see [go-foks's snowp-checker](https://github.com/foks-proj/go-foks/blob/main/tools/snowp-checker/main.go)) scans all `.snowp` source files and rejects duplicate IDs before any code is generated.
2. **Init-time**: The generated code registers every tagged type ID at module initialization. The RPC runtime tracks all registered IDs and can detect collisions at startup.
3. **Runtime**: Applications can enumerate all registered IDs at startup and panic on duplicates, providing a belt-and-suspenders check.

When a type has a unique ID, the compiler generates a getter method (`GetTypeUniqueID()` in Go, or a static symbol in TypeScript) that makes the type satisfy the `CryptoPayloader` interface. This interface is the key to domain separation — any function that accepts a `CryptoPayloader` is guaranteed to get a domain separator, and you can't accidentally pass in an untagged type:

- **Hashing**: `SHA512/256(TypeUniqueID || msgpack(object))` — the 8-byte type ID is prepended before the serialized object, so the same data under two different types produces different hashes.
- **Signing**: The message signed is `TypeUniqueID || msgpack(object)`, so a signature over one type can never validate as a signature over another.
- **Symmetric encryption**: The type ID occupies the first 8 bytes of the 24-byte NaCl nonce, so ciphertext produced for one type cannot be decrypted as another.
- **Public-key encryption**: Same nonce scheme — the type ID is embedded in the nonce.
- **HMAC commitments**: `HMAC-SHA512/256(key, TypeUniqueID || msgpack(object))`.

Not every type needs a tag. Only types that participate in cryptographic operations (types that will be hashed, signed, encrypted, or committed to) require one.

### Enum

Enumerated constants with explicit ordinals:

```
enum EntityType {
    User @1;
    Host @2;
    Team @3;
    Device @4;
}
```

### Variant

Discriminated unions (tagged unions / sum types). Each variant switches on a typed discriminator:

```
variant LoadUserChainAuth switch (t : LoadUserChainAuthType) {
    case AsLocalUser: void;
    case Token @1 : lib.PermissionToken;
    case SelfToken @2 : lib.PermissionToken;
    case AsLocalTeam @3 : TeamVOBearerToken;
    case OpenVHost : void;
}
```

- Cases with `void` carry no data
- Cases with data have a position (`@1`, `@2`, ...) for serialization
- A `default` case is supported
- Variants can have a unique ID: `variant Box switch (t : BoxType) @0xb83ffa8f8cfd2ee3 { ... }`

Multiple enum values can map to a single case by comma-separating the labels:

```
enum ViewType {
    Public @0;
    Basic @1;
    Full @2;
}

variant ViewData switch (t : ViewType) {
    case Public, Basic @0 : BasicView;   // two enum values, same data type
    case Full @1 : FullView;
}
```

When multiple labels share a case, the compiler generates a getter and constructor for each label individually. The switch accessor handles all labels in a single `case` branch.

The generated code includes type-safe accessors (`GetToken()`, `GetSwitch()`) and constructors (`NewLoadUserChainAuthWithToken(v)` in Go, or static factory methods in TypeScript).

### Protocol

RPC service definitions. Protocols require an error type and optionally specify request/response header types. The protocol's unique ID is 32-bit (8 hex chars), shorter than type IDs to save bandwidth since it is sent with every RPC message:

```
protocol User
    errors lib.Status
    argHeader lib.Header
    resHeader lib.Header @0x823f0899 {

    ping @0 () -> lib.UID;

    setPassphrase @1 (
        key @0 : lib.EntityID,
        salt @1 : lib.PassphraseSalt,
        skwkBox @2 : lib.SecretBox
    );

    loadUserChain @9 (
        a @0 : LoadUserChainArg
    ) : UserLoadUserChainArg -> UserChain;
}
```

**Protocol modifiers:**
- `errors <Type>` (required) — the error type returned by all methods
- `argHeader <Type>` — request header type (sent with every call)
- `resHeader <Type>` — response header type (returned with every call)

**Method syntax:**
- `methodName @position (params) -> ReturnType;` — standard method
- `methodName @position (params);` — method with no return value
- `methodName @position (params) : ArgTypeName -> ReturnType;` — method with a custom arg wrapper type name

Each method has a unique position for dispatch. Parameters follow the same `name @position : Type` syntax as struct fields.

### Doc Comments

Block comments with `/** ... */` are preserved as doc comments on the generated types:

```
/** FQUser is a fully-qualified user identifier. */
struct FQUser {
    uid @0 : UID;
    hostID @1 : HostID;
}
```

## Integrating Into Your Project

### 1. Define your protocols

Create a directory for your `.snowp` source files:

```
proto-src/
  lib/
    types.snowp
  rem/
    service.snowp
```

`proto-src/lib/types.snowp`:
```
@0xaabbccdd11223344;

typedef UserID = Blob(33);
typedef Name = Text;

struct UserInfo {
    id @0 : UserID;
    name @1 : Name;
    active @2 : Bool;
}

enum Role {
    Admin @0;
    Member @1;
    Guest @2;
}
```

`proto-src/rem/service.snowp`:
```
@0x1122334455667788;

go:import "github.com/myorg/myproject/proto/lib" as lib;

struct CreateUserArg {
    name @0 : lib.Name;
    role @1 : lib.Role;
}

protocol UserService
    errors lib.Status @0xdeadbeef {

    createUser @0 (
        arg @0 : CreateUserArg
    ) -> lib.UserInfo;

    getUser @1 (
        id @0 : lib.UserID
    ) -> lib.UserInfo;

    listUsers @2 () -> List(lib.UserInfo);
}
```

### 2. Generate code

For Go (with `go:generate`):

```go
//go:generate snowpc -l go -p lib -d ../../proto-src/lib -D .
//go:generate go fmt .
```

For TypeScript:

```bash
snowpc -l ts -p lib -d ./proto-src/lib -D ./proto/lib
```

Or in a Makefile:

```makefile
.PHONY: proto
proto:
	snowpc -l go -p lib -d proto-src/lib -D proto/lib
	snowpc -l go -p rem -d proto-src/rem -D proto/rem
```

### 3. Implement the server (Go)

```go
type UserServer struct{}

func (s *UserServer) CreateUser(ctx context.Context, arg rem.CreateUserArg) (lib.UserInfo, error) {
    // your implementation here
}

func (s *UserServer) GetUser(ctx context.Context, id lib.UserID) (lib.UserInfo, error) {
    // your implementation here
}

func (s *UserServer) ListUsers(ctx context.Context) ([]lib.UserInfo, error) {
    // your implementation here
}

func (s *UserServer) ErrorWrapper() func(error) lib.Status {
    return func(err error) lib.Status { /* wrap error */ }
}

// Register with the RPC server:
func register(srv *rpc.Server) {
    srv.RegisterV2(rem.UserServiceProtocol(&UserServer{}))
}
```

### 4. Use the client (Go)

```go
client := rem.UserServiceClient{
    Cli: genericClient, // from go-snowpack-rpc
}

user, err := client.GetUser(ctx, someUserID)
```

## How the Compiler Works

The compiler follows a classic multi-stage pipeline:

```
.snowp source → Lexer → Parser → AST → Emitter → .go/.ts output
```

### Lexer (`src/lexer.l`)

A Jison (JavaScript flex) lexer specification that tokenizes `.snowp` input. It recognizes keywords (`struct`, `enum`, `variant`, `protocol`, `typedef`), primitive type names (`Text`, `Uint`, `Blob`, etc.), structural tokens (`{`, `}`, `@`, `->`, `:`, `;`), identifiers, hex values, quoted strings, and doc comments (`/** ... */`).

### Parser (`src/parser.y`)

A Jison (JavaScript yacc) grammar that defines the full Snowpack language structure: file IDs, imports, typedefs, structs with positioned fields, enums, variants with switch/case, and protocols with methods and modifiers. The parser produces a typed AST by invoking constructors from `ast.ts` in its action blocks.

To regenerate the parser after modifying the grammar:

```bash
npm run build-parser
```

### AST (`src/ast.ts`)

The abstract syntax tree uses TypeScript classes for each node type:

- **Statement** classes — `Typedef`, `Struct`, `Enum`, `Variant`, `Protocol`, `Import`
- **Type** classes — `Text`, `Uint`, `Int`, `Bool`, `Blob`, `Void`, `List`, `Option`, `Future`, `DerivedType`
- **VariantLabel** classes — `VariantLabelIdentifier`, `VariantLabelNumber`, `VariantLabelBool`

Each AST node carries field positions, unique IDs, decorators (doc comments), and type references.

### Emitters (`src/emit_go.ts`, `src/emit_ts.ts`)

The abstract `Emitter` base class (`src/emit.ts`) defines the code generation interface. Two concrete implementations exist:

**GoEmitter** (`emit_go.ts`, ~1700 lines) generates:
- Public Go types and internal wire types (suffixed `Internal__`)
- Import/Export conversion methods
- Encode/Decode serialization methods
- Unique ID constants and `GetTypeUniqueID()` getters
- Protocol server interfaces, client stubs, and dispatch tables
- `init()` function registering all unique IDs with the RPC runtime

**TypeScriptEmitter** (`emit_ts.ts`, ~1000 lines) generates:
- TypeScript classes with `import`/`export` methods for serialization
- Static factory constructors for variants
- Unique symbols for type identity checking
- Protocol client stubs and server interfaces
- Codec helpers (encode/decode)

## Building from Source

```bash
npm install
npm run build-parser    # Generate parser from grammar
npm run build           # Compile TypeScript
```

Or in one step:

```bash
npm run build-all
```

### Running Tests

```bash
npm test                # Jest unit tests
npm run go-test         # Compile test .snowp files to Go and run Go tests
npm run ts-test         # Compile test .snowp files to TS and type-check
```

## License

MIT
