"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessage = (message, prefixes, commands) => {
    if (!isCommand(message.cleanContent, prefixes))
        return [undefined, []];
    const content = removePrefixes(message.cleanContent, prefixes);
    const splitted = content.split(' ');
    const identifier = splitted[0];
    const args = splitted.slice(1, splitted.length);
    console.log(`[PARSER] Found candidate command with identifier: "${identifier}" and ${args.length} arguments: \n${args.toString()}`);
    return [findCommand(identifier, commands), args];
};
const isCommand = (text, prefixes) => prefixes.find(prefix => {
    return text.startsWith(prefix);
}) != undefined;
/**
 * Removes any prefix from the given string.
 */
const removePrefixes = (text, prefixes) => {
    const removePrefix = (text, prefix) => {
        if (text.startsWith(prefix))
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
const findCommand = (identifier, commands) => {
    return commands.find(command => command.identifier === identifier);
};
