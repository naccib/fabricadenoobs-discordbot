import { Command } from '../parser/command';
import { downloadMessages, getUsersFromRoles } from '../utils';
import { Set, Iterable, List, OrderedMap } from 'immutable';
import { Role, Guild, Message, RichEmbed, Channel, GuildMember, TextChannel } from 'discord.js';

type ModData = { mod: GuildMember, messageCount: number, performanceEmoji: string };

const rankArgAliases = Set(['rank', 'list']);
const adminArgAliases = Set(['adm', 'admin', 'admins', 'administradores']);

const getStaffRoles = (server: Guild) : Set<Role> => {
    const staffRoleNames = Set(['Moderador', 'Administrador']);
    const roleSet = Set(server.roles.array());

    return roleSet
    .filter(role => staffRoleNames.contains(role.name))
    .toSet();
};

/// Summary Command

const getRoleSummary = (role: Role) : string => {
    return `Existem **${role.members.size}** ${role.name.toLowerCase()}es:
 • ${role.members.array().map(x => x.toString()).join('\n • ')}`
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
        fields: getStaffRoles(server).map(getRoleSummaryFields).toArray(),
        color: 0x42B5EF,
        footer: {
            text: 'Equipe manejada com ♥ pelo Satanael e naccib'
        }
    });

/// Mod Command

const getMessageCountFromUser = (user: GuildMember, messages: Set<Message>) : number => {
    return messages
            .filter(msg => msg.author.id === user.id)
            .size;
};

const getPerformanceEmoji = (user: GuildMember, messageCount: number) => {
    const admRole = user.guild.roles.find(x => x.name === 'Administrador').id;
    const isAdmin = Set(user.roles.array().map(role => role.id)).contains(admRole);

    if(isAdmin)
        return ':diamonds:';

    if(messageCount === 0)
        return ':thermometer_face:';
    else if(messageCount > 0 && messageCount <= 10)
        return ':frowning:'
    else if(messageCount > 10 && messageCount <= 20)
        return ':smirk:'
    else
        return ':heart_eyes:';
};

const processData = (messages: Set<Message>, mods: Set<GuildMember>) : Set<ModData> => {
    return mods.map(moderator => {
        const messageCount = getMessageCountFromUser(moderator, messages);

        return {
            mod: moderator,
            messageCount: messageCount,
            performanceEmoji: getPerformanceEmoji(moderator, messageCount)
        } as ModData;
    })
    .toSet()
    .sortBy(mod => mod.messageCount)
    .reverse() as Set<ModData>;
};

const getModRankField = (mod: ModData) : { name: any, value: any, inline: boolean } =>
{
    return {
        name: `${mod.performanceEmoji} ${mod.mod.displayName}`,
        value: `${mod.messageCount} participações.`,
        inline: true
    };
};

const getModRankEmbed = (data: Set<ModData>) : RichEmbed =>
    new RichEmbed({
        title: 'Esquerdomacho | Staff Rank',
        description: 'Mostra o rank geral da staff. Esse rank leva em conta apenas mensagens na #modlog.\nUse `&staff <membro>` para informações mais detalhadas de um staff.',
        fields: data.map(getModRankField).toArray(),
        color: 0x42B5EF,
        footer: {
            text: 'Equipe manejada com ♥ pelo Satanael e naccib'
        }
    });

const sendModRankEmbed = async (server: Guild, channel: TextChannel) => {
    const messages = await downloadMessages(server, 'modlog');
    const mods     = getUsersFromRoles(getStaffRoles(server), server);

    const data = processData(messages, mods);
    channel.send({
        embed: getModRankEmbed(data)
    });
};

/// Command Definition

export const staffInfo = new Command('staff', 'Mostra informações sobre moderadores e admnistradores.', (args, msg, ctx) => {
    const specifiedRole = args.get(0);

    if(specifiedRole == undefined)
        msg.channel.send({
            embed: getSummary(msg.guild)
        });

    else if(rankArgAliases.contains(specifiedRole))
    {
        sendModRankEmbed(msg.guild, msg.channel as TextChannel);
    }
});