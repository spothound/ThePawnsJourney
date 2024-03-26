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
  given_name: string
  email: string
  picture: string
}

// export type GoogleOneTapPayload = {
//   iss: string; // The JWT's issuer
//   nbf: number;
//   aud: string; // Your server's client ID
//   sub: string; // The unique ID of the user's Google Account
//   hd?: string; // If present, the host domain of the user's GSuite email address
//   email: string; // The user's email address
//   email_verified: boolean; // true, if Google has verified the email address
//   azp: string;
//   name: string; // The user's name
//   picture?: string; // If present, a URL to user's profile picture
//   given_name: string;
//   family_name: string;
//   iat: number; // Unix timestamp of the assertion's creation time
//   exp: number; // Unix timestamp of the assertion's expiration time
//   jti: string;
// };
