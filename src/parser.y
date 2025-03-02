%start Root

%%

Root : FileId Statements { return new yy.Root($1, $2); }  ;

Statements
  : /* empty */ { $$ = []; }
  | Statements Statement { $$ = $1.concat($2); }
  ;

UniqueId 
  : AT UintConstant { $$ = new yy.UniqueId($2) }
  ;
  
UintConstant
  : UINT64 { $$ = $1; }
  | UINT32 { $$ = $1; }
  ; 

FileId 
  : UniqueId SEMICOLON { $$ = $1; }
  ;

Decorators 
  : Doc { $$ = new yy.Decorators($1); }
  ;

Statement
  : Typedef
  | Struct 
  | Enum
  | Variant
  | Protocol
  | Import
  ;

GenericImport
  : IMPORT DQUOTED_STRING AS IDENTIFIER SEMICOLON { $$ = new yy.GenericImport($2, $4); }
  ;

TsImport
  : TS_IMPORT DQUOTED_STRING AS IDENTIFIER SEMICOLON { $$ = new yy.TsImport($2, $4); }
  ;

GoImport
  : GO_IMPORT DQUOTED_STRING AS IDENTIFIER SEMICOLON { $$ = new yy.GoImport($2, $4); }
  ;

Import
  : GenericImport
  | TsImport
  | GoImport
  ;

Count
  : LPAREN Number RPAREN { $$ = $2; }
  ;

CountOpt
  : /* empty */ { $$ = null; }
  | Count { $$ = $1; }
  ;

Blob
  : BLOB CountOpt { $$ = new yy.Blob($2); }
  ;

DottedIdentifier
  : Identifier { $$ = new yy.DerivedType($1, null); }
  | Identifier DOT Identifier { $$ = new yy.DerivedType($3, $1); }
  ;

SimpleType
  : DottedIdentifier { $$ = $1; }
  | UINT { $$ = new yy.Uint(); }
  | TEXT { $$ = new yy.Text(); }
  | INT { $$ = new yy.Int(); }
  | BOOL { $$ = new yy.Bool(); }
  | Blob { $$ = $1; }
  ;

List 
  : LIST LPAREN Type RPAREN { $$ = new yy.List($3); }
  ;

Enum
  : Decorators ENUM Identifier LBRACE EnumValues RBRACE { $$ = new yy.Enum($1, $3, $5); }
  ;

EnumValues
  : /* empty */ { $$ = []; }
  | EnumValues EnumValue { $$ = $1.concat($2); }
  ;

EnumValue
  : Identifier AT Number SEMICOLON { $$ = new yy.EnumValue($1, $3); }
  ;

Type
  : SimpleType { $$ = $1; }
  | List { $$ = $1; }
  ;

OptionalType
  : OPTION LPAREN Type RPAREN { $$ = new yy.Option($3); }
  ;

TypeOrOptional
  : Type
  | OptionalType
  ;

Void
  : VOID { $$ = new yy.Void(); }
  ;

TypeOrVoid
  : Type
  | Void
  ;

TypeOrFuture
  : Type
  | Future
  ;

Future
  : FUTURE LPAREN SimpleType RPAREN { $$ = new yy.Future($3); }
  ;

Number
  : NUMBER { $$ = parseInt($1); }
  ;

Fields
  : /* empty */ { $$ = []; }
  | Fields Field { $$ = $1.concat($2); }
  ;

Position
  : AT Number { $$ = $2; }
  ;

Identifier 
  : IDENTIFIER
  ;

Field
  : Identifier Position COLON TypeOrOptional SEMICOLON { $$ = new yy.Field($1, $2, $4); }
  ;

Struct 
  : Decorators STRUCT Identifier UniqueIdOpt LBRACE Fields RBRACE { $$ = new yy.Struct($1, $3, $4, $6); }
  ;

Typedef
  : Decorators TYPEDEF Identifier UniqueIdOpt EQUALS TypeOrFuture SEMICOLON { $$ = new yy.Typedef($1, $3, $4, $6); }
  ;

VariantFields
  : VariantField { $$ = [$1]; }
  | VariantFields VariantField { $$ = $1.concat($2); }
  ;

VariantLabel
  : Identifier { $$ = new yy.VariantLabelIdentifier($1); }
  | Number { $$ = new yy.VariantLabelNumber($1); }
  | TRUE { $$ = new yy.VariantLabelBool(true); }
  | FALSE { $$ = new yy.VariantLabelBool(false); }
  ;

VariantLabels
  : VariantLabel                       { $$ = [$1]; }
  | VariantLabels COMMA VariantLabel   { $$ = $1.concat($3); }
  ;

VariantField
  : VariantCase
  | VariantDefault
  ;

UniqueIdOpt
  : /* empty */ { $$ = null; }
  | UniqueId { $$ = $1; }
  ;

PositionOpt
  : /* empty */ { $$ = null; }
  | Position    { $$ = $1; }
  ;

VariantDefault 
  : DEFAULT PositionOpt COLON TypeOrVoid SEMICOLON
    { $$ = new yy.VariantCase([], $2, $4); }
  ;

VariantCase
  : CASE VariantLabels PositionOpt COLON TypeOrVoid SEMICOLON 
     { $$ = new yy.VariantCase($2, $3, $5); }
  ;

Variant
  : Decorators VARIANT Identifier SWITCH LPAREN Identifier COLON SimpleType RPAREN
     UniqueIdOpt LBRACE VariantFields RBRACE
    { $$ = new yy.Variant($1, $3, $6, $8, $10, $12)}
  ;

Methods 
  : /* empty */ { $$ = [] }
  | Methods Method { $$ = $1.concat($2); }
  ;

TypeOpt
  : /* empty */ { $$ = null; }
  | COLON Identifier { $$ = $2; }
  ;

Method
  : Decorators Identifier Position ParamList TypeOpt ReturnOpt SEMICOLON
    { $$ = new yy.Method($1, $2, $3, $4, $5, $6) }
  ;

ReturnOpt 
  : /* empty */        { $$ = new yy.Void(); }
  | ARROW TypeOrVoid   { $$ = $2; }
  ;

ParamList
  : LPAREN ParamsOpt RPAREN { $$ = $2; }
  ;

ParamsOpt
  : /* empty */ { $$ = []; }
  | Params 
  ;

Params 
  : Param              { $$ = [$1]; }
  | Params COMMA Param { $$ = $1.concat($3); }
  ;

Param
  : Identifier Position COLON TypeOrOptional { $$ = new yy.Param($1, $2, $4); }
  ;

CommaOrSemi
  : COMMA 
  | SEMICOLON
  ;

ProtoModifiers
  : /* empty */ { $$ = []; }
  | ProtoModifiers ProtoModifier { $$ = $1.concat($2); }
  ;

ProtoModifier
  : ERRORS    Type { $$ = new yy.ErrorType($2); }
  | ARGHEADER Type { $$ = new yy.ArgHeader($2); }
  | RESHEADER Type { $$ = new yy.ResHeader($2); }
  ;

Protocol
  : Decorators PROTOCOL Identifier ProtoModifiers UniqueId LBRACE Methods RBRACE 
    { $$ = new yy.Protocol($1, $3, $4, $5, $7)}
  ;

Doc
  : DocRaw { $$ = new yy.Doc(@1, $1); }
  ;

DocRaw
  : { $$ = ""; }
  | DocRaw DocFrag { $$ = $1 + $2; }
  ;

DocFrag
  : DOC_FRAG { $$ = yytext; }
  ;
