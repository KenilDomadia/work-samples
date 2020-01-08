import * as React from 'react';
import { NavBarContainer, HomeIcon, SearchIcon, BagIcon, NavBarIconContainer } from './index.style';

const NavBarIcons = ['home', 'search', 'bag'];

const getNavBarIcon = (icon) => {
  switch (icon) {
    case 'home':
      return <HomeIcon />;
    case 'search':
      return <SearchIcon />;
    case 'bag':
      return <BagIcon />;
    default:
      return null;
  }
};

function renderNavBarIcons() {
  return (
    <React.Fragment>
      {NavBarIcons.map((icon) => (
        <NavBarIconContainer key={icon} >{getNavBarIcon(icon)}</NavBarIconContainer>
      ))}
    </React.Fragment>
  );
}

export default function NavBar() {
  return (
    <NavBarContainer>
      {renderNavBarIcons()}
    </NavBarContainer>
  );
}
