import React, { useEffect } from "react";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import { reducerCases } from "./utils/Constants";
import { useStateProvider } from "./utils/StateProvider";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import Tracks from "./components/Tracks";
import Playlists from "./components/Playlists";
import Artist from "./components/Artist";

export default function App() {
  const [{ token }, dispatch] = useStateProvider();
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split("&")[0].split("=")[1];
      if (token) {
        dispatch({ type: reducerCases.SET_TOKEN, token });
      window.history.replaceState(null, "", "/");
    }
  }
    document.title = "Featurify";
  }, [dispatch, token]);

  return (
    <div className="App">
      {token ? <Spotify /> : <Login />}
    </div>
  );
}
