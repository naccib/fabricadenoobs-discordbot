"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const parser_1 = require("./parser/parser");
const all_1 = require("./commands/all");
const handleMessage = (message, context) => {
    if (message.author.id !== context.user.id) {
        console.log(`Got message at ${message.guild.name}#${message.channel.toString()}`);
        const [command, args] = parser_1.parseMessage(message, config_1.config.prefixes, all_1.allCommands);
        if (command)
            command.onAction(args, message, context);
    }
};
const bot = new discord_js_1.Client();
bot.on('message', msg => handleMessage(msg, bot));
bot.login(config_1.config.token);
