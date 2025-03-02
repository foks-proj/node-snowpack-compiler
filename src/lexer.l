%s ST_QUOTE2 ST_QUOTE1 ST_COMMENT ST_DOC
%%

<INITIAL>"//".*     /* skip over C++-style comments */
<INITIAL>\s+        /* skip space */

<INITIAL>'@'                     { return 'AT'; }
<INITIAL>'0x'[a-f0-9]{16}        { return 'UINT64'; }
<INITIAL>'0x'[a-f0-9]{8}         { return 'UINT32'; }

<INITIAL>"typedef"               { return 'TYPEDEF'; }
<INITIAL>"List"                  { return 'LIST'; }
<INITIAL>"Option"                { return 'OPTION'; }
<INITIAL>"Blob"                  { return 'BLOB'; }
<INITIAL>"struct"                { return 'STRUCT'; }
<INITIAL>"Text"                  { return 'TEXT'; }
<INITIAL>"Uint"                  { return 'UINT'; }
<INITIAL>"Bool"                  { return 'BOOL'; }
<INITIAL>"Int"                   { return 'INT'; }
<INITIAL>"enum"                  { return 'ENUM'; }
<INITIAL>"variant"               { return 'VARIANT'; }
<INITIAL>"case"                  { return "CASE"; }
<INITIAL>"switch"                { return "SWITCH"; }
<INITIAL>"void"                  { return "VOID"; }
<INITIAL>"default"               { return "DEFAULT"; }
<INITIAL>"protocol"              { return "PROTOCOL"; }
<INITIAL>"errors"                { return "ERRORS"; }
<INITIAL>"true"                  { return "TRUE"; }
<INITIAL>"false"                 { return "FALSE"; }
<INITIAL>"argHeader"             { return "ARGHEADER"; }
<INITIAL>"resHeader"             { return "RESHEADER"; }
<INITIAL>"import"                { return "IMPORT" ; }
<INITIAL>"ts:import"             { return "TS_IMPORT" ; }
<INITIAL>"go:import"             { return "GO_IMPORT" ; }
<INITIAL>"as"                    { return "AS"; }
<INITIAL>Future                  { return "FUTURE"; }


<INITIAL>"->"       return 'ARROW'; 
<INITIAL>";"        return 'SEMICOLON';
<INITIAL>"\\."      return 'DOT';
<INITIAL>","        return 'COMMA';
<INITIAL>":"        return 'COLON';
<INITIAL>"{"        return 'LBRACE';
<INITIAL>"}"        return 'RBRACE';
<INITIAL>"("        return 'LPAREN';
<INITIAL>")"        return 'RPAREN';
<INITIAL>"["        return 'LBRACKET';
<INITIAL>"]"        return 'RBRACKET';
<INITIAL>"="        return 'EQUALS'; 

<INITIAL>[a-zA-Z_][a-zA-Z_0-9]*  { return 'IDENTIFIER'; }
<INITIAL>[-]?[0-9]+              { return 'NUMBER'; }
<INITIAL>["][^"\\]+["]   { return 'DQUOTED_STRING'; }
<INITIAL>"."            { return 'DOT'; }


<INITIAL>"/**"      { this.begin ('ST_DOC'); }
<INITIAL>"/*"       { this.begin ('ST_COMMENT'); }

<ST_COMMENT>"*/"    { this.popState(); }
<ST_COMMENT>"*"     /* ignore */
<ST_COMMENT>[^*]+   /* ignore */
<ST_COMMENT><<EOF>> return 'EOF';

<ST_DOC>"*/"    { this.popState(); }
<ST_DOC>"*"     { return 'DOC_FRAG'; }
<ST_DOC>[^*]+   { return 'DOC_FRAG'; }
<ST_DOC><<EOF>> { return 'EOF'; }