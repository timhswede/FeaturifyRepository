import axios from "axios";
import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useStateProvider } from "../utils/StateProvider";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Input, TextField } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { InputBase } from '@mui/material';
import useForm from "./AdvSearchInput";
import useArtist from "./AdvSearchArtist";
import useDate from "./AdvSearchDate";
import useGenre from "./AdvSearchGenre";


export default function AdvSearch() {
  const [{ token }] = useStateProvider();
  const [tracks, setTracks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null, clickCount: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [formValue, Form] = useForm("");
  const [artistValue, Artist] = useArtist("");
  const [dateValue, Date] = useDate("");
  const [genreValue, Genre] = useGenre("");

  var inputArtistValue = ("");
  var inputDateValue = ("");
  var inputGenreValue = ("");

  async function search() {
    if (artistValue) {
      inputArtistValue = " artist:" + artistValue
    }
    if (dateValue) {
      inputDateValue = " year:" + dateValue
    }
    if (genreValue) {
      inputGenreValue = " genre:" + genreValue
    }
    search = formValue + inputArtistValue + inputDateValue + inputGenreValue;

    //    search = searchInput + " year:" + yearInput + " genre:" + genreInput;
    console.log("Search for " + search);
    if (token && search) {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${search}&type=track&limit=50`, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });

        const trackItems = await Promise.all(
          response.data.tracks.items.map(async (tracks) => {
            const audioFeatures = await axios.get(`https://api.spotify.com/v1/audio-features/${tracks.id}`, {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            });
            return {
              id: tracks.id,
              total: tracks.total,
              name: tracks.name,
              artist: tracks.artists[0].name,
              artistId: tracks.artists[0].id,
              album: tracks.album.name,
              image: tracks.album.images[0].url,
              track_number: tracks.album.track_number,
              popularity: tracks.popularity,
              genre: tracks.album.genre,
              release_date: tracks.album.release_date,
              danceability: Math.round(audioFeatures.data.danceability * 100),
              energy: Math.round(audioFeatures.data.energy * 100),
              acousticness: Math.round(audioFeatures.data.acousticness * 100),
              instrumentalness: Math.round(audioFeatures.data.instrumentalness * 100),
              valence: Math.round(audioFeatures.data.valence * 100),
              speechiness: Math.round(audioFeatures.data.speechiness * 100),
            };
          })
        );
        setTracks(trackItems);
      } catch (error) {
        console.error(error);
      }
    }
  }

  console.log(tracks);

  const sortedTracks = React.useMemo(() => {
    let sortableTracks = [...tracks];
    if (sortConfig.key) {
      sortableTracks.sort((a, b) => {
        const sortDirection = sortConfig.direction === "descending" ? 1 : -1;
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
        if (valueA < valueB) { return sortDirection * -1; }
        if (valueA > valueB) { return sortDirection; }
      });
    }
    return sortableTracks;
  }, [tracks, sortConfig]);
  
  const handleSort = (property) => {
    let direction = "ascending";
    if (sortConfig.key === property) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } 
      else if (sortConfig.direction === "descending") {
        setSortConfig({ key: null, direction: null, clickCount: 0 });
        return;
      }
    }
    setSortConfig({ key: property, direction, clickCount: sortConfig.clickCount + 1 });
  };

  const createSortHandler = (property) => (event) => { handleSort(property); };
  const Item = styled(Paper)(({ theme }) => ({ boxShadow: 'none', backgroundColor: '#141414', padding: theme.spacing(1), textAlign: 'center', color: '#FFFFFFFF'}));

  return (
    <>
      <Box sx={{ flexGrow: 1, pb: 0, paddingTop: "1.5rem", paddingLeft: "10rem", marginBottom: "-2rem", maxWidth: '100vw', background: 'rgb(20, 20, 20)'}} elevation={0}>        
        <Grid container>
          <Grid class="body" item xs={6} fontWeightRegular={500}>
            <Item ><h2>Advanced Search</h2></Item>
            <Item ><h3>Enter Words Into Any Field To Search</h3></Item>
          </Grid>
        </Grid>
      </Box>
      <Box  sx={{ flexGrow: 1, ml: "7rem", mr: "7rem", mt: "4rem", mb: "3rem", pb: 0, paddingLeft: "3rem", maxWidth: '100vw', maxHeight: '100vh'}} elevation={0}>
        
          <Item sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 230, borderRadius: 6, height: "2.3rem", color: 'white', background: 'rgb(20, 20, 20)', fontWeight: 500 }}>Word</Item> {Form}
          <Item sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 230, borderRadius: 6, height: "2.3rem", color: 'white', background: 'rgb(20, 20, 20)', fontWeight: 500 }}>Artist</Item> {Artist}
          <Item sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 230, borderRadius: 6, height: "2.3rem", color: 'white', background: 'rgb(20, 20, 20)', fontWeight: 500 }}>Year</Item> {Date}
          <Item sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 230, borderRadius: 6, height: "2.3rem", color: 'white', background: 'rgb(20, 20, 20)', fontWeight: 500 }}>Genre</Item> {Genre}
          <Item sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 50, borderRadius: 6, height: "2.3rem", marginBottom: "1rem"  }}>
          <IconButton type="button" sx={{ p: '10px', background: 'white', marginTop: "3rem"}} aria-label="search" >
            <SearchIcon onClick = {search}/>
          </IconButton>
          </Item>
          
      </Box>
      {sortedTracks.length > 0 && (
        <>  
          <Box sx={{ flexGrow: 1, pb: 0, paddingTop: "5rem", paddingLeft: "10rem", marginBottom: "-2rem", maxWidth: '100vw', maxHeight: '4rem', backgroundColor: 'transparent'}} elevation={0}>        
            <Grid container>
              <Grid class="body" item xs={6} fontWeightRegular={500}>
                <Item ><h2>Search Results</h2></Item>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ flexGrow: 1, ml: "7rem", mr: "7rem", mt: "5rem", pb: 0, paddingLeft: "3rem", maxWidth: '100vw', maxHeight: '100vh'}} elevation={0}>
            <TableContainer sx={{ borderRadius: 6,}}>
              <Table>
              <colgroup>
                <col width="8%"/>
                <col width="40%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="10%" />
                <col width="10%" />

              </colgroup>
                <TableHead  
                  sx={{
                    [`& .${tableCellClasses.root}`]: {
                      borderBottom: "none",
                      backgroundColor: '#1E1E1E',
                      color: '#c4c7ca',
                      fontWeight: 700,
                      fontSize: ".8rem",
                      letterSpacing: "2.2px",
                      paddingTop: "1.5rem",
                      paddingBottom: "2rem",
                      paddingLeft: "3rem",
                    } 
                  }}
                >
                  <TableRow>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">
                      <TableSortLabel 
                          active={sortConfig.key === "release_date"} 
                          direction={sortConfig.key === "release_date" ? sortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                          onClick={createSortHandler("release_date")}>
                            DATE
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel 
                          active={sortConfig.key === "popularity"} 
                          direction={sortConfig.key === "popularity" ? sortConfig.direction === "popularity" ? "asc" : "desc" : "asc"} 
                          onClick={createSortHandler("popularity")}>
                            POPULARITY
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel 
                          active={sortConfig.key === "valence"} 
                          direction={sortConfig.key === "valence" ? sortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                          onClick={createSortHandler("valence")}>
                            POSITIVENESS
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel 
                          active={sortConfig.key === "energy"} 
                          direction={sortConfig.key === "energy" ? sortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                          onClick={createSortHandler("energy")}>
                            ENERGY
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel 
                          active={sortConfig.key === "danceability"} 
                          direction={sortConfig.key === "danceability" ? sortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                          onClick={createSortHandler("danceability")}>
                            DANCEABILITY
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel 
                          active={sortConfig.key === "instrumentalness"} 
                          direction={sortConfig.key === "instrumentalness" ? sortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                          onClick={createSortHandler("instrumentalness")}>
                            INSTRUMENTALNESS
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel 
                          active={sortConfig.key === "acousticness"} 
                          direction={sortConfig.key === "acousticness" ? sortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                          onClick={createSortHandler("acousticness")}>
                            ACOUSTICNESS
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel 
                          active={sortConfig.key === "speechiness"} 
                          direction={sortConfig.key === "speechiness" ? sortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                          onClick={createSortHandler("speechiness")}>
                            SPEECHINESS
                        </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody 
                  sx={{
                    [`& .${tableCellClasses.root}`]: {
                      borderBottom: "none",
                      backgroundColor: '#242424',
                      color: '#c4c7ca',
                      fontWeight: 700,
                      fontSize: ".9rem",
                    }   
                  }}
                >
                  {sortedTracks.map((track) => (
                    <TableRow key={track.id}>
                      <TableCell align="right">
                        <img src={track.image} alt={track.album} width="70" />
                      </TableCell>
                      <TableCell align="left" padding="3rem">{track.name}<h3>{track.artist}</h3></TableCell>
                      <TableCell align="center">{track.release_date}</TableCell>
                      <TableCell align="center">{track.popularity}</TableCell>
                      <TableCell align="center">{track.valence}%</TableCell>
                      <TableCell align="center">{track.energy}%</TableCell>
                      <TableCell align="center">{track.danceability}%</TableCell>
                      <TableCell align="center">{track.instrumentalness}%</TableCell>
                      <TableCell align="center">{track.acousticness}%</TableCell>
                      <TableCell align="center">{track.speechiness}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )};

    </>

  );
}