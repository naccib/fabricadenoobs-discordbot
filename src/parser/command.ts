import { Message, Client } from 'discord.js';

/**
 * Command action type.
 */
type commandAction = (args : Array<string>, message : Message, context : Client) => void;

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