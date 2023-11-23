const client = require("../main");
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")

client.on(Events.GuildCreate, async (g) => {
	const channel = g.channels.cache.find(channel => channel.type === ChannelType.GuildText)
    channel.send("Thank you for whoever authorized me to this server. I will make sure this bot will be worth the authorization but before you do anything with the bot. I recommand you use this command (</configurate:1158096144925212683>) before doing anything as its necesscary getting this server started. \n If you have configured this server, go to this [page](https://www.dimbot.xyz/howtogetstarted#configexplained) to understand how to use dim and how it works before configurating.")
})