import { reducerCases } from "./Constants";

export const initialState = {
  token: null,
  userInfo: null,
  playlists: [],
  selectedPlaylist: null,
  selectedPlaylistId: null,
  selectedArtist: null,
  selectedArtistId: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case reducerCases.SET_USER:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case reducerCases.SET_PLAYLISTS:
      return {
        ...state,
        playlists: action.playlists,
      };
    case reducerCases.SET_PLAYLIST:
      return {
        ...state,
        selectedPlaylist: action.selectedPlaylist,
      };
    case reducerCases.SET_PLAYLIST_ID:
      return {
        ...state,
        selectedPlaylistId: action.selectedPlaylistId,
      };
    case reducerCases.SET_ARTIST:
      return {
        ...state,
        selectedArtist: action.selectedArtist,
      };
    case reducerCases.SET_ARTIST_ID:
      return {
        ...state,
        selectedArtistId: action.selectedArtistId,
      };
    default:
      return state;
  }
};

export default reducer;
