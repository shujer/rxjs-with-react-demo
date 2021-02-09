import { withConsole } from "@storybook/addon-console";

const optionsCallback = (options) => ({
  panelExclude: [...options.panelExclude, /Warning|warn/],
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (storyFn, context) => withConsole(optionsCallback)(storyFn)(context),
];
