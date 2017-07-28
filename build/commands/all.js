"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../parser/command");
const immutable_1 = require("immutable");
const giveRole_1 = require("./giveRole");
const help_1 = require("./help");
exports.allCommands = immutable_1.List([
    new command_1.Command('help', 'Diz essa mensagem.', (args, msg) => {
        const helpEmbed = help_1.buildHelpEmbed(immutable_1.List(exports.allCommands));
        console.assert(helpEmbed != undefined, 'Help is undefined!');
        msg.channel.sendEmbed(helpEmbed);
    }),
    giveRole_1.role
]);
