"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a command.
 */
class Command {
    constructor(identifier, help, action) {
        this.identifier = identifier;
        this.help = help;
        this.onAction = action;
    }
}
exports.Command = Command;
;
