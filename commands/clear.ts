import { CommandFunction } from './index';

export const clearCommand: CommandFunction = (args, context) => {
    context.clearHistory();
};
