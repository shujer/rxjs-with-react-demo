import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  MotionBall as BaseBall,
  MotionBallProps as BaseProps,
} from "./Base/MotionBall";
import {
  MotionBall as ConcatMapBall,
  MotionBallProps as ConcatMapProps,
} from "./ConcatMap/MotionBall";

import {
  MotionBall as SwitchMapBall,
  MotionBallProps as SwitchMapProps,
} from "./SwitchMap/MotionBall";

export default {
  title: "Example/MotionBall",
} as Meta;

// example 1
const BaseBallTemplate: Story<BaseProps> = (args) => <BaseBall {...args} />;
export const Base = BaseBallTemplate.bind({});

// example 2
const ConcatMapTemplate: Story<ConcatMapProps> = (args) => (
  <ConcatMapBall {...args} />
);
export const ConcatMap = ConcatMapTemplate.bind({});

// example 3
const SwitchMapTemplate: Story<SwitchMapProps> = (args) => (
  <SwitchMapBall {...args} />
);
export const SwitchMap = SwitchMapTemplate.bind({});
