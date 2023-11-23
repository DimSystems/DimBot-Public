const { Client, CommandInteraction, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, ButtonBuilder  } = require("discord.js");
const Discord = require(`discord.js`)
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const model = require("../../models/space")
const modelRole = require("../../models/spaceRole")
const modelUser = require("../../models/spaceUser")
const modelUserWarn = require("../../models/spaceUserWarn")
module.exports = {
    name: "Mute user from space.",
    // description: "Has this message broken some rules from aa space or TOS. Report it.",
    type: ApplicationCommandType.User,
	ephemeralCmd: true,
	modalCmd: true,
   // devOnly: true,
    
    run: async (client, interaction, args) => {

		const targetUser = interaction.targetUser;

		if(targetUser.id == interaction.user.id){
			return interaction.reply({content: `You can't do a **DANGEROUS** command to yourself.`, ephemeral: true})	
		}

		if(targetUser.id == "1150482920323170395"){
			return interaction.reply({content: `What did i do to you?`, ephemeral: true})	
		}
		
		if(!interaction.channel.parentId) return interaction.reply("All spaces have a catagory!");

const data = await model.findOne({
		CatagoryId: interaction.channel.parentId
	});

	if(!data){

		return interaction.reply({content: "This isn't a space!", ephemeral: true})
		
			
		}
		
      			const dataRole = await modelRole.findOne({
					CatagoryId: data.CatagoryId
				});

		if(!dataRole){
							await interaction.reply({content:`Seems like this space is new and the database needs a refresher. Click on this button to continue`, 
						components: [new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
			.setCustomId('setupDashModel')
			.setLabel('Setup!')
			.setStyle(ButtonStyle.Primary)
						
				)
			], ephemeral: true
					})
					

			 const guild = client.guilds.cache.get(interaction.guild.id); 
		const member = await guild.members.fetch(targetUser.id);

if(!member.roles.cache.has(dataRole.MemberId) && !member.roles.cache.has(dataRole.AdminId) && !member.roles.cache.has(dataRole.OwnerId)){
	return interaction.reply({content: `<@!${targetUser.id}> was not found in this space...`, ephemeral: true})	
}
			

								if(!interaction.member.roles.cache.has(dataRole.AdminId) && !interaction.member.roles.cache.has(dataRole.OwnerId)){
									const modelConfig = require("../../models/configureServer")
										const configData = await modelConfig.findOne({
													GuildId: interaction.guild.id
												})

									return interaction.reply({content: `Seems like you can't use the dashboard as your do not have the valid permissions... Maybe create your own space to have your own dashboard. Apply at <#${configData.appCH}>`, ephemeral: true})			
						} 
			if(member.roles.cache.has(dataRole.AdminId) && interaction.member.roles.cache.has(dataRole.AdminId)){
			return interaction.reply({content: `Friendly fire will not be tolerated. \n It is impossibe for you to ban one of your own.`, ephemeral: true})	
		}
			if(member.roles.cache.has(dataRole.OwnerId) && interaction.member.roles.cache.has(dataRole.AdminId)){
			return interaction.reply({content: `Are you trying to get demoted? You can't ban a higherup in a space.`, ephemeral: true})	
		}

		const modal = new ModalBuilder()
			.setCustomId('contextMuteUsrSpaceModel')
			.setTitle(`Mute ${interaction.targetUser.username}!`);

		// Add components to modal

		// Create the text input components
		const reason = new TextInputBuilder()
			.setCustomId('reason')
		    // The label is the prompt the user sees for this input
			.setLabel("Reason of mute:")
		    // Short means only a single line of text
			.setPlaceholder("Talks too much!")
			.setRequired(false)
			.setMinLength(0)
			.setMaxLength(125)
			
			.setStyle(TextInputStyle.Paragraph);

		const duration = new TextInputBuilder()
			.setCustomId('duration')
		    // The label is the prompt the user sees for this input
			.setLabel("Duration of mute:")
		    // Short means only a single line of text
			.setPlaceholder("5d")
			.setRequired(false)
			.setMinLength(0)
			.setStyle(TextInputStyle.Short);

		

		

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(reason);
		const secActionRow = new ActionRowBuilder().addComponents(duration);
		
		// Add inputs to the modal
		modal.addComponents(firstActionRow, secActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);

		client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "contextMuteUsrSpaceModel"){
		const user = targetUser;
		const userId = targetUser.id;
		const reason = i.fields.getTextInputValue('reason') || "Not specified";
		const muteDuration = i.fields.getTextInputValue('duration');

		 const guild = client.guilds.cache.get(interaction.guild.id); 
		const member = await guild.members.fetch(userId);

		const catagory = client.channels.cache.get(interaction.channel.parentId);

		catagory.permissionOverwrites.edit(userId, { SendMessages: false, SendMessagesInThreads: false, CreatePublicThreads: false, CreatePrivateThreads: false, Connect: false, AddReactions: false });

		if(muteDuration){
			const ms = require("ms")

			let muteDuMS = Date.now()+ ms(muteDuration);

			const dataUserFind = await modelUser.findOne({
		UserId: userId,
		SpaceBanId: data.CatagoryId
	})


	
if(!dataUserFind){
	new modelUser({
       		UserId: userId,
			muteDuration: Number(muteDuMS),
			SpaceBanId: data.CatagoryId
        }).save()

		await i.reply({ content: `${member.user.username} has been muted for <t:${parseInt(muteDuMS / 1000, 10)}:R> and should be notified!`,  ephemeral: true });

		client.users.send(userId, `Oh! Unlucky, You are now muted! You will be able to interact in ${data.spaceName} <t:${parseInt(muteDuMS / 1000, 10)}:R>. Reason is ${reason}!`);

			
} else {
	 let x = await modelUser.findOneAndUpdate({ UserId: userId, SpaceBanId: data.CatagoryId }, { muteDuration: Number(muteDuMS) })

	await i.reply({ content: `${member.user.username} muted duration has been added to <t:${parseInt(muteDuMS / 1000, 10)}:R> and should be notified!`,  ephemeral: true });

		client.users.send(userId, `Oh! Unlucky, your mute time has been editted and now you will be able to interact in ${data.spaceName} <t:${parseInt(muteDuMS / 1000, 10)}:R>. Reason is ${reason}!`);
}
	}

		if(!muteDuration){
	await i.reply({ content: `${member.user.username} has been muted permanantly and should be notified!`,  ephemeral: true });

		client.users.send(userId, `You have been muted permanantly from ${data.spaceName} for ${reason}!`);
}
	}
		})


		}
	}
}