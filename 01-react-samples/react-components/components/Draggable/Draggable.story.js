import React from 'react';
import { css } from 'emotion';
import { storiesOf } from '@storybook/react';
import Draggable from './';

const s = {
  drag: css`
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 250px;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 100px;
    left: 100px;
  `,
  dragHeader: css`
    background: #8860d0;
    height: 40px;
    display: flex;
    align-items: center;
    color: white;
    padding: 0 10px;
  `,
  dragBody: css`
    display: flex;
    flex: 1;
    padding: 10px;
  `
};

storiesOf('Draggable', module).add('Draggable', () => (
  <Draggable left={100} top={100}>
    <div className={s.drag}>
      <Draggable.Handle>
        <div className={s.dragHeader}>Drag me</div>
      </Draggable.Handle>
      <div className={s.dragBody}>Drag Me from the header</div>
    </div>
  </Draggable>
));
