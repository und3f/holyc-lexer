import { SyntaxTokenType } from './const'

export interface Token<TT> {
  token: TT
  start: number
  end: number
}

export interface SyntaxToken extends Token<SyntaxTokenType> {
  depth?: number
}
