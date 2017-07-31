import { Message, Client } from 'discord.js';
import { List } from 'immutable';

export type argsType = List<string>;

/**
 * Command action type.
 */
type commandAction = (args: argsType, message: Message, context: Client) => void;

/**
 * Represents a command.
 */
export class Command
{
    identifier : string;
    help : string;
    onAction : commandAction;

    constructor(identifier: string, help: string, action: commandAction)
    {
        this.identifier = identifier;
        this.help = help;
        this.onAction = action;
    }
};