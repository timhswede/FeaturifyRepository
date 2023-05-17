import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import Tracks from "./Tracks";
import { reducerCases } from "../utils/Constants";
import AppBar from './AppBar';
import Playlists from "./Playlists";
import AdvSearch from "./AdvSearch";
import Artist from "./Artist";

export default function Spotify() {
  const [{ token, selectedPlaylistId, selectedArtistId}, dispatch] = useStateProvider();

  const bodyRef = useRef();
  const [showAdvSearch, setShowAdvSearch] = useState();

  const toggleShowAdvSearch = () => {
    setShowAdvSearch(prevState => !prevState);
  }

  
  useEffect(() => {
    const getUserInfo = async () => {
      const { data } = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const userInfo = {
        userId: data.id,
        userUrl: data.external_urls.spotify,
        name: data.display_name,
      };
      dispatch({ type: reducerCases.SET_USER, userInfo });
    };
    getUserInfo();
  }, [dispatch, token]);

  return (
    <Container>
      <div className="spotify__body">
        <AppBar toggleShowAdvSearch={toggleShowAdvSearch} />
        <div>
        {showAdvSearch && <AdvSearch />}
          {!showAdvSearch && (
            <>
              {selectedPlaylistId && <Tracks />}
              {selectedArtistId && <Artist />}
              {!selectedPlaylistId && !selectedArtistId && <Playlists />}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  overflow: ;
  display: grid;
  grid-template-rows: 100vh 15vh;
  .spotify__body {
    overflow: auto;
    display: grid;
    grid-template-rows: 5vw 5vw;
    width: 100%;
    background-color: rgb(20, 20, 20);
  }
`;
