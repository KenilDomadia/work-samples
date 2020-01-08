import * as React from 'react';
import { JobFilterContainer, RightFiltersContainer, StyledDropdown, LeftFiltersContainer, ClearFilters, TotalJobsView, SortOrder } from './jobFilter.style';
import { ContentCategoriesFilters, IndustriesFilters, StatusFilters, JobSortValues } from '../../Data/JobFilters';

const getDropDownOptions = (items) =>
  items.map((item) => ({
    key: item,
    text: item,
    value: item
  }));
const ContentCategoriesOptions = getDropDownOptions(ContentCategoriesFilters);

const IndustriesOptions = getDropDownOptions(IndustriesFilters);

const StatusOptions = getDropDownOptions(StatusFilters);

const JobSortOptions = getDropDownOptions(JobSortValues);

export default function JobFilters(props) {
  const { from = 0, to = 10, total = 100 } = props;
  return (
    <JobFilterContainer>
      <RightFiltersContainer>
        <StyledDropdown options={ContentCategoriesOptions} defaultValue={ContentCategoriesOptions[0].value} selection style={{ minWidth: '195px' }} />
        <StyledDropdown options={IndustriesOptions} defaultValue={IndustriesOptions[0].value} selection style={{ minWidth: '140px' }} />
        <StyledDropdown options={StatusOptions} defaultValue={StatusOptions[0].value} selection style={{ minWidth: '100px' }} />
        <ClearFilters>Clear all</ClearFilters>
      </RightFiltersContainer>
      <LeftFiltersContainer>
        <TotalJobsView>
          Displaying {from}-{to} of {total} jobs
        </TotalJobsView>
        <SortOrder options={JobSortOptions} defaultValue={JobSortOptions[0].value} selection />
      </LeftFiltersContainer>
    </JobFilterContainer>
  );
}
