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

Returns array of `SyntaxToken`s for recognized syntax structures. Each token
has start, end positions, and type of token (function, string, etc.).
