import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

export default function Tracks() {
  const [{ token, selectedPlaylist, selectedPlaylistId }, dispatch] = useStateProvider();
  const [tracks, setTracks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null, clickCount: 0 });
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [recommendedSortConfig, recommendedSetSortConfig] = useState({ key: null, direction: null, clickCount: 0 });

  function chunkRequest(arr, chunkSize) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }
  
  useEffect(() => {
    const getInitialPlaylist = async () => {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const selectedPlaylist = {
        id: response.data.id,
        name: response.data.name,
        owner: response.data.owner.display_name,
        tracks: response.data.tracks.total,
        image: response.data.images[0].url,
      };
      dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
    };
    getInitialPlaylist();
  }, [token, dispatch, selectedPlaylistId]);

  console.log(selectedPlaylist);

  useEffect(() => {
    const getTracks = async () => {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks?limit=50`, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
    
        const totalTracks = response.data.total;
        const numRequests = Math.ceil(totalTracks / 50);
    
        let allTracks = [];
        for (let i = 0; i < numRequests; i++) {
          const offset = i * 50;
          const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks?offset=${offset}&limit=50`, {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
    
          const tracks = tracksResponse.data.items;
          allTracks.push(...tracks);
        }
    
        const chunks = chunkRequest(allTracks, 50);
    
        const trackItems = await Promise.all(
          chunks.map(async (chunk) => {
            const trackIds = chunk.map((item) => item.track.id).join(",");
            const tracksInfo = await axios.get(`https://api.spotify.com/v1/audio-features/?ids=${trackIds}`, {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            });
    
            return chunk.map((item, index) => {
              const audioFeatures = tracksInfo.data.audio_features[index];
    
              return {
                id: item.track.id,
                total: item.track.total,
                name: item.track.name,
                artist: item.track.artists[0].name,
                album: item.track.album.name,
                image: item.track.album.images[0].url,
                track_number: item.track.album.track_number,
                popularity: item.track.popularity,
                danceability: Math.round(audioFeatures.danceability * 100),
                energy: Math.round(audioFeatures.energy * 100),
                acousticness: Math.round(audioFeatures.acousticness * 100),
                instrumentalness: Math.round(audioFeatures.instrumentalness * 100),
                valence: Math.round(audioFeatures.valence * 100),
                speechiness: Math.round(audioFeatures.speechiness * 100),
              };
            });
          })
        );
    
        setTracks(trackItems.flat());
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedPlaylistId && token) {
      getTracks();
    }
  }, [selectedPlaylistId, token]);

  console.log(tracks);

  const getAverage = (tracks) => {
    const trackCount = tracks.length;
    if (trackCount === 0) {
      return null;
    }
    const sum = tracks.reduce((af, track) => {
      return {
        danceability: af.danceability + track.danceability,
        energy: af.energy + track.energy,
        acousticness: af.acousticness + track.acousticness,
        instrumentalness: af.instrumentalness + track.instrumentalness,
        liveness: af.liveness + track.liveness,
        valence: af.valence + track.valence,
        speechiness: af.speechiness + track.speechiness,
      };
    });
  

    return {
      danceability: Math.round(sum.danceability / trackCount),
      energy: Math.round(sum.energy / trackCount),
      acousticness: Math.round(sum.acousticness / trackCount),
      instrumentalness: Math.round(sum.instrumentalness / trackCount),
      valence: Math.round(sum.valence / trackCount),
      speechiness: Math.round(sum.speechiness / trackCount),
    };
  };
  
  const average = getAverage(tracks);

  const randomizeTracks = tracks.sort(() => 0.5 - Math.random());

  const prevTracksRef = useRef();
  useEffect(() => {
    const randomTrackIdss = (randomizeTracks.slice(0, 5).map(track => track.id)).join(",");
    const getRecommendations = async () => {
      const URL = 'https://api.spotify.com/v1/recommendations';
      try {
  
        const minMax = {
          minDanceability: Math.max(0, ((average.danceability/100) - 0.15)),
          maxDanceability: Math.min(1, ((average.danceability/100) + 0.15)),
          minEnergy: Math.max(0, ((average.energy/100) - 0.15)),
          maxEnergy: Math.min(1, ((average.energy/100) + 0.15)),
          minAcousticness: Math.max(0, ((average.acousticness/100) - 0.15)),
          maxAcousticness: Math.min(1, ((average.acousticness/100) + 0.15)),
          minInstrumentalness: Math.max(0, ((average.instrumentalness/100) - 0.15)),
          maxInstrumentalness: Math.min(1, ((average.instrumentalness/100) + 0.15)),
          minValence: Math.max(0, ((average.valence/100) - 0.15)),
          maxValence: Math.min(1, ((average.valence/100) + 0.15)),
          minSpeechiness: Math.max(0, ((average.speechiness/100) - 0.15)),
          maxSpeechiness: Math.min(1, ((average.speechiness/100) + 0.15))
        };

        const response = await axios.get(`${URL}?seed_tracks=${randomTrackIdss}&limit=20&min_danceability=${minMax.minDanceability}&max_danceability=${minMax.maxDanceability}&min_energy=${minMax.minEnergy}&max_energy=${minMax.maxEnergy}&min_acousticness=${minMax.minAcousticness}&max_acousticness=${minMax.maxAcousticness}&min_instrumentalness=${minMax.minInstrumentalness}&max_instrumentalness=${minMax.maxInstrumentalness}&min_valence=${minMax.minValence}&max_valence=${minMax.maxValence}&min_speechiness=${minMax.minSpeechiness}&max_speechiness=${minMax.maxSpeechiness}`, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
  
        const trackRecommendedItems = await Promise.all(
          response.data.tracks.map(async (item) => {
            const audioFeatures = await axios.get(`https://api.spotify.com/v1/audio-features/${item.id}`, {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            });
            return {
              id: item.id,
              total: item.total,
              name: item.name,
              artist: item.artists[0].name,
              album: item.album.name,
              image: item.album.images[0].url,
              track_number: item.album.track_number,
              danceability: Math.round(audioFeatures.data.danceability * 100),
              energy: Math.round(audioFeatures.data.energy * 100),
              acousticness: Math.round(audioFeatures.data.acousticness * 100),
              instrumentalness: Math.round(audioFeatures.data.instrumentalness * 100),
              valence: Math.round(audioFeatures.data.valence * 100),
              speechiness: Math.round(audioFeatures.data.speechiness * 100),
            };
          })
        );
        setRecommendedSongs(trackRecommendedItems);
      } catch (error) {
        console.error(error);
      }
    };
    if (prevTracksRef.current !== tracks) {
      prevTracksRef.current = tracks;
      getRecommendations();
    }
  }, [tracks, average, token, randomizeTracks]);
  console.log(recommendedSongs);

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

  const recommendedSortedTracks = React.useMemo(() => {
    let recommendedSortableTracks = [...recommendedSongs];
    if (recommendedSortConfig.key) {
      recommendedSortableTracks.sort((a, b) => {
        const sortDirection = recommendedSortConfig.direction === "descending" ? 1 : -1;
        const valueA = a[recommendedSortConfig.key];
        const valueB = b[recommendedSortConfig.key];
        if (valueA < valueB) { return sortDirection * -1; }
        if (valueA > valueB) { return sortDirection; }
      });
    }
    return recommendedSortableTracks;
  }, [recommendedSongs, recommendedSortConfig]);
  
  const handleRecommendedSort = (property) => {
    let direction = "ascending";
    if (recommendedSortConfig.key === property) {
      if (recommendedSortConfig.direction === "ascending") {
        direction = "descending";
      } 
      else if (recommendedSortConfig.direction === "descending") {
        recommendedSetSortConfig({ key: null, direction: null, clickCount: 0 });
        return;
      }
    }
    recommendedSetSortConfig({ key: property, direction, clickCount: recommendedSortConfig.clickCount + 1 });
  };
  const createSortHandler = (property) => (event) => { handleSort(property); };
  const createRecommendedSortHandler = (property) => (event) => { handleRecommendedSort(property); };

  const Item = styled(Paper)(({ theme }) => ({ boxShadow: 'none', backgroundColor: theme.palette.mode === 'dark' ? '#141414' : '#141414', padding: theme.spacing(1), textAlign: 'center', color: '#FFFFFFFF', }));

  return (
    <div class="body_content">
    {tracks.length === 0 ? (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ flexGrow: 1, m: "10rem", pb: 0,  maxWidth: '100vw', maxHeight: '100vh' }} elevation={0}>
          <Item sx={{ flexGrow: 1, m: "7rem", pb: 0}}><CircularProgress size={"8rem"} /></Item>
          <Item sx={{  pb: 0, fontSize: "1.2rem"}}><h1>Loading...</h1></Item>
        </Box>
      </div>
    ) : (
      <>
        <Box class="body" sx={{ flexGrow: 1, m: 5, pb: 0, maxWidth: '100vw', maxHeight: '100vh' }} elevation={0}>
              <Grid container>
                <Grid item xs={2}>
                  <Item>{selectedPlaylist && (<img src={selectedPlaylist.image} alt="selected playlist" width="220"/>)}</Item>
                </Grid>
                <Grid item xs={6} fontWeightRegular={500}>
                  <Item><h1>PLAYLIST</h1></Item>
                  <Item>{selectedPlaylist && (<h2>{selectedPlaylist.name}</h2>)}</Item>
                  <Item>{selectedPlaylist && (<h3>{selectedPlaylist.owner} &#x2022; {selectedPlaylist.tracks} Songs</h3>)}</Item>
                  <Item></Item>
                  <Item></Item>
                  <Item><h4>Stats</h4></Item>
                  <Item><h5>POSITIVENESS</h5>{average && (<h6>{average.valence}%</h6>)}</Item>
                  <Item><h5>ENERGY</h5>{average && (<h6>{average.energy}%</h6>)}</Item>
                  <Item><h5>DANCEABILITY</h5>{average && (<h6>{average.danceability}%</h6>)}</Item>
                  <Item><h5>INSTRUMENTALNESS</h5>{average && (<h6>{average.instrumentalness}%</h6>)}</Item>
                  <Item><h5>ACOUSTICNESS</h5>{average && (<h6>{average.acousticness}%</h6>)}</Item>
                  <Item><h5>SPEECHINESS</h5>{average && (<h6>{average.speechiness}%</h6>)}</Item>

                  
                </Grid>
              </Grid>
            </Box>
        <Box>
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

        <Box class="body" sx={{ flexGrow: 1, m: 5, pb: 7 }} elevation={0}>
          <Grid container>
            <Grid item xs={6} fontWeightRegular={500}>
              <Item></Item><Item></Item><Item></Item><Item></Item><Item></Item><Item></Item>
              <Item><h2>Recommended</h2></Item>
              <Item><h3>Recommendations Tuned Based on Audio Features</h3></Item>
            </Grid>
          </Grid>
        </Box>            

        <Box>
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
                        active={recommendedSortConfig.key === "valence"} 
                        direction={recommendedSortConfig.key === "valence" ? recommendedSortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                        onClick={createRecommendedSortHandler("valence")}>
                          POSITIVENESS
                      </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel 
                        active={recommendedSortConfig.key === "energy"} 
                        direction={recommendedSortConfig.key === "energy" ? recommendedSortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                        onClick={createRecommendedSortHandler("energy")}>
                          ENERGY
                      </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel 
                        active={recommendedSortConfig.key === "danceability"} 
                        direction={recommendedSortConfig.key === "danceability" ? recommendedSortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                        onClick={createRecommendedSortHandler("danceability")}>
                          DANCEABILITY
                      </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel 
                        active={recommendedSortConfig.key === "instrumentalness"} 
                        direction={recommendedSortConfig.key === "instrumentalness" ? recommendedSortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                        onClick={createRecommendedSortHandler("instrumentalness")}>
                          INSTRUMENTALNESS
                      </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel 
                        active={recommendedSortConfig.key === "acousticness"} 
                        direction={recommendedSortConfig.key === "acousticness" ? recommendedSortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                        onClick={createRecommendedSortHandler("acousticness")}>
                          ACOUSTICNESS
                      </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel 
                        active={recommendedSortConfig.key === "speechiness"} 
                        direction={recommendedSortConfig.key === "speechiness" ? recommendedSortConfig.direction === "ascending" ? "asc" : "desc" : "asc"} 
                        onClick={createRecommendedSortHandler("speechiness")}>
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
                {recommendedSortedTracks.map((track) => (
                  <TableRow key={track.id}>
                    <TableCell align="right">
                      <img src={track.image} alt={track.album} width="70" />
                    </TableCell>
                    <TableCell align="left">{track.name}<h3>{track.artist}</h3></TableCell>
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
      )}
    </div>
      
  );
}
