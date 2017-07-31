import { Command } from '../parser/command';
import { Set } from 'immutable';
import { Role, Guild, Message, RichEmbed, Channel } from 'discord.js';

const getStaffRoles = (server: Guild) : Set<Role> => {
    const staffRoleNames = Set(['Moderador', 'Admnistrador']);
    const roleSet = Set(server.roles.array());

    return roleSet
    .filter(role => staffRoleNames.contains(role.name))
    .toSet();
};

const getRoleSummary = (role: Role) : string => {
    return `Existem ${role.members.size} ${role.name.toLowerCase()}es:
 • ${role.members.array().map(x => x.nickname).join(' • ')}`
};

const getRoleSummaryFields = (role: Role) : { name: any, value: any, inline: boolean } => {
    return {
        name: `${role.name}es`,
        value: getRoleSummary(role),
        inline: false
    };
};

const getSummary = (server: Guild) : RichEmbed =>
    new RichEmbed({
        title: 'Esquerdomacho | Informação da Equipe',
        description: 'Informação geral da equipe. Use `&staff <cargo>` para uma informação mais detalhada.',
        fields: getStaffRoles(server).map(getRoleSummaryFields).toArray()
    });

export const staffInfo = new Command('staff', 'Mostra informações sobre moderadores e admnistradores.', (args, msg, ctx) => {
    const staffRoles = getStaffRoles(msg.guild);

    console.log(`[STAFF-INFO] Found ${staffRoles.size} staff roles`);

    msg.channel.send({
        embed: getSummary(msg.guild)
    });
});