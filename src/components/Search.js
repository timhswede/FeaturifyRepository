import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";

export default function Playlists() {
  const [{ token, selectedPlaylistId, selectedArtistId }, dispatch] = useStateProvider();
  const [playlistId, setPlaylistId] = useState('');
  const [artistId, setArtistId] = useState('');

  const handleInputChange = (event) => {
    const link = event.target.value;
    const lastSlashIndex = link.lastIndexOf('/');
    const id = link.substring(lastSlashIndex + 1);
    if (link.includes('artist')) {
      if (id !== artistId) {
        setArtistId(id);
        setPlaylistId('');
        dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: null });
      }
    } else if (link.includes('playlist')) {
      if (id !== playlistId) {
        setPlaylistId(id);
        setArtistId('');
        dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedArtistId: null });
      }
    } else {
      setArtistId('');
      setPlaylistId('');
    }
  };

  const changeCurrent = () => {
    if (playlistId) {
      dispatch({ type: reducerCases.SET_ARTIST_ID, selectedArtistId: null });
      dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: playlistId });
    } else if (artistId) {
      dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: null });
      dispatch({ type: reducerCases.SET_ARTIST_ID, selectedArtistId: artistId });
    }
  };

  const Item = styled(Paper)(({ theme }) => ({ backgroundColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#FFFFFF', padding: theme.spacing(1), textAlign: 'center', color: '#FFFFFFFF', }));

  return (
    <Item
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 500, borderRadius: 6, height: "2.3rem" }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, marginLeft: "1.5rem"}}
        placeholder="Enter a Spotify Artist or Playlist link"
        onChange={handleInputChange}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search" >
        <SearchIcon onClick={changeCurrent}/>
      </IconButton>
    </Item>
  );
}

