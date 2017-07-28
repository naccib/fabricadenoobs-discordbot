import { Command } from '../parser/command';
import { List } from 'immutable';
import { role } from './giveRole';
import { ping } from './ping';
import { buildHelpEmbed } from './help';

export const allCommands : List<Command> = List([
    new Command('help', 'Diz essa mensagem.', (args, msg) => {
        const helpEmbed = buildHelpEmbed(List(allCommands));
        
        console.assert(helpEmbed != undefined, 'Help is undefined!');

        msg.channel.send({
            embed: helpEmbed
        });
    }),
    role,
    ping
]);