import { Command } from '../parser/command';
import { List } from 'immutable';
import { Role, Guild, Message, RichEmbed, Channel } from 'discord.js';

export const buildHelpEmbed = (commands: List<Command>) : RichEmbed =>
    new RichEmbed({
        title: 'Equerdomacho | Ajuda',
        color: 0x42B5EF,
        description: 'Eu sou um robô feito para, a priori, dar cargos para usuários.',
        fields: commands.map(getField).toArray()
    });

const getField = (command: Command) : { name: any, value: any, inline: boolean } => { 
    return {
        name: command.identifier,
        value: command.help,
        inline: true
    };
}