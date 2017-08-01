import { Guild, GuildChannel, GuildMember, TextChannel, Message, Role } from 'discord.js';
import { Set } from 'immutable';

/**
 * Downloads 100 messages from a channel from a given server.
 * @param server The server to look for the channel.
 * @param channelName The name of the channel to be looked for.
 */
export const downloadMessages =  async (server: Guild, channelName: string, count: number = 100) : Promise<Set<Message>> => {
    const channel = server.channels
            .array()
            .find(x => x.name === channelName);

    if(!channel)
        return new Promise<Set<Message>>((_, reject) => {
            reject('Channel not found.');
        });

    if(channel instanceof TextChannel)
    {
        const messages = await channel.fetchMessages({
            limit: count
        });

        return new Promise<Set<Message>>((resolve, _) => {
            resolve(Set(messages.array()));
        });
    }

    return new Promise<Set<Message>>((_, reject) => {
        reject('Channel found is not a TextChannel.');
    });
};

/**
 * Gets all users from the specified roles in a server (context).
 * @param roles 
 * @param context 
 */
export const getUsersFromRoles = (roles: Set<Role>, context: Guild) : Set<GuildMember> => {
    const allUsers = Set(context.members.array());
    const roleIds  = roles.map(x => x.id).toSet();

    const hasAnyRole = (user: GuildMember) => 
        Set(user.roles.array().map(x => x.id)).intersect(roleIds).size != 0;

    return allUsers.filter(hasAnyRole).toSet();
};