import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  max-width: 100vw;
  max-height: 100vh;
  padding: 5px 80px;
  background: #1111111;
  height: 10%px;
  display: flex;
  justify-content: space-between;
  overflow-y: scroll
  z-index: 10;
`;

export const NavLink = styled(Link)`
  color: #white;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  font-weight: 400;
  padding-left: 5rem;
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #white;

  
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;
  /* width: 100vw;
  white-space: nowrap; */
  @media screen and (max-width: 1000px) {
    display: none;
  }
  padding-right: 3.8rem;

`;
