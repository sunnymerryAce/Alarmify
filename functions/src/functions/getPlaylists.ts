import * as functions from 'firebase-functions';
import CONFIG from '@/util/CONFIG';
import getGCPAuthorizedClient from '@/common/getGCPAuthorizedClient';
import getNewSpotifyAccessToken from '@/common/getNewSpotifyAccessToken';
import getUserPlaylists from '@/common/getUserPlaylists';

/**
 * ユーザーのSpotifyプレイリスト一覧を取得する
 */
module.exports = functions.https.onCall(async (data) => {
  try {
    const { code, user } = data;
    // OAuthでOAuth2Clientを取得
    const client = await getGCPAuthorizedClient();
    let accessToken = code
      ? await getNewSpotifyAccessToken(client, {
        isRefresh: false,
        code,
      })
      : user.access_token;
    const playlists: SpotifyApi.ListOfUsersPlaylistsResponse = await getUserPlaylists(
      accessToken,
    ).catch(async (error) => {
      // AccessTokenがexpiredの場合、新しいAccessTokenを取得する
      if (error.message && CONFIG.REG_EXP.ERROR[401].test(error.message)) {
        accessToken = await getNewSpotifyAccessToken(client, {
          isRefresh: true,
          refresh_token: user.refresh_token,
        });
        // リトライ
        const retry = await getUserPlaylists(accessToken);
        return retry;
      }
      throw error;
    });
    return {
      ok: true,
      playlists,
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
});
