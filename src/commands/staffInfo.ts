import { Command } from '../parser/command';
import { downloadMessages, getUsersFromRoles, ModData } from '../utils';
import { Plotter } from '../plot/plotter';
import { Set, Iterable, List, OrderedMap } from 'immutable';
import { Role, Guild, Message, RichEmbed, Channel, GuildMember, TextChannel } from 'discord.js';

const rankArgAliases = Set(['rank', 'list']);

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

const getMessagesFromUser = (user: GuildMember, messages: Set<Message>) : Set<Message> => {
    return messages
            .filter(msg => msg.author.id === user.id)
            .toSet();
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
        const filteredMessages = getMessagesFromUser(moderator, messages);

        return {
            mod: moderator,
            messages: filteredMessages,
            performanceEmoji: getPerformanceEmoji(moderator, filteredMessages.size)
        } as ModData;
    })
    .toSet()
    .sortBy(mod => mod.messages.size)
    .reverse() as Set<ModData>;
};

const getModRankField = (mod: ModData) : { name: any, value: any, inline: boolean } =>
{
    return {
        name: `${mod.performanceEmoji} ${mod.mod.displayName}`,
        value: `${mod.messages.size} participações.`,
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

// Staff-Specific Command

const sendStaffEmbed = async (server: Guild, staff: GuildMember, channel: TextChannel) => {
    const messages = await downloadMessages(server, 'modlog');
    const data = processData(messages, Set([ staff ])).first();

    Plotter.getPerformanceGraph(data); 
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
    else if(msg.mentions.members.size > 0)
    {
        const staffs = getUsersFromRoles(getStaffRoles(msg.guild), msg.guild);
        const mentioned = msg.mentions.members.first();

        if(staffs.find(staff => staff.id === mentioned.id) != undefined) // mentioned user is staff.
        {
            console.log(`Send staff embed for ${mentioned.nickname}`);
            sendStaffEmbed(msg.guild, mentioned, msg.channel as TextChannel);
        }
    }
});