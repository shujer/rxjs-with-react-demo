import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import ShareApp from "./Share";

export default {
  title: "Share",
  component: ShareApp,
} as Meta;
// example 1
const Template: Story<{}> = (args) => <ShareApp {...args} />;
export const Share = Template.bind({});