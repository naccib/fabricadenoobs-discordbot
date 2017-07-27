"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../parser/command");
const immutable_1 = require("immutable");
const discord_js_1 = require("discord.js");
const roles = immutable_1.List([
    'Programador',
    'Gamer',
    'Pentester',
    'Criativo',
    'Matemático',
    'Político',
    'Leitor'
]);
const roleLimit = 4;
const buildRoleEmbed = (roles) => new discord_js_1.RichEmbed({
    title: `:construction_worker: Cargos Disponíveis`,
    description: `Existem **${roles.size}** cargos disponíveis`,
    fields: getFields(roles),
    footer: {
        text: 'Use "&role [nome_do_cargo]" para se juntar a um cargo!'
    },
    color: 0x42B5EF
});
const getFields = (roles) => roles.map(role => {
    return {
        name: role.name,
        value: `${role.members.size} membros possuem esse cargo`,
        inline: true
    };
})
    .take(25)
    .toArray();
const getAvaliableRoles = (guild, wantedRoles) => {
    const allRoles = immutable_1.List(guild.roles.array());
    return allRoles.filter(role => {
        return wantedRoles.contains(role.name);
    })
        .toList();
};
/**
 * Determines wether a role is safe or not.
 * TODO: Make this work. It is returning 'false' from every call.
 */
const isSafeRole = (role) => {
    const unsafePermissions = immutable_1.List(['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES_OR_PERMISSIONS']);
    return !unsafePermissions.some(perm => {
        return unsafePermissions.contains(perm);
    });
};
const getRole = (roleName, roles) => roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
const countUserRoles = (userRoles, avaliableRoles) => userRoles.toSet().intersect(avaliableRoles.toSet()).size;
const onAction = (args, message, context) => {
    const avaliableRoles = getAvaliableRoles(message.guild, roles);
    const user = message.guild.member(message.author);
    const userRolesCount = countUserRoles(immutable_1.List(user.roles), avaliableRoles);
    console.log(`Rolecount para ${message.author.username}: ${userRolesCount}`);
    if (args.length === 0) {
        message.channel.send({ embed: buildRoleEmbed(avaliableRoles) });
        return;
    }
    const roleToFind = args[0];
    const role = getRole(roleToFind, avaliableRoles);
    if (!role) {
        message.channel.send(`Não consegui achar nenhum cargo chamado \`${roleToFind}\`.\n\nDica: use \`&cargo\` para ver todos os cargos disponíveis.`);
        return;
    }
    else {
        if (message.guild
            .member(context.user)
            .hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
            if (userRolesCount >= roleLimit)
                message.channel.send('Você já atigiu o limite máximo de 4 cargos.');
            else
                user.addRole(role);
        }
        else {
            message.channel.send(`:frowning:  Ooops... Parece que eu não tenho permissão para adicionar cargos nesse servidor.`);
        }
    }
};
exports.role = new command_1.Command('cargo', 'Dá um cargo.', onAction);
