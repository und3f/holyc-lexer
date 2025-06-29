import { SyntaxToken } from './token'
import { SyntaxTokenType, KeywordNameToTokenType } from './const'
import { keywords } from './templeos-keywords'

const SYM_0 = '0'.charCodeAt(0)
const SYM_9 = '9'.charCodeAt(0)
const SYM_a = 'a'.charCodeAt(0)
const SYM_z = 'z'.charCodeAt(0)
const SYM_A = 'A'.charCodeAt(0)
const SYM_Z = 'Z'.charCodeAt(0)
const SYM_UNDERSCORE = '_'.charCodeAt(0)
const SYM_DBL_QUOTE = '"'.charCodeAt(0)
const SYM_SINGLE_QUOTE = "'".charCodeAt(0)
const SYM_BACK_SLASH = '\\'.charCodeAt(0)
const SYM_SLASH = '/'.charCodeAt(0)
const SYM_NEWLINE = '\n'.charCodeAt(0)
const SYM_ASTERISK = '*'.charCodeAt(0)

export class SyntaxLexer {
  private _code: string
  private _pos: number
  private _tokens: SyntaxToken[]

  constructor(code: string) {
    this._code = code
    this._pos = 0
    this._tokens = []
  }

  lex(): SyntaxToken[] {
    let ch: number | undefined

    while ((ch = this.peek()) != undefined) {
      if (isIdentStart(ch)) {
        this.parseIdent()
      } else {
        switch (ch) {
          case SYM_DBL_QUOTE:
            this.parseTillUnescapedSym(SYM_DBL_QUOTE, SyntaxTokenType.TK_STRING)
            break
          case SYM_SINGLE_QUOTE:
            this.parseTillUnescapedSym(
              SYM_SINGLE_QUOTE,
              SyntaxTokenType.TK_STRING
            )
            break
          case SYM_SLASH:
            this.parseSlash()
            break
          default:
            this.next()
            break
        }
      }
    }

    return this._tokens
  }

  isEOF(): boolean {
    return this._pos >= this._code.length
  }

  peek(): number | undefined {
    if (this.isEOF()) {
      return
    }

    return this._code[this._pos].charCodeAt(0)
  }

  next(): number | undefined {
    const ch = this.peek()
    if (ch !== undefined) {
      this._pos++
    }
    return ch
  }

  getStr(start: number, end: number): string {
    return this._code.substring(start, end + 1)
  }

  getPos(): number {
    return this._pos
  }

  getPrevPos(): number {
    return this.getPos() - 1
  }

  private parseIdent() {
    const start = this.getPos()

    var ch: number | undefined
    while ((ch = this.peek()) != undefined) {
      if (!isIdent(ch)) {
        break
      }
      this.next()
    }

    const end = this.getPrevPos()
    const token = findTokenType(this.getStr(start, this.getPrevPos()))

    if (token != SyntaxTokenType.TK_UNKNOWN_SYMBOL) {
      this._tokens.push({
        token,
        start,
        end,
      })
    }
  }

  private parseSlash() {
    const start = this.getPos()
    this.next()
    let ch = this.next()
    switch (ch) {
      case SYM_SLASH:
        this.parseCComment(start)
        return
      case SYM_ASTERISK:
        this.parseCPPComment(start)
        return
    }
  }

  private parseCComment(start: number) {
    let ch: number | undefined
    while ((ch = this.peek()) != undefined) {
      if (ch === SYM_NEWLINE) {
        break
      }
      this.next()
    }

    const end = this.getPrevPos()
    this._tokens.push({
      token: SyntaxTokenType.TK_COMMENT,
      start,
      end,
    })
  }

  private parseCPPComment(start: number) {
    let prev: number = SYM_SLASH
    let ch: number | undefined
    while ((ch = this.next()) != undefined) {
      if (ch === SYM_SLASH && prev === SYM_ASTERISK) {
        break
      }
      prev = ch
    }

    const end = this.getPrevPos()
    this._tokens.push({
      token: SyntaxTokenType.TK_COMMENT,
      start,
      end,
    })
  }

  private parseTillUnescapedSym(sym: number, tokenType: SyntaxTokenType) {
    const start = this.getPos()
    let ch: number | undefined
    let escape = false

    this.next()
    while ((ch = this.next()) != undefined) {
      if (!escape) {
        if (ch === sym) {
          break
        } else if (ch === SYM_BACK_SLASH) {
          escape = true
        }
      } else {
        escape = false
      }
    }

    const end = this.getPrevPos()
    this._tokens.push({
      token: tokenType,
      start,
      end,
    })
  }
}

function findTokenType(sym: string): SyntaxTokenType {
  for (const [type, symbolsSet] of Object.entries(keywords)) {
    if (symbolsSet.has(sym)) {
      const token =
        KeywordNameToTokenType[type] || SyntaxTokenType.TK_UNKNOWN_SYMBOL
      return token
    }
  }
  return SyntaxTokenType.TK_UNKNOWN_SYMBOL
}

function isIdent(ch: number): boolean {
  return isIdentStart(ch) || isNumeric(ch)
}

function isIdentStart(ch: number): boolean {
  return (
    (ch >= SYM_a && ch <= SYM_z) ||
    (ch >= SYM_A && ch <= SYM_Z) ||
    ch == SYM_UNDERSCORE ||
    (ch >= 128 && ch <= 255)
  ) // TODO: TempleOS-specific charset
}

function isNumeric(ch: number): boolean {
  return ch >= SYM_0 && ch <= SYM_9
}
