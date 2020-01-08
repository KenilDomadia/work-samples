import * as React from 'react';
import MediaQuery from 'react-responsive';
import {
  JobViewSideLine,
  JobViewContainer,
  JobTitleContainer,
  JobPay,
  JobStatus,
  JobRating,
  JobActionButton,
  JobPayColumn,
  JobStatusColumn,
  JobRatingColumn,
  JobActionColumn,
  JobTitle,
  JobTagsContainer,
  JobTag,
  TagDivder,
  TagContainer,
  StarIcon,
  Rating,
  TimerIcon,
  JobTitlePaymentContainer,
  Divider,
  JobRatingActionContainer
} from './index.style';

function renderJobTitle() {
  return <JobTitle>How to build an e-commerce platform : A step by step guideline. Please check and refer</JobTitle>;
}

const renderTag = (totalTags) => (tag, index) => (
  <TagContainer key={index}>
    <JobTag>{tag}</JobTag>
    {index < totalTags - 1 ? <TagDivder /> : null}
  </TagContainer>
);

function renderJobTags(tags) {
  const totalTags = tags.length;
  return <JobTagsContainer>{tags.map(renderTag(totalTags))}</JobTagsContainer>;
}

function getStatusText(status) {
  switch (status) {
    case 'revision_requested':
      return 'Revision Requested';
    case 'editorial_review':
      return 'Editorial Review';
    case 'deadline_missed':
      return 'Deadline Missed';

    case 'completed':
      return 'Completed';
    default:
      return 'NA';
  }
}

function renderRating(rating) {
  return <Rating>{rating}</Rating>;
}

function renderRatingIcon(status) {
  switch (status) {
    case 'revision_requested':
    case 'editorial_review':
      return <TimerIcon />;
    default:
      return <StarIcon />;
  }
}
function renderDesktop({
  status, title, tags, pay, rating, action
}) {
  return (
    <React.Fragment>
      <JobViewSideLine jobStatus={status} />
      <JobTitleContainer>
        {renderJobTitle(title)}
        {renderJobTags(tags)}
      </JobTitleContainer>
      <JobPayColumn>
        <JobPay>${pay}</JobPay>
      </JobPayColumn>
      <JobStatusColumn>
        <JobStatus jobStatus={status}>{getStatusText(status)}</JobStatus>
      </JobStatusColumn>
      <JobRatingColumn>
        <JobRating>
          {renderRatingIcon(status)}
          {renderRating(rating)}
        </JobRating>
      </JobRatingColumn>
      <JobActionColumn>
        <JobActionButton action={action}>{action}</JobActionButton>
      </JobActionColumn>
    </React.Fragment>
  );
}

function renderMobileView({
  status, title, tags, pay, rating, action
}) {
  return (
    <React.Fragment>
      <JobStatus jobStatus={status}>{getStatusText(status)}</JobStatus>
      <JobTitlePaymentContainer>
        <JobTitleContainer>{renderJobTitle(title)}</JobTitleContainer>
        <JobPayColumn>
          <JobPay>${pay}</JobPay>
        </JobPayColumn>
      </JobTitlePaymentContainer>
      {renderJobTags(tags)}
      <Divider />
      <JobRatingActionContainer>
        <JobRating>
          {renderRatingIcon(status)}
          {renderRating(rating)}
        </JobRating>
        <JobActionButton action={action}>{action}</JobActionButton>
      </JobRatingActionContainer>
    </React.Fragment>
  );
}

const Desktop = (props) => <MediaQuery {...props} minWidth={800} />;
const Mobile = (props) => <MediaQuery {...props} maxWidth={769} />;

export default function ContentView(props) {
  const {
    title, tags, pay, status, rating
  } = props;
  const action = status === 'revision_requested' ? 'revise' : 'view';
  const newProps = {
    title,
    tags,
    pay,
    status,
    rating,
    action
  };
  return (
    <JobViewContainer>
      <Desktop>{renderDesktop(newProps)}</Desktop>
      <Mobile>{renderMobileView(newProps)}</Mobile>
    </JobViewContainer>
  );
}
