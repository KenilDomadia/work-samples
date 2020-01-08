import styled from 'styled-components';
import { Dropdown } from 'semantic-ui-react';

export const JobFilterContainer = styled.div`
  margin-top: 28px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.tablet`
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `};
`;

export const RightFiltersContainer = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.tablet`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 40px;
  `};
`;

export const LeftFiltersContainer = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.tablet`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

  `};
`;

export const StyledDropdown = styled(Dropdown)`
  margin-right: 16px;
  ${({ theme }) => theme.tablet`
    margin-right: 0px;
    margin-bottom: 16px;
  `};
  &.ui.selection.dropdown {
    min-height: 0px;
    padding: 6px 12px;
    border-radius: 3px;
    border: solid 1px rgba(29, 35, 48, 0.14);
    background-color: #ffffff;
    display: flex;
    align-items: center;
    color: #1d2330;
    font-size: 14px;
    ${({ theme }) => theme.tablet`
      width: 100%;
    `};
  }

  &.ui.selection.dropdown > .dropdown.icon {
    cursor: pointer;
    width: auto;
    height: auto;
    top: 50%;
    z-index: 0;
    padding: 3px;
    opacity: 0.8;
  }
`;

export const SortOrder = styled(StyledDropdown)`
  margin-right: 0px;
  min-width: '160px';
  ${({ theme }) => theme.tablet`
    margin-bottom: 0px;
  `};
`;

export const ClearFilters = styled.div`
  font-size: 14px;
  color: #8798ad;
  cursor: pointer;
`;

export const TotalJobsView = styled.div`
  font-size: 14px;
  margin-right: 16px;
  text-align: right;
  color: #1d2330;
  ${({ theme }) => theme.tablet`
    margin-right: 0px;
    margin-bottom: 12px;
  `};
`;
