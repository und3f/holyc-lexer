import { SyntaxLexer, SyntaxTokenType } from './index'

describe('SyntaxLexer', () => {
  it('should tokenize simple expression correctly', () => {
    const code = 'I64 variable = RandI64() + 456;'

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_CLASS, start: 0, end: 3 },
      { token: SyntaxTokenType.TK_FUN, start: 15, end: 22 },
      {
        token: SyntaxTokenType.TK_PARENTHESIS_OPEN,
        start: 22,
        end: 23,
        depth: 0,
      },
      {
        token: SyntaxTokenType.TK_PARENTHESIS_CLOSE,
        start: 23,
        end: 24,
        depth: 0,
      },
    ])
  })

  it('should tokenize correctly export symbol correctly', () => {
    const code = '_HASH_FIND'

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_EXPORT_SYS_SYM, start: 0, end: 10 },
    ])
  })

  it('should tokenize double quote string', () => {
    const code = '"Hello, world!";'

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_STRING, start: 0, end: 15 },
    ])
  })

  it('should ignore escaped quotes in double quote string', () => {
    const code = '"\\"";'

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_STRING, start: 0, end: 4 },
    ])
  })

  it('should tokenize single quote string', () => {
    const code = `'a\\''`

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_STRING, start: 0, end: 5 },
    ])
  })

  it('should tokenize C-style comments', () => {
    const code = '// C-style comment'

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_COMMENT, start: 0, end: 18 },
    ])
  })

  it('should tokenize C-style comments with new line', () => {
    const code = '// C-style comment\n// Second comment'

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_COMMENT, start: 0, end: 18 },
      { token: SyntaxTokenType.TK_COMMENT, start: 19, end: 36 },
    ])
  })

  it('should tokenize C++ style comments', () => {
    const code = '/**/\n'

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_COMMENT, start: 0, end: 4 },
    ])
  })

  it('should tokenize long C++ style comments', () => {
    const code = '/* C++ style\n * multiline\n * comment */\n'

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_COMMENT, start: 0, end: code.length - 1 },
    ])
  })

  it('should tokenize braces and parentheses correctly', () => {
    const code = '{a(b())}'

    expect(new SyntaxLexer(code).lex()).toEqual([
      { token: SyntaxTokenType.TK_BRACE_OPEN, start: 0, end: 1, depth: 0 },
      {
        token: SyntaxTokenType.TK_PARENTHESIS_OPEN,
        start: 2,
        end: 3,
        depth: 0,
      },
      {
        token: SyntaxTokenType.TK_PARENTHESIS_OPEN,
        start: 4,
        end: 5,
        depth: 1,
      },
      {
        token: SyntaxTokenType.TK_PARENTHESIS_CLOSE,
        start: 5,
        end: 6,
        depth: 1,
      },
      {
        token: SyntaxTokenType.TK_PARENTHESIS_CLOSE,
        start: 6,
        end: 7,
        depth: 0,
      },
      {
        token: SyntaxTokenType.TK_BRACE_CLOSE,
        start: 7,
        end: 8,
        depth: 0,
      },
    ])
  })
})
