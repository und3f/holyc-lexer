# HolyC Lexer &middot; [![GitHub license](https://img.shields.io/badge/license-MPL2-blue.svg)](https://github.com/und3f/holyc-lexer/blob/master/LICENSE) [![NPM Version](https://img.shields.io/npm/v/holyc-lexer)](https://www.npmjs.com/package/holyc-lexer) [![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/und3f/holyc-lexer/.github%2Fworkflows%2Fpr-build.js.yml)](https://github.com/und3f/holyc-lexer/actions/workflows/pr-build.js.yml)

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

### Online HolyC Editor

[TempleOS Cloud HolyC Playground](https://templeos.zasenko.name/cloud/playground/)

