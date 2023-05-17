import React, { useContext, useState } from 'react';
import { Nav, NavLink, Bars, NavMenu } from './AppBarElements';
import { default as logo } from '../images/Featurify_.png';
import { reducerCases } from "../utils/Constants";
import { StateContext } from "../utils/StateProvider";
import AdvSearch from "./AdvSearch";
import Search from "./Search";
import Playlists from './Playlists';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

const Navbar = ({ toggle, homeClick, setHomeClick, toggleShowAdvSearch }) => {
  const [{ token }, dispatch] = useContext(StateContext);
  const [showAdvSearch, setShowAdvSearch] = useState(false);

  const handleHomeClick = () => {
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: null });
    dispatch({ type: reducerCases.SET_ARTIST_ID, selectedArtistId: null });
    dispatch({ toggleShowAdvSearch: true });
    setHomeClick(<Playlists/>);
  };

  const Item = styled(Paper)(({ theme }) => ({ backgroundColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#FFFFFF', padding: theme.spacing(1), textAlign: 'center', color: '#FFFFFFFF', }));

  return (
    <>
      <Nav>
        <NavLink onClick={handleHomeClick}>
          {homeClick}
          <img width="18%" src={logo} alt="logo" />
        </NavLink>
        <NavMenu >
        <Search />
          <h1>""</h1>
          <Item
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width:75, borderRadius: 6, height: "2.3rem" }}>
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search"  onClick={toggleShowAdvSearch}>
              <h6>Search</h6>
            </IconButton>
          </Item>
        </NavMenu>
      </Nav>
    </>
  );
};



export default Navbar;
