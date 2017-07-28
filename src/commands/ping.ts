import { Command } from '../parser/command';
import { Timer } from '../timer';
import { Role, Guild, Message, RichEmbed, Channel } from 'discord.js';

export const ping = new Command('ping', 'Escreve o ping do bot.', (args, msg, ctx) => {
    const timer = new Timer();

    msg.channel.send(':timer: Pinging...')
    .then(sentMsg => {
        (sentMsg as Message).edit(`:timer: **${timer.end()}** ms`);
    });
});