import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DarkBackgroundDecorator from '../../helpers/DarkBackgroundDecorator';
import DarkAccentButton from './';
import { Icon } from '../../';

storiesOf('Button/DarkAccentButton', module)
  .addDecorator(DarkBackgroundDecorator)
  .add('all in one', () => (
    <div>
      <div>
        <DarkAccentButton onClick={action('clicked')}>
          <Icon type="search" style={{ marginRight: '6px' }} />
          Search
        </DarkAccentButton>
      </div>
      <div>
        <DarkAccentButton onClick={action('clicked')}>Export Report</DarkAccentButton>
      </div>
      <div>
        <DarkAccentButton
          selected={true}
          selectionType={DarkAccentButton.selectionType.Sapphire}
          onClick={action('clicked')}
        >
          content creation guides (4)
        </DarkAccentButton>
      </div>
      <div>
        <DarkAccentButton onClick={action('clicked')}>
          More settings
          <Icon type="angle-down" style={{ marginLeft: '6px' }} />
        </DarkAccentButton>
      </div>
      <div>
        <DarkAccentButton onClick={action('clicked')}>
          <Icon type="notification" />
        </DarkAccentButton>

        <DarkAccentButton
          onClick={action('clicked')}
          style={{ marginLeft: '20px' }}
          notification={{ count: '4' }}
        >
          <Icon type="notification" />
        </DarkAccentButton>

        <DarkAccentButton
          onClick={action('clicked')}
          style={{ marginLeft: '20px' }}
          notification={{ count: '90+' }}
        >
          <Icon type="notification" />
        </DarkAccentButton>
      </div>
      <div>
        <DarkAccentButton
          selected={true}
          selectionType={DarkAccentButton.selectionType.Sapphire}
          onClick={action('clicked')}
        >
          <Icon type="menu-2" />
        </DarkAccentButton>
        <DarkAccentButton
          selected={true}
          onClick={action('clicked')}
          style={{ marginLeft: '20px' }}
        >
          <Icon type="more-vert" />
        </DarkAccentButton>
      </div>
    </div>
  ));
