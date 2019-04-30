declare module "*.svg" {
  const content: any;
  export default content;
}

declare interface AniListJWT {
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  nbf: string;
  scopes: Array<any>;
  sub: string;
}