import { Client, Message } from 'discord.js';
import { config } from './config';
import { parseMessage } from './parser/parser';
import { allCommands } from './commands/all';
import { List } from 'immutable';
import { Timer } from './timer';

const handleMessage = (message : Message, context : Client) => {
    if(message.author.id !== context.user.id)
    {
        console.log(`Got message at ${message.guild.name}#${message.channel.toString()}`);
        const [command, args] = parseMessage(message, config.prefixes, allCommands);

        if(command)
            command.onAction(args, message, context);
    }
};

const bot = new Client();
let connectTimer = new Timer();

bot.on('message', msg => handleMessage(msg, bot));

bot.on('ready', () => {
    console.log(`Connected succefully in ${connectTimer.end()} ms as ${bot.user.username}.`);
});

bot.login(config.token);