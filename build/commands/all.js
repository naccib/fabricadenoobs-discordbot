"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../parser/command");
const immutable_1 = require("immutable");
const giveRole_1 = require("./giveRole");
exports.allCommands = immutable_1.List([
    new command_1.Command('hello', 'Fala world.', (args, msg) => {
        msg.channel.sendMessage('World!');
    }),
    giveRole_1.role
]);
