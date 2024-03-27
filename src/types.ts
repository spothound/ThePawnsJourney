export type Puzzle = {
  PuzzleId: string
  FEN: string
  Moves: string
  Rating: string
  RatingDeviation: string
  Popularity: string
  NbPlays: string
  Themes: string
  GameUrl: string
  OpeningTags: string
}
export type TurnColor = 'w' | 'b'

export interface User {
  id: string
  username: string
  email: string
  picture: string
  verified: boolean
}

export type GoogleOneTapPayload = {
  iss: string, // The JWT's issuer
  azp: string, // Your server's client ID
  aud: string, // Your server's client ID
  sub: string, // The unique ID of the user's Google Account
  email: string, // The user's email address
  email_verified: boolean, // true, if Google has verified the email address
  nbf: number, // Not before
  name: string, // The user's name
  picture: string, // If present, a URL to user's profile picture
  given_name: string, // First name
  family_name: string, // Last name
  iat: number, // Unix timestamp of the assertion's creation time
  exp: number, // Unix timestamp of the assertion's expiration time
  jti: string, // JWT ID
}
