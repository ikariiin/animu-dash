import {EpisodeDetails} from "../directory/components/episode-card";
import {anilistQuery, getCurrentUserId} from "../common/utils/anilist-query";

export interface AnimeStatusResponse {
  id: number;
  status: "CURRENT"|"PLANNING"|"COMPLETED"|"DROPPED"|"PAUSED"|"REPEATING";
  progress: number;
  score: number;
  media: { episodes: number; }
}

export class AnilistManager {
  private episodeDetails: EpisodeDetails;

  public constructor(episodeDetails: EpisodeDetails) {
    this.episodeDetails = episodeDetails;
  }

  private static async getAnimeStatusQuery(): Promise<string> {
    return `
      query($mediaId: Int, $userId: Int) {
        MediaList(mediaId: $mediaId, userId: $userId) {
          id,
          status,
          progress,
          score(format: POINT_10),
          media { episodes }
        }
      }
    `;
  }

  private async getAnimeStatus(): Promise<AnimeStatusResponse> {
    if(!this.episodeDetails.animeDetails) throw new Error("Error while fetching media status from AniList.");

    const response = await anilistQuery(
      await AnilistManager.getAnimeStatusQuery(),
      { userId: await getCurrentUserId(), mediaId: "" + this.episodeDetails.animeDetails.id }
      );
    return response.data.MediaList;
  }

  /**
   * If the anime is not yet marked as complete, or watching,
   * mark it as one.
   * If it is completed, mark it as re-watching.
   * If it is marked as watching, do nothing.
   */
  public async markAsWatching(): Promise<void> {
    const animeStatus = await this.getAnimeStatus();
    const query = `
      mutation($id: Int, $mediaId: Int, $status: MediaListStatus) {
        SaveMediaListEntry (id: $id, mediaId: $mediaId  status: $status) {
          status
        }
      }
    `;
    const rewatchQuery = `
      mutation($id: Int, $status: MediaListStatus, $progress: Int) {
        SaveMediaListEntry (id: $id,  status: $status, progress: $progress) {
          status
        }
      }
    `;

    if(!animeStatus) {
      await anilistQuery(query, {
        mediaId: '' + this.episodeDetails.animeDetails!.id,
        status: "CURRENT"
      });
      return;
    }

    switch (animeStatus.status) {
      case "COMPLETED":
        await anilistQuery(rewatchQuery, {
          id: '' + animeStatus.id,
          status: "REPEATING",
          progress: '0'
        });
        break;
      case "CURRENT":
      case "REPEATING":
        // Do nothing.
        break;
      case "PLANNING":
      case "DROPPED":
      case "PAUSED":
      default:
        await anilistQuery(query, {
          id: '' + animeStatus.id,
          status: "CURRENT"
        });
        break;
    }
  }

  public async editProgress(progress: number): Promise<void> {
    const query = `
      mutation($id: Int, $progress: Int) {
        SaveMediaListEntry (id: $id,  progress: $progress) {
          progress
        }
      }
    `;
    const animeStatus = await this.getAnimeStatus();

    await anilistQuery(query, {
      id: '' + animeStatus.id,
      progress: '' + progress
    });
  }
}