import fetch from 'node-fetch';

export interface GraphQLResponse {
  data: {
    Page: {
      pageInfo?: {
        total: number;
        currentPage: number;
        lastPage: number;
        hasNextPage: boolean;
        perPage: number;
      }
      [key: string]: any;
    }
    [key: string]: any;
  }
}

export const apiUri = "https://graphql.anilist.co";

export async function anilistQuery(query: string, vars: { [key: string]: string } = {}): Promise<GraphQLResponse> {
  const payload = {
    variables: vars,
    query
  };

  const apiResponse = await fetch(apiUri, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.token}`
    },
    body: JSON.stringify(payload)
  });

  return apiResponse.json();
}

export async function getCurrentUserId(): Promise<string> {
  const query = `
    query {
      Viewer {
        id
      }
    }
  `;

  const viewerResponse = await anilistQuery(query);
  return viewerResponse['data']['Viewer']['id'];
}