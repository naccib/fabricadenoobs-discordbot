import { Command } from '../parser/command';
import { List } from 'immutable';
import { role } from './giveRole';

export const allCommands : List<Command> = List([
    new Command('hello', 'Fala world.', (args, msg) => {
        msg.channel.sendMessage('World!');
    }),
    role
]);