import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import MediaQuery from 'react-responsive';
import { PaginationContainer, StyledPagination, StyledPaginationItem } from './index.style';

const Desktop = (props) => <MediaQuery {...props} minWidth={800} />;
const Mobile = (props) => <MediaQuery {...props} maxWidth={769} />;

function renderDesktopView(props) {
  const { totalPages = 1000 } = props;
  return (
    <StyledPagination
      boundaryRange={1}
      size="mini"
      siblingRange={1}
      totalPages={totalPages}
      defaultActivePage={1}
      nextItem={{ content: <Icon name="caret right" />, icon: true }}
      prevItem={{ content: <Icon name="caret left" />, icon: true }}
      firstItem={<StyledPaginationItem>First</StyledPaginationItem>}
      lastItem={<StyledPaginationItem>Last</StyledPaginationItem>}
    />
  );
}

function renderMobileView(props) {
  const { totalPages = 1000 } = props;
  return (
    <StyledPagination
      boundaryRange={0}
      size="mini"
      siblingRange={1}
      totalPages={totalPages}
      defaultActivePage={1}
      firstItem={null}
      lastItem={null}
      nextItem={{ content: <Icon name="caret right" />, icon: true }}
      prevItem={{ content: <Icon name="caret left" />, icon: true }}
    />
  );
}

export default function JobsPagination(props) {
  return (
    <PaginationContainer>
      <Desktop>{renderDesktopView(props)}</Desktop>
      <Mobile>{renderMobileView(props)}</Mobile>
    </PaginationContainer>
  );
}
