import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { ChatRooms as ColdChatRooms } from "./Cold/ChatRoom";

export default {
  title: "ChatRoom",
} as Meta;

// example 1
const ColdTemplate: Story<{}> = (args) => <ColdChatRooms {...args} />;
export const Cold = ColdTemplate.bind({});
