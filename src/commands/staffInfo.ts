import { Command } from '../parser/command';
import { Set, Iterable, List, OrderedMap } from 'immutable';
import { Role, Guild, Message, RichEmbed, Channel, GuildMember, TextChannel } from 'discord.js';

const modArgAliases = Set(['mod', 'mods', 'moderadores', 'moderator']);
const adminArgAliases = Set(['adm', 'admin', 'admins', 'administradores']);
const modlogChannelName = 'modlog';

type modLogDataType = OrderedMap<number, string>

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

const getMessageCountFromUser = (user: GuildMember, messages: List<Message>) : number => {
    return messages
            .filter(msg => msg.author.id === user.id)
            .size;
};

/**
 * Gets all moderators data and returns it as a Iterable whose key is the message count on the mod log channel.
 * @param server The server to get the data from.
 */
const getModLogData = async (server: Guild) : Promise<modLogDataType> => {
    const modlog = server.channels.array().find(ch => ch.name === modlogChannelName) as TextChannel;
    const mods   = getStaffRoles(server)
                    .map(role => List(role.members.array()))
                    .flatten()
                    .toList() as List<GuildMember>;

    if(!modlog)
        return new Promise<modLogDataType>((resolve, reject) => {
            reject('Could not find #modlog channel.');
        });

    console.log(`Found ${mods.size} mods`);

    const today = new Date();
    const lastWeek = today.setDate((today.getDate() - 7));

    const messages = await modlog.fetchMessages({
        after: new Date(lastWeek).toUTCString()
    });

    if(!messages)
        return new Promise<modLogDataType>((resolve, reject) => {
            reject('Could not fetch messages from #modlog channel.');
        });

    const messagesList = List(messages.array());

    const result = mods
                    .map(mod => [getMessageCountFromUser(mod, messagesList), mod.user.username])
                    .toMap()
                    .sortBy((v, k) => k)
                    .reverse();

    return new Promise<modLogDataType>( (resolve, reject) => {
        resolve(OrderedMap<number, string>(result));
    });
};

const getModRankEmbedField = (mod: string, msgNum: number) : { name: any, value: any, inline: boolean } => {
    return {
        name: mod.toString(),
        value: `Esse membro da equipe participou ${msgNum} vezes no #${modlogChannelName}.`,
        inline: true
    };
};

const getModRankEmbed = (data: modLogDataType) : RichEmbed =>
    new RichEmbed({
        title: 'Esquedomacho | Sumário da Staff',
        description: 'Representa a staff, em ordem de mais ativos atualmente',
        fields: data.map((mod, msgNum) => getModRankEmbedField(mod, msgNum)).toArray(),
        color: 0x42B5EF
    })

/// Command Definition

export const staffInfo = new Command('staff', 'Mostra informações sobre moderadores e admnistradores.', (args, msg, ctx) => {
    const specifiedRole = args.get(0);

    if(specifiedRole == undefined)
        msg.channel.send({
            embed: getSummary(msg.guild)
        });

    else if(modArgAliases.contains(specifiedRole))
        getModLogData(msg.guild)
                .catch(msg.reply)
                .then(data => {
                    console.log(`Typeof result: ${typeof data}\nResult = ${data}`);
                    const embed = getModRankEmbed(data as OrderedMap<number, string>);

                    console.dir(embed.fields);

                    msg.channel.send({
                        embed: embed
                    })
                });
});