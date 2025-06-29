import { SyntaxTokenType } from './const'

export type Token<TT> = {
  token: TT
  start: number
  end: number
}

export type SyntaxToken = Token<SyntaxTokenType>
