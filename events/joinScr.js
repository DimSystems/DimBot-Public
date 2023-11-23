const client = require("../main");
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ButtonBuilder, ButtonStyle, EmbedBuilder,  } = require("discord.js")
const model = require("../models/space")
const modelRole = require("../models/spaceRole")
const modelUser = require("../models/spaceUser")
const { execSync } = require("child_process")

client.on(Events.InteractionCreate, async (interaction) => {

	const data = await model.find();
	

	if(!data){
			
		}
	
	data.forEach(async(d) => {
		if(d){
			const dataUser = await modelUser.findOne({UserId: interaction.user.id, SpaceBanId: d.CatagoryId});
				const dataRole = await modelRole.findOne({UserId: interaction.user.id, SpaceBanId: d.CatagoryId});

			
			
			if(interaction.customId == `join-${d.roleId}`){
				if(dataUser){
					if(dataUser.isBanned == "true"){
				return interaction.reply({content: `You have been banned from ${d.spaceName}! You may contact admins or owners for appeal but for now. You will not be able to join!`, ephemeral: true})
			} 
				}
				
				
				if(interaction.member.roles.cache.has(d.roleId)){
			

				return interaction.reply({content: `You are already in ${d.spaceName}! Wish to leave?`, components: [
					new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`leave-${d.roleId}`)
							.setLabel(`Leave ${d.spaceName}?`)
						
							.setStyle(ButtonStyle.Danger),
						new ButtonBuilder()
							.setCustomId(`stay-${d.roleId}`)
							.setLabel(`Stay in ${d.spaceName}?`)
							
							.setStyle(ButtonStyle.Secondary),
					)
				], ephemeral: true}).then((msg) => {
					client.on(Events.InteractionCreate, async (i) => {
						if(i.customId == `leave-${d.roleId}`){
				await i.member.roles.remove(d.roleId).catch((err) => {
					return msg.edit({content: "Error: Unable to remove role! You are either above me in permissions or the role itself is above me.", ephemeral: true})
					
				})
							
				return i.reply({content: `Leaving ${d.spaceName}!`, ephemeral: true}).then(() => {
					setTimeout(() => {
						msg.edit({components: [
							new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`leave-${d.roleId}`)
							.setLabel(`Leave ${d.spaceName}?`)
							.setDisabled(true)
							.setStyle(ButtonStyle.Danger),
						new ButtonBuilder()
							.setCustomId(`stay-${d.roleId}`)
							.setLabel(`Stay in ${d.spaceName}?`)
								.setDisabled(true)
							.setStyle(ButtonStyle.Secondary),
					)
						]})
						i.deleteReply()
					}, 500)
				})
			}

			if(i.customId == `stay-${d.roleId}`){
				return i.reply({content: `Staying in ${d.spaceName}!`, ephemeral: true}).then(() => {
					setTimeout(() => {
						msg.edit({components: [
							new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`leave-${d.roleId}`)
							.setLabel(`Leave ${d.spaceName}?`)
							.setDisabled(true)
							.setStyle(ButtonStyle.Danger),
						new ButtonBuilder()
							.setCustomId(`stay-${d.roleId}`)
							.setLabel(`Stay in ${d.spaceName}?`)
								.setDisabled(true)
							.setStyle(ButtonStyle.Secondary),
					)
						]})
						i.deleteReply()
					}, 500)
				})
			}
					})
				})
				
			} 
			interaction.member.roles.add(d.roleId);
			interaction.reply({content: `Welcome to ${d.spaceName}!`, ephemeral: true})
		}
		} 
	})
	

	
})