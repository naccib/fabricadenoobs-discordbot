import { Command } from '../parser/command';
import { List, Iterable } from 'immutable';
import { Role, Guild, Message, RichEmbed, Client } from 'discord.js';

const roles = List<string>([
    'Programador',
    'Gamer',
    'Pentester',
    'Criativo',
    'Matemático',
    'Político'
]);

const roleLimit = 4;

const buildRoleEmbed = (roles : List<Role>) : RichEmbed =>
    new RichEmbed({
        title: `:construction_worker: Cargos Disponíveis`,
        description: `Existem **${roles.size}** cargos disponíveis`,
        fields: getFields(roles),
        footer: {
            text: 'Use "&role [nome_do_cargo]" para se juntar a um cargo!'
        },
        color: 0x42B5EF
    });

const getFields = (roles: List<Role>) : Array<{ name: any, value: any, inline: boolean }> => 
    roles.map(role => {
        return {
            name: role.name,
            value: `${role.members.size} membros possuem esse cargo`,
            inline: true
        }
    })
    .take(25)
    .toArray();

const getAvaliableRoles = (guild: Guild, wantedRoles: List<string>) : List<Role> => {
    const allRoles = List<Role>(guild.roles.array());

    return allRoles.filter(role => {
        return wantedRoles.contains(role.name);
    })
    .toList();
};

/**
 * Determines wether a role is safe or not.
 * TODO: Make this work. It is returning 'false' from every call.
 */
const isSafeRole = (role: Role) : boolean => {
    const unsafePermissions = List<string>(['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES_OR_PERMISSIONS']);

    return !unsafePermissions.some(perm => {
        return unsafePermissions.contains(perm);
    });
};

const getRole = (roleName: string, roles: List<Role>) : Role => 
    roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());


const onAction = (args: Iterable<number, string>, message: Message, context: Client) => {
    const avaliableRoles = getAvaliableRoles(message.guild, roles);
    const user = message.guild.member(message.author);

    if(args.size === 0)
    {
        message.channel.send({ embed: buildRoleEmbed(avaliableRoles) });
        return;
    }

    const roleToFind = args[0];
    const role       = getRole(roleToFind, avaliableRoles);

    if(!role)
    {
        message.channel.send(`Não consegui achar nenhum cargo chamado \`${roleToFind}\`.\n\nDica: use \`&cargo\` para ver todos os cargos disponíveis.`);
        return;
    }
    else
    {
        if(message.guild
        .member(context.user)
        .hasPermission( 'MANAGE_ROLES_OR_PERMISSIONS'))
        {
            user.addRole(role);
        }
        else
        {
            message.channel.send(`:frowning:  Ooops... Parece que eu não tenho permissão para adicionar cargos nesse servidor.`);
        }
    }
};

export const role = new Command('cargo', 'Dá um cargo.', onAction);
    
