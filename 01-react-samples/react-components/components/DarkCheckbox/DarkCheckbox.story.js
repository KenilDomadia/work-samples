import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DarkBackgroundDecorator from '../helpers/DarkBackgroundDecorator';
import DarkCheckbox from './';

const text = 'Choose me';

storiesOf('DarkCheckbox', module)
  .addDecorator(DarkBackgroundDecorator)
  .add('All in one', () => (
    <div style={{ padding: '25px', color: '#ffffff' }}>
      Uncontrolled inputs (dark theme):
      <br /> <br />
      <DarkCheckbox label={text} />
      <br /> <br />
      <DarkCheckbox label={text} defaultChecked={true} />
      <br /> <br />
      Controlled inputs (dark theme):
      <br /> <br />
      <DarkCheckbox checked={false} onChange={action('changed')} />
      <br /> <br />
      <DarkCheckbox checked={true} onChange={action('changed')} />
      <br /> <br />
      <DarkCheckbox disabled={true} checked={false} onChange={action('changed')} />
      <br /> <br />
      <DarkCheckbox disabled={true} checked={true} onChange={action('changed')} />
      <br /> <br />
      <DarkCheckbox label={text} checked={false} onChange={action('changed')} />
      <br /> <br />
      <DarkCheckbox label={text} checked={true} onChange={action('changed')} />
      <br /> <br />
      <DarkCheckbox label={text} disabled={true} checked={false} onChange={action('changed')} />
      <br /> <br />
      <DarkCheckbox label={text} disabled={true} checked={true} onChange={action('changed')} />
      <br /> <br />
    </div>
  ));
