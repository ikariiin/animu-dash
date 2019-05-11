import {anilistQuery, getCurrentUserId} from "./anilist-query";

export async function getCurrentUserName() {
  const id = await getCurrentUserId();
  const query = `
    query($id: Int) {
      User(id: $id) {
        name
      }
    }
  `;
  const apiResponse = await anilistQuery(query, {id});

  return apiResponse.data.User.name;
}