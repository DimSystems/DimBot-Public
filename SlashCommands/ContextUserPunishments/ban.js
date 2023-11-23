const { Client, CommandInteraction, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, ButtonBuilder,ChannelType  } = require("discord.js");

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
    name: "Ban user from space.",
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
					}

		
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
			.setCustomId('contextBanUsrSpaceModel')
			.setTitle(`Ban ${interaction.targetUser.username}!`);

		// Add components to modal

		// Create the text input components
		const reason = new TextInputBuilder()
			.setCustomId('reason')
		    // The label is the prompt the user sees for this input
			.setLabel("Reason of banishment:")
		    // Short means only a single line of text
			.setPlaceholder("Broke the coolness of the space!")
			.setRequired(false)
			.setMinLength(0)
			.setMaxLength(125)
			
			.setStyle(TextInputStyle.Paragraph);

		
								const banDuration = new TextInputBuilder()
			.setCustomId('banduration')
		    // The label is the prompt the user sees for this input
			.setLabel("Duration of Ban")
		    // Short means only a single line of text
			.setPlaceholder("5s, 5m, 5h, 5d, 5y")
			.setRequired(false)
			
			
			.setStyle(TextInputStyle.Short);

			const clearMessages = new TextInputBuilder()
			.setCustomId('clearMessages')
		    // The label is the prompt the user sees for this input
			.setLabel("Delete message history")
		    // Short means only a single line of text
			.setPlaceholder("[Number, 'All', (default is none)]")
			.setRequired(false)
			
			
			.setStyle(TextInputStyle.Short);

		

		

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(reason);

		const tar = new ActionRowBuilder().addComponents(banDuration);
		// Add inputs to the modal
		const far = new ActionRowBuilder().addComponents(clearMessages);
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow, tar, far);

		// Show the modal to the user
		await interaction.showModal(modal);

		
			client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "contextBanUsrSpaceModel"){
		const user = targetUser;
		const userId = targetUser.id;
		const reason = i.fields.getTextInputValue('reason') || "Not specified";
			const banDuration = i.fields.getTextInputValue('banduration') 
			const CM = i.fields.getTextInputValue('clearMessages').toUpperCase() || "1"

		if(NaN==Number(CM)){if("ALL"===CM){const{limit:e}=-1;client.channels.cache.find((e=>e.type==ChannelType.GuildCategory&&e.name==data.spaceName)).children.cache.forEach((async e=>{const t=setInterval((async()=>{const t={limit:100,filter:e=>e.author.id===userId};await e.messages.fetch(t).then((t=>{e.bulkDelete(t,!0)}))}),500);setInterval((async()=>{const a={limit:100,filter:e=>e.author.id===userId};await e.messages.fetch(a).then((e=>{null!=e&&e.length||clearInterval(t)}))}),500)}))}}else{const{limit:e}=CM;client.channels.cache.find((e=>e.type==ChannelType.GuildCategory&&e.name==data.spaceName)).children.cache.forEach((async t=>{if(-1==e){const e=setInterval((async()=>{const e={limit:100,filter:e=>e.author.id===userId};await t.messages.fetch(e).then((e=>{t.bulkDelete(e,!0)}))}),500);setInterval((async()=>{const a={limit:100,filter:e=>e.author.id===userId};await t.messages.fetch(a).then((t=>{null!=t&&t.length||clearInterval(e)}))}),500)}else{const e={limit:CM,filter:e=>e.author.id===userId};await t.messages.fetch(e).then((e=>{t.bulkDelete(e,!0)}))}}))}
	   

		  const guild = client.guilds.cache.get(interaction.guild.id); 
		const member = await guild.members.fetch(userId);

if(member.roles.cache.has(dataRole.MemberId)){
	member.roles.remove(dataRole.MemberId); 

	const dataUserFind = await modelUser.findOne({
		UserId: userId,
		SpaceBanId: data.CatagoryId,
	})

if(dataUserFind && !dataUserFind.isBanned && !dataUserFind.BanReason){
			if(banDuration) {
		const ms = require("ms")

			let banDuMS = Date.now()+ ms(banDuration);

					 let x = await modelUser.findOneAndUpdate({ UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason, banDuration: banDuMS })

					client.users.send(userId, `You have been banned from ${data.spaceName} for ${reason}! Luckily this ban will expire <t:${parseInt(banDuMS / 1000, 10)}:R>`);

	 i.reply({content: `${member.user.username} has been banned and should be notified! It expires <t:${parseInt(banDuMS / 1000, 10)}:R> \n Note: If you have you choosen to clear messages, due to API Limits, all of the banned users messages must be send under 14 days. You can delete those messages manually though`,  ephemeral: true });

			}
	else {
		let x = await modelUser.findOneAndUpdate({ UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason })

		 i.reply({content: `${member.user.username} has been banned permanantly and should be notified!  \n Note: If you have you choosen to clear messages, due to API Limits, all of the banned users messages must be send under 14 days. You can delete those messages manually though`,  ephemeral: true });

		client.users.send(userId, `You have been banned from ${data.spaceName} for ${reason}! It is permanant and it will stay that way unless you get really really lucky...`);
	}
		}

	
if(!dataUserFind){

	if(banDuration) {
		const ms = require("ms")

			let banDuMS = Date.now()+ ms(banDuration);

		new modelUser({
       		UserId: userId,
			isBanned: "true",
			banReason: reason,
			SpaceBanId: data.CatagoryId,
			banDuration: banDuMS
        }).save()

				client.users.send(userId, `You have been banned from ${data.spaceName} for ${reason}! Luckily this ban will expire <t:${parseInt(banDuMS / 1000, 10)}:R>`);

	 i.reply({content: `${member.user.username} has been banned and should be notified!. It expires <t:${parseInt(banDuMS / 1000, 10)}:R>`,  ephemeral: true });
	} else {
		new modelUser({
       		UserId: userId,
			isBanned: "true",
			banReason: reason,
			SpaceBanId: data.CatagoryId
			
        }).save()

	 i.reply({content: `${member.user.username} has been banned permanantly and should be notified!`,  ephemeral: true });

		client.users.send(userId, `You have been banned from ${data.spaceName} for ${reason}! It is permanant and it will stay that way unless you get really really lucky...`);

	}
	} else if(dataUserFind && dataUserFind.isBanned && dataUserFind.BanReason){

	if(banDuration){
		const ms = require("ms")

			let banDuMS = Date.now()+ ms(banDuration);

		 let x = await modelUser.findOneAndUpdate({ UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason, banDuration: banDuMS })

			client.users.send(userId, `Your ban has been editted from ${data.spaceName}. Heres whats been editted \n Reason: Reason: ${reason} \n Expiration date: <t:${parseInt(banDuMS / 1000, 10)}:R>.`);

	 i.reply({content: `${member.user.username}'s banishment has been editted and should be notified! It expires <t:${parseInt(banDuMS / 1000, 10)}:R>`,  ephemeral: true });
	} 
	else {
		 let x = await modelUser.findOneAndUpdate({ UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason })

	 i.reply({content: `${member.user.username}'s banishment has been editted and should be notified!`,  ephemeral: true });

		client.users.send(userId, `Your ban has been editted from ${data.spaceName}. Heres what been editted \n Reason: ${reason}.`);
	}
	 
}
}		 else {
	return i.reply({content: `${member.user.username} isn't in this space...`,  ephemeral: true });
}
	
			
	}
			})
	}
}