import * as React from 'react';
import { AppHeaderContainer, ClientLogo, RightItemsContainer, ClientInitals, BellIconContainer, NotificationIcon, NotificationCountContainer } from './index.style';

export default function AppHeader() {
  return (
    <AppHeaderContainer>
      <ClientLogo>Client Logo</ClientLogo>
      <RightItemsContainer>
        <BellIconContainer>
          <NotificationIcon />
          <NotificationCountContainer>999</NotificationCountContainer>
        </BellIconContainer>
        <ClientInitals>AB</ClientInitals>
      </RightItemsContainer>
    </AppHeaderContainer>
  );
}
