import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { Todo as BaseTodo, TodoProps as BaseTodoProps } from "./Base/Todo";
import {
  Todo as ConcatMapTodo,
  TodoProps as ConcatMapTodoProps,
} from "./ConcatMap/Todo";

import {
  Todo as SwitchMapTodo,
  TodoProps as SwitchMapTodoProps,
} from "./SwitchMap/Todo";

import {
  Todo as MergeMapTodo,
  TodoProps as MergeMapTodoProps,
} from "./MergeMap/Todo"

import {
  Todo as ExhaustMapTodo,
  TodoProps as ExhaustMapTodoProps,
} from "./ExhaustMap/Todo"

export default {
  title: "Example/Todo",
} as Meta;

// example 1
const BaseTemplate: Story<BaseTodoProps> = (args) => <BaseTodo {...args} />;
export const Base = BaseTemplate.bind({});

// example 2
const ConcatMapTodoTemplate: Story<ConcatMapTodoProps> = (args) => (
  <ConcatMapTodo {...args} />
);
export const ConcatMap = ConcatMapTodoTemplate.bind({});

// example 3
const SwitchMapTodoTemplate: Story<SwitchMapTodoProps> = (args) => (
  <SwitchMapTodo {...args} />
);
export const SwitchMap = SwitchMapTodoTemplate.bind({});


// example 4
const MergeMapTodoTemplate: Story<MergeMapTodoProps> = (args) => (
  <MergeMapTodo {...args} />
);
export const MergeMap = MergeMapTodoTemplate.bind({});

// example 5
const ExhaustMapTodoTemplate: Story<ExhaustMapTodoProps> = (args) => (
  <ExhaustMapTodo {...args} />
);
export const ExhaustMap = ExhaustMapTodoTemplate.bind({});
