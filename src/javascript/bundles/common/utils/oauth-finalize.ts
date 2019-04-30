// @ts-ignore
const request = window.require('request');

export async function oauthFinalize(code: string): Promise<string> {
  const options = {
    uri: 'https://anilist.co/api/v2/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    json: {
      'grant_type': 'authorization_code',
      'client_id': '1913',
      'client_secret': 'q9b5GkjXo9YkDDQZZEcvqvHgp5inV9qhsfgSNKFX',
      'redirect_uri': 'https://anilist.co/api/v2/oauth/pin', // http://example.com/callback
      'code': code, // The Authorization Code received previously
    }
  };

  return new Promise<string>((resolve => {
    request(options, function (error: any, response: any, body: any) {
      if (!error && response.statusCode == 200) {
        resolve(body.access_token);
      }
    });
  }));
}