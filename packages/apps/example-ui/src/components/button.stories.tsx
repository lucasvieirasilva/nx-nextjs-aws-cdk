import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';

import Button, { ButtonProps } from './button';

export default {
  title: 'Example/Button',
  component: Button,
} as Meta;

const Template: StoryFn<ButtonProps> = (args) => <Button {...args} />;

export const TextButton = Template.bind({});
TextButton.args = {
  children: 'Click Me',
};

export const EmojiButton = Template.bind({});
EmojiButton.args = {
  children: '😀 😎 👍 💯',
};

// You can add more stories here to represent different states or props
