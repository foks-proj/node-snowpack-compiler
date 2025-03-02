
@0x9285375c24b3ee13;

struct Bozzle {
    id @0 : Uint;
}

struct Bam {
    time @0 : Time;
}

// Seems like we have 2 options: either (1) deal with the fact today that any field is optional
// and handle the case of it not being there today (or assert that it has to be there today); or
// commit to never deleting, only adding fields in the future. I guess a third case is to 
// consider a missing field one that just gets the zero / default value.
struct Foo {
    id @0 : Uint;
    name @1 : Text;
    bozzles @2 : List(Boozle);
    blob @5 : Blob;
    boop @6 : EdDSASig;
    bam @7 : Option(Bam);
    obama @8: Bam;
    boomies @9: Option(Boomies);
    toto @10 : *Uint;
    dodo @11 : *Text;
}

struct FooFuture {
    id @0 : Uint;
    name @1 : Text;
    bozzles @2 : List(Boozle);
    blob @5 : Blob;
    boop @6 : EdDSASig;
    jam @9 : Uint;
}

enum ErrType {
    OK @0;
    E_BAD_FILE @100;
    E_BAR_PROCESS @101;
}

struct Error {
    type @0 : ErrType;
    desc @1 : Text;
}

enum BlipType {
    DUDE @0;
    GIRL @1;
}

struct Boomie {
    laurent @0 : Bool;
    agglieti @1 : Bool;
}

type Dude = Text;
type Girl = Uint;
type EdDSASig = Blob(64);
type Boomies = List(Boomie);

variant Blippi switch (bt : BlipType) 0xb1f62d29b2083855 {
    case DUDE: Dude;
    case GIRL: Girl;
    default: void;
}

struct TV {
    bluey @0 : Uint;
    blippi @1 : Blippi;
}

interface Login 0x9ea8b3bcc4b89ec7 {

    defres : { err @0 : Error };

    login @0 ({foo @0 : Foo, bar @1 : Uint}) -> ({bam @1 : Text});
    logout @1 () -> ();

}