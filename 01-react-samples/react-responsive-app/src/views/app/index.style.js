import styled, { css } from 'styled-components';
import { NotificationsNone, Apps, Search, Star, Timer } from 'styled-icons/material';
import { Briefcase } from 'styled-icons/fa-solid';
import { Pagination, PaginationItem } from 'semantic-ui-react';

export const LogoutButton = styled.button`
  font-size: 14px;
  border-radius: 8px;
  margin-top: 5px;
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
`;

export const NavBarContainer = styled.div`
  width: 64px;
  flex-shrink: 0;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding-top: 98px;
  min-height: 100vh;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
  z-index: 12;
  position: fixed;
  ${({ theme }) => theme.tablet`
    display: flex;
    flex-direction: row;
    width: 100vw;
    position: fixed;
    bottom: 0px;
    height: 48px;
    min-height: 0px;
    padding: 0px 36px;
    justify-content: space-between;
  `};
`;

export const AppContainer = styled.div`
  background-color: #fdfdfd;
  display: flex;
  ${({ theme }) => theme.tablet`
  `};
`;

const iconCSS = css`
  width: 20px;
  height: 20px;
  color: #3ebcb3;
  ${({ theme }) => theme.tablet`
    height: auto;
    width: auto;
  `};
`;

export const MarginTop = styled.div`
  margin-top: 98px;
  ${({ theme }) => theme.tablet`
    margin-top: 0px;
  `};
`;
export const BagIcon = styled(Briefcase)`
  ${iconCSS}
`;

export const SearchIcon = styled(Search)`
  ${iconCSS}
`;
export const HomeIcon = styled(Apps)`
  ${iconCSS}
`;

export const NavBarIconContainer = styled.div`
  height: 56px;
  cursor: pointer;
  ${({ theme }) => theme.tablet`
    width: 48px;
    height: 48px;
    padding: 14px;
  `};
`;

export const AppHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  padding: 0px 165px;
  top: 0px;
  width: 100vw;
  height: 64px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
  z-index: 11;
  background-color: #ffffff;
  ${({ theme }) => theme.tablet`
      left: 0px;
      padding: 0px 16px;
  `};
`;

export const ClientLogo = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
`;

export const RightItemsContainer = styled.div`
  display: flex;
`;

export const ClientInitals = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #b3e77f;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  border-radius: 50%;
`;
export const BellIconContainer = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 15px;
`;

export const NotificationIcon = styled(NotificationsNone)`
  margin: 4px 0px;
  width: 32px;
  height: 32px;
  position: absolute;
  color: rgba(0, 0, 0, 0.5);
  z-index: 0;
`;

export const NotificationCountContainer = styled.div`
  position: relative;
  top: 2px;
  right: 2px;
  float: right;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.3px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  background-color: #f25c69;
  border-radius: 50%;
`;

export const ContentContainer = styled.div`
  width: 100%;
  margin: 104px 165px 0px 165px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.tablet`
      padding: 100px 16px 50px 16px
      margin: 0px;
  `};
`;

export const ContentTitle = styled.div`
  width: 285px;
  font-size: 36px;
  color: #1d2330;
  ${({ theme }) => theme.tablet`
    width: 230px;
    font-size: 28px;
    color: #1d2330;
  `};
`;

export const JobViewContainer = styled.div`
  width: 100%;
  height: 88px;
  margin: 24px 0px 0px 0px;
  border-radius: 3px;
  border: solid 1px rgba(29, 35, 48, 0.08);
  background-color: #ffffff;
  padding: 20px 36px 20px 0px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.tablet`
    height: auto;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
  `};
`;

const getJobStatusColor = (props) => {
  switch (props.jobStatus) {
    case 'revision':
      return '#5ecaf0';
    case 'completed':
      return '#3ebcb3';
    case 'deadline_missed':
      return '#f25c69';
    case 'editorial_review':
      return '#f5a853';
    default:
      return '#5ecaf0';
  }
};

export const JobViewSideLine = styled.div`
  width: 2px;
  height: 88px;
  border: solid 4px ${getJobStatusColor};
`;

export const JobTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 34px;
  width: 32%;
  margin-right: 30px;
  ${({ theme }) => theme.tablet`
    height: auto;
    padding: 0px;
    margin: 0px;
    width: 80%;
  `};
`;
export const JobTitlePaymentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 14px;
  width: 100%;
`;
export const JobPayColumn = styled.div`
  width: 8%;
  margin-right: 30px;
  ${({ theme }) => theme.tablet`
    margin: 0px;
    width: auto;
  `};
`;
export const JobPay = styled.div`
  font-size: 18px;
  color: #1d2330;
  ${({ theme }) => theme.tablet`
    font-size: 16px;
  `};
`;

export const JobStatusColumn = styled.div`
  width: 25%;
  margin-right: 30px;
`;
export const JobStatus = styled.div`
  display: inline-block;
  padding: 3px 12px;
  max-width: 150px;
  border-radius: 14px;
  background-color: ${getJobStatusColor};
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  ${({ theme }) => theme.tablet`
    width: auto;
    margin: 0px -16px;
    padding: 2px 8px;
    font-size: 12px;
    text-align: center;
    border-radius: 0px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  `};
`;

export const JobRatingColumn = styled.div`
  width: 18%;
  margin-right: 30px;
`;

export const JobRating = styled.div`
  display: flex;
  min-width: 90px;
  ${({ theme }) => theme.tablet`
    min-width: 0px;
    width: auto;
    align-items: center;
    justify-content: center;
  `};
`;

const RatingIconCSS = css`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

export const StarIcon = styled(Star)`
  ${RatingIconCSS}
  fill: #ffdd6a;
`;

export const TimerIcon = styled(Timer)`
  ${RatingIconCSS}
`;

export const Rating = styled.span`
  font-size: 14px;
  color: #1d2330;
`;

export const JobActionColumn = styled.div``;

const getActionBackgroundColor = (props) => {
  switch (props.action.toLowerCase()) {
    case 'revise':
      return '#3ebcb3';
    default:
      return '#ffffff';
  }
};

const getActionTextColor = (props) => {
  switch (props.action.toLowerCase()) {
    case 'revise':
      return '#ffffff';
    default:
      return '#3ebcb3';
  }
};

export const JobActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 124px;
  padding: 8px 0px;
  border-radius: 4px;
  text-transform: capitalize;
  border: solid 1px #3ebcb3;
  background-color: ${getActionBackgroundColor};
  font-size: 16px;
  color: ${getActionTextColor};
  cursor: pointer;
  ${({ theme }) => theme.tablet`
    padding: 6px 0px;
  `};
`;

export const JobTitle = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  max-width: 380px;
  height: 20px;
  font-size: 16px;
  color: #000000;
`;

export const JobTagsContainer = styled.div`
  display: flex;
  margin-top: 8px;
  font-size: 14px;
  color: #1d2330;
  ${({ theme }) => theme.tablet`
    margin-top: 12px;
  `};
`;
export const Divider = styled.div`
  width: 100%;
  margin: 16px -16px;
  border: 0.5px solid rgba(0, 0, 0, 0.05);
`;
export const JobTag = styled.div``;

export const TagDivder = styled.div`
  width: 1px;
  height: 10px;
  background-color: #1d2330;
  margin: auto 10px;
`;

export const TagContainer = styled.div`
  display: flex;
`;

export const JobRatingActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const PaginationContainer = styled.div`
  margin: 64px auto;
`;

export const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: center;
  width: 100%;
  &.ui.mini.menu {
    font-size: 16px;
    border-radius: 3px;
    border: none;
    background: transparent;
    box-shadow: none;
  }
  &.ui.menu {
    min-height: 0px;
  }
  &.ui.pagination.menu .active.item {
    background-color: #3ebcb3;
    color: white;
  }
  &.ui.pagination.menu .item {
    outline: none;
    min-width: 36px;
    min-height: 36px;
    padding: 0px 4px;
    color: #1d2330;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
  }
  
`;
export const StyledPaginationItem = styled(PaginationItem)`
  margin: 0px 20px;
  border-radius: 3px !important;
  border: solid 1px rgba(106, 106, 106, 0.08) !important;
  background-color: #ffffff !important;
  padding: 8px 12px !important;
`;
