# HolyC Lexer

HolyC Syntax Highlight Lexer.

## Installation

```sh
npm install holyc-lexer
```

## API

### SyntaxLexer

```js
new SyntaxLexer(code).lex()
```

Returns array of `SyntaxToken`s for recognized parts. See `SyntaxToken`.

### SyntaxToken

Contains information about token type (see `SyntaxTokenType`) and position of
the token (excluding end position, similar to `substring` format).
