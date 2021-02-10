import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { ChatRooms as SubjectRoom } from "./Subject/ChatRoom";
import { ChatRooms as BehaviorRoom } from "./BehaviorSubject/ChatRoom";
import { ChatRooms as ReplayRoom } from "./ReplaySubject/ChatRoom";
import { ChatRooms as RefCountRoom } from "./RefCount/ChatRoom";

export default {
  title: "ChatRoom",
} as Meta;

// example 1
const SubjectTemplate: Story<{}> = (args) => <SubjectRoom {...args} />;
export const Subject = SubjectTemplate.bind({});

// example 2
const BehaviorTemplate: Story<{}> = (args) => <BehaviorRoom {...args} />;
export const BehaviorSubject = BehaviorTemplate.bind({});

// example 3
const ReplayTemplate: Story<{}> = (args) => <ReplayRoom {...args} />;
export const ReplaySubject = ReplayTemplate.bind({});

// example 4
const RefCountTemplate: Story<{}> = (args) => <RefCountRoom {...args} />;
export const RefCount = RefCountTemplate.bind({});
