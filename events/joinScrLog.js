const {Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const client = require("../main")
const model = require("../models/space")

const { AuditLogEvent } = require('discord.js');

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
	

    if(oldMember.roles.cache.size < newMember.roles.cache.size) {
        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberRoleUpdate,
    });
    
        const roleAddLog = fetchedLogs.entries.first();
        if (!roleAddLog ) return;
        const { executor, target, changes} = roleAddLog;

		const data = await model.find();

		
	if(!data){
			
		}

		data.forEach(async(d) => {
		if(d){
			if(changes[0].new[0].id == d.roleId){
				const randomWelcomes = [
			"Heya",
			"Hello",
			"Whatsup",
			"Hey",
			"Hey there",
			"Thanks for joining",
			"Radical",
			"Say hi to",
			"Look who came at the party!",
			"Did you come with pizza?",
			"Look at"
		]

				const channel = client.channels.cache.get(d.WelcomeChannel);

				channel.createWebhook({
		name: 'Dim Welcome - Space',
	}).then((webh) => {

		const randomWelcomes = [
			"Heya",
			"Hello",
			"Whatsup",
			"Hey",
			"Hey there",
			"Thanks for joining",
			"Radical",
			"Say hi to",
			"Look who came at the party!",
			"Did you come with pizza?",
			"Look at"
		]
			webh.send({
				content: `:wave: ${randomWelcomes[Math.floor(Math.random() * randomWelcomes.length)]} <@${oldMember.user.id}>!  \n Welcome to **${d.spaceName}**! \n > Go check around this place, I'm sure there is alot to explore!`,
				username: `${oldMember.user.username}`,
				avatarURL: `${oldMember.displayAvatarURL()}`,
				components: [
					new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('stickersend')
							.setEmoji('👋')
							.setDisabled(true)
							.setStyle(ButtonStyle.Secondary),
					)
				]
			
			}).then(() => {
				setTimeout(() => {
					webh.delete()
				}, 4500)
			})
			
			
	
				})
					

				
			}
			
		} 
	})

		
		}

	 if(oldMember.roles.cache.size > newMember.roles.cache.size) {
        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberRoleUpdate,
    });
    
        const roleAddLog = fetchedLogs.entries.first();
        if (!roleAddLog ) return;
        const { executor, target, changes} = roleAddLog;

		 const data = await model.find();

		
	if(!data){
			
		}

		data.forEach(async(d) => {
		if(d){
			if(changes[0].new[0].id == d.roleId){
				
				const channel = client.channels.cache.get(d.WelcomeChannel);

				channel.createWebhook({
		name: 'Dim Leaver - Space',
	}).then((webh) => {

		const randomWelcomes = [
			"Sad",
			"Oh No! ",
			"Bad news!",
			"Bye",
			"See ya",
			"Uh Oh",
			"Uncool!"
		]
					
			webh.send({
				content: `:pensive: ${randomWelcomes[Math.floor(Math.random() * randomWelcomes.length)]} <@${oldMember.user.id}>! Left **${d.spaceName}**! \n > Oh well, see you next time!`,
				username: `${oldMember.user.username}`,
				avatarURL: `${oldMember.displayAvatarURL()}`,
				components: [
					new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('stickersend')
							.setEmoji('👋')
							.setDisabled(true)
							.setStyle(ButtonStyle.Secondary),
					)
				]
			
			}).then(() => {
				setTimeout(() => {
					webh.delete()
				}, 4500)
			})
			
			
	
				})
					

				
			}
			
		} 
	})


    
		
		}
});

