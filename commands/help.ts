import { CommandFunction } from './index';

export const helpCommand: CommandFunction = (args, context) => {
    context.addLine('system', context.helpText);
};
