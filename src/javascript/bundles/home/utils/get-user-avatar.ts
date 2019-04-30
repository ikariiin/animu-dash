import {anilistQuery, getCurrentUserId} from "../../common/utils/anilist-query";

export async function getUserAvatar(): Promise<string> {
  const userId = await getCurrentUserId();

  const query = `
    query($id: Int) {
      User(id: $id) {
        avatar {
          large
        }
      }
    }
  `;
  const response = await anilistQuery(query, {id: userId});

  return response.data.User.avatar.large;
}