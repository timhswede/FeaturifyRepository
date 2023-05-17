import axios from "axios";
import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import AdvSearch from "./AdvSearch";

export default function Playlists() {
  const [{ token, selectedPlaylistId }, dispatch] = useStateProvider();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
  
        const playlists = await Promise.all(
          response.data.items.map(async (item) => {
            return {
              name: item.name,
              id: item.id,
              images: item.images[0].url,
              owner: item.owner.display_name,
              tracks: item.tracks.total,
            };
          })
        );
        dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
        setPlaylists(playlists);
      } catch (error) {
        console.error(error);
      }
    };
    getPlaylistData();

  }, [selectedPlaylistId, dispatch, token]);
  
  console.log(playlists);

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId });
  };

  const Item = styled(Paper)(({ theme }) => ({ boxShadow: 'none', backgroundColor: '#141414', padding: theme.spacing(1), textAlign: 'center', color: '#FFFFFFFF'}));

  return (
    <>
      <Box sx={{ flexGrow: 1, pb: 0, paddingTop: "1.5rem", paddingLeft: "10rem", marginBottom: "-2rem", maxWidth: '100vw' }} elevation={0}>        
        <Grid container>
          <Grid class="body" item xs={6} fontWeightRegular={500}>
            <Item ><h2>Welcome</h2></Item>
            <Item ><h3>Here Are Some Playlists to Start With</h3></Item>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{paddingTop: "1.5rem", paddingBottom: "2rem", paddingLeft: "10rem",}} elevation={0}>
        <Grid container>
        <Grid items xs={1.7} sx={{ borderRadius: 3, paddingTop: "1.5%", paddingLeft: "1.5%", paddingBottom: "1%", marginRight: "2rem", marginBottom:"2rem", '&:hover': {background: "#343434", transition: "0.25s", cursor: 'pointer'}}} backgroundColor="#242424" 
          onClick={() => changeCurrentPlaylist("37i9dQZEVXbNG2KDcFcKOF")}>
            <Item class="playlist"><img src="https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_global_large.jpg" alt="selected playlist" width="86%"/></Item>
            <Item class="playlist"><h1>Top Songs - Global</h1></Item>
            <Item class="playlist"><h2>Spotify &#x2022; 50 songs</h2></Item>  
          </Grid>
          <Grid items xs={1.7} sx={{ borderRadius: 3, paddingTop: "1.5%", paddingLeft: "1.5%", paddingBottom: "1%", marginRight: "2rem", marginBottom:"2rem", '&:hover': {background: "#343434", transition: "0.25s", cursor: 'pointer'}}} backgroundColor="#242424" 
            onClick={() => changeCurrentPlaylist("37i9dQZF1DXcBWIGoYBM5M")}>
            <Item class="playlist"><img src="https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_us_large.jpg" alt="selected playlist" width="86%"/></Item>
            <Item class="playlist"><h1>Top Songs - USA</h1></Item>
            <Item class="playlist"><h2>Spotify &#x2022; 50 songs</h2></Item>  
          </Grid>
          <Grid items xs={1.7} sx={{ borderRadius: 3, paddingTop: "1.5%", paddingLeft: "1.5%", paddingBottom: "1%", marginRight: "2rem", marginBottom:"2rem", '&:hover': {background: "#343434", transition: "0.25s", cursor: 'pointer'}}} backgroundColor="#242424" 
            onClick={() => changeCurrentPlaylist("37i9dQZEVXbMda2apknTqH")}>
            <Item class="playlist"><img src="https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_ca_large.jpg" alt="selected playlist" width="86%"/></Item>
            <Item class="playlist"><h1>Top Songs - Canada</h1></Item>
            <Item class="playlist"><h2>Spotify &#x2022; 50 songs</h2></Item>  
          </Grid>
          <Grid items xs={1.7} sx={{ borderRadius: 3, paddingTop: "1.5%", paddingLeft: "1.5%", paddingBottom: "1%", marginRight: "2rem", marginBottom:"2rem", '&:hover': {background: "#343434", transition: "0.25s", cursor: 'pointer'}}} backgroundColor="#242424" 
            onClick={() => changeCurrentPlaylist("37i9dQZEVXbK8BKKMArIyl")}>
            <Item class="playlist"><img src="https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_de_large.jpg" alt="selected playlist" width="86%"/></Item>
            <Item class="playlist"><h1>Top Songs - Germany</h1></Item>
            <Item class="playlist"><h2>Spotify &#x2022; 50 songs</h2></Item>  
          </Grid>
          <Grid items xs={1.7} sx={{ borderRadius: 3, paddingTop: "1.5%", paddingLeft: "1.5%", paddingBottom: "1%", marginRight: "2rem", marginBottom:"2rem", '&:hover': {background: "#343434", transition: "0.25s", cursor: 'pointer'}}} backgroundColor="#242424" 
            onClick={() => changeCurrentPlaylist("37i9dQZEVXbMwmF30ppw50")}>
            <Item class="playlist"><img src="https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_gb_large.jpg" alt="selected playlist" width="86%"/></Item>
            <Item class="playlist"><h1>Top Songs - United Kingdom</h1></Item>
            <Item class="playlist"><h2>Spotify &#x2022; 50 songs</h2></Item>  
          </Grid>   
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1, pb: 0, paddingTop: "1.5rem", paddingLeft: "10rem", marginBottom: "-2rem", maxWidth: '100vw' }} elevation={0}>        
        <Grid container>
          <Grid class="body" item xs={6} fontWeightRegular={500}>
            <Item ><h2>Playlists</h2></Item>
            <Item ><h3>Your Personal Playlists to Look At</h3></Item>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{paddingTop: "1.5rem", paddingBottom: "2rem", paddingLeft: "10rem",}} elevation={0}>
        <Grid container>
        {playlists.map((playlist) => (
        <Grid items xs={1.7} sx={{ borderRadius: 3, paddingTop: "1.5%", paddingLeft: "1.5%", paddingBottom: "1%", marginRight: "2rem", marginBottom:"2rem", '&:hover': {background: "#343434", transition: "0.25s", cursor: 'pointer'}}} backgroundColor="#242424" 
            onClick={() => changeCurrentPlaylist(playlist.id)}>
              <Item class="playlist"><img src={playlist.images} alt="selected playlist" width="86%"/></Item>
              <Item class="playlist"><h1>{playlist.name}</h1></Item>
              <Item class="playlist"><h2>{playlist.owner} &#x2022; {playlist.tracks} songs</h2></Item>  
          </Grid>
            ))};
        </Grid>
      </Box>
    </>

  );
}