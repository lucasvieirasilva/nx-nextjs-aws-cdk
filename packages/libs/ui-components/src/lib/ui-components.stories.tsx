import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';

import { UiComponents } from './ui-components';

export default {
  title: 'Example/UiComponents',
  component: UiComponents,
} as Meta;

const Template: StoryFn = (args) => <UiComponents {...args} />;

export const DefaultUiComponents = Template.bind({});
