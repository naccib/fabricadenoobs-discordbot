import { Message } from 'discord.js';
import { Command, argsType } from './command';
import { List } from 'immutable';

export const parseMessage = (message : Message, prefixes : Array<string>, commands : List<Command>) : [Command, argsType] => {
    if(!isCommand(message.cleanContent, prefixes))
        return [undefined, List([])];

    const content  = removePrefixes(message.cleanContent, prefixes);
    const splitted = content.split(' ');

    const identifier = splitted[0];
    const args = splitted.slice(1, splitted.length); 

    console.log(`[PARSER] Found candidate command with identifier: "${identifier}" and ${args.length} arguments: \n${args.toString()}`);

    const foundCommand = findCommand(identifier, commands);

    if(foundCommand == undefined)
        console.log(`[PARSER] Could not find command with identifier "${identifier}".`);

    return [foundCommand, List(args)];
};

const isCommand = (text: string, prefixes: Array<string>)  : boolean =>
    prefixes.find(prefix => {
        return text.startsWith(prefix);
    }) != undefined;

/**
 * Removes any prefix from the given string.
 */
const removePrefixes = (text : string, prefixes : Array<string>) : string => {
    const removePrefix = (text : string, prefix : string) : string => {
        if(text.startsWith(prefix))
            return text.substring(prefix.length, text.length - prefix.length + 1);
        else
            return text;
    };

    let result = text; // mutability :(

    prefixes.forEach(prefix => {
        result = removePrefix(result, prefix);
    });

    return result;
};

const findCommand = (identifier : string, commands : List<Command>) : Command => {
    return commands.find(command => command.identifier === identifier);
};
