import React from 'react';
import { Button } from '@storybook/react/demo';
import Timer from './index';

export default { title: 'Button' };

export const withText = () => <Button>Hello Button</Button>;

export const TimerP = () => <Timer setHour={() => {}} setMinute={() => {}} />;

export const withEmoji = () => (
  <Button>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
