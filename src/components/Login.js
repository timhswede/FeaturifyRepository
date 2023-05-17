import React from "react";
import styled from "styled-components";
import { default as logo } from '../images/Featurify_.png';


export default function Login() {
  const handleClick = async () => {
    const client_id = "586c11952ee44ee2884cb0fc779c4450";
    const redirect_uri = "http://localhost:3000";
    const api_uri = "https://accounts.spotify.com/authorize";
    const scope = [
      "user-read-private",
      "user-read-email",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-top-read",
      "playlist-read-private",
    ];
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
      " "
    )}&response_type=token&show_dialog=true`;
  };
  return (
    <Container>
      <img width="500" src={logo}/>
      <h1>Music analysis and discovery,</h1>
      <h1>powered by Spotify.</h1>
      <button onClick={handleClick}>LOG IN WITH SPOTIFY</button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #111111;
  color: white;
  img {
    margin-bottom: 3rem;
  }
  h1 {
    font-size: 1.2rem;
    font-weight: 400;
    text-align: left;
    padding: 0;
    margin-bottom: -.5rem;
    align-text: left;


  }
  button {
    padding: 1rem 5rem;
    border-radius: 5rem;
    background-color: #1db954;
    color: #f0f0f0;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 600;
    margin-top: 20rem;
  }
  button:hover {
    background-color:#0EE158;
    transition: 0.25s;
}
`;
