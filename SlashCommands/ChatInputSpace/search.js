const { Client, CommandInteraction, ApplicationCommandType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const Discord = require(`discord.js`)
const { glob } = require("glob");
const model = require("../../models/space")
const modelRole = require("../../models/spaceRole")
const { promisify } = require("util");
const globPromise = promisify(glob);
const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
module.exports = {
    name: "search",
    description: "Search any space available.",
	type: ApplicationCommandType.ChatInput,
    devOnly: false,
	ephemeralCmd: true,
	// autocomplete: true,
	options: [
		{
			name: "space",
			description: 'name of a specific space',
			type: ApplicationCommandOptionType.String,
			autocomplete: true
		}
	],
	async autocomplete(interaction) {
		
		const model = require("../../models/space")

		const focusedValue = interaction.options.getFocused();

		const focusedValueCase = focusedValue.toUpperCase()

		let spaceArray = []

		const data = await model.find();
      
        data.forEach((d) => {
          
          if(d.showSpace){
            return;
          } else {
            spaceArray.push(d);
          }
          
          
        })
      
      

		
		const filtered = spaceArray.filter(data => data.spaceName.toUpperCase().startsWith(focusedValueCase));
		await interaction.respond(
			filtered.map(data => ({ name: data.spaceName, value: data.spaceName })),
		);
		
		
	},
	
    
    run: async (client, interaction, args) => {
		const spaceName = interaction.options.getString("space") || `${interaction.channel.parent.name || "Null"}`;

		

		

		const data = await model.findOne({
			spaceName: spaceName
		})

		if(!data && spaceName == `${interaction.channel.parent.name}`){
			return interaction.reply({ content:`This is not a space. Please use the space option to specifically search a space`, ephemeral: true})
		} else if(!data && spaceName !== `${interaction.channel.parent.name}`){
			return interaction.reply({content: `${spaceName} is not a a valid space name, Check your spelling and try again`, ephemeral: true})
		} else if(data) {
          
          if(data.showSpace){
           return interaction.reply({content: `${spaceName} is not a a valid space name, Check your spelling and try again`, ephemeral: true});
          };
          
			const modelRole = require("../../models/spaceRole")

				const dataRole = await modelRole.findOne({
					CatagoryId: data.CatagoryId
				});

			if(!dataRole){
				return interaction.reply({content:`This space exists but it is not SYNCED. Administrators (Not space admins) need to configure the space!`, ephemeral: true})
			}

			const globalGuild = client.guilds.cache.get(data.GuildId);
			
			const category = client.channels.cache.get(data.CatagoryId)
			

			let OwnerF = client.guilds.cache.get(data.GuildId).roles.cache.get(dataRole.OwnerId)?.members.map(m=>m.user.username).join(', ') || "";

			let AdminF = client.guilds.cache.get(data.GuildId).roles.cache.get(dataRole.AdminId).members.map(m=>m.user.username).join(', ') || "";

			
			 interaction.reply({embeds: [
							   new EmbedBuilder()
	.setColor(323236)
	.setTitle(`${spaceName}`)
	.setURL(`https://discord.com/channels/${data.GuildId}/${data.WelcomeChannel}`)
	.setAuthor({ name: spaceName, iconURL: data.ImageURL, url: `https://discord.com/channels/${data.GuildId}/${data.WelcomeChannel}` })
	.setDescription('Here is some key information about this Space')
	.setThumbnail(data.ImageURL)
	.addFields(
		{name: "Server where Space is based:", value: `${globalGuild.name} (${globalGuild.id})`},
		{ name: 'User Information', value: 'Information about our roles' },
		{ name: 'Owners:', value: `${OwnerF || "No Owners in Space"}`, inline: true }, 
		{ name: 'Admins:', value: `${AdminF || "No Admins in Space"}`, inline: true },
		{ name: 'Statistics', value: 'Information about our roles' },
		{ name: 'Members:', value: `${client.guilds.cache.get(data.GuildId).roles.cache.get(dataRole.MemberId).members.size}`, inline: true },
		{ name: 'Channels:', value: `${category.children.cache.size}`, inline: true }
	)
	
	.setImage(data.ImageURL)
	.setTimestamp()
	.setFooter({ text: 'Dim 2023', iconURL: data.ImageURL })
			 ], ephemeral: true})
		}
	}
}