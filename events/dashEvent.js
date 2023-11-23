 const model = require("../models/space")
	const modelRole = require("../models/spaceRole")
const modelUser = require("../models/spaceUser")
const modelUserWarn = require("../models/spaceUserWarn")
const modelBackup = require( "../models/Backup");
const modelConfig = require("../models/configureServer")
const backup = require("dim-backup")


backup.setStorageFolder("../backup")
const client = require("../main.js")

const {CommandInteraction, ApplicationCommandType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType} = require("discord.js")

setInterval((async()=>{(await modelUser.find()).forEach((async a=>{if(a.muteDuration&&(a.muteDuration===Date.now()||Date.now()>a.muteDuration)){let e=await model.findOne({CatagoryId:a.SpaceBanId});client.channels.cache.get(a.SpaceBanId).permissionOverwrites.delete(a.UserId);await modelUser.findOneAndUpdate({UserId:a.UserId,SpaceBanId:a.SpaceBanId},{$unset:{muteDuration:1}});client.users.send(a.UserId,`You are now unmuted from ${e.spaceName}! Avoid getting mutted again...`)}}))}),500),setInterval((async()=>{(await modelUser.find()).forEach((async a=>{if(a.banDuration&&(a.banDuration===Date.now()||Date.now()>a.banDuration)){let e=await model.findOne({CatagoryId:a.SpaceBanId});await modelUser.findOneAndUpdate({UserId:a.UserId,SpaceBanId:a.SpaceBanId},{$unset:{banDuration:1, isBanned:1, banReason: 1}});client.users.send(a.UserId,`Your ban from ${e.spaceName} has expired... Avoid trying to get banned and follow the rules of the space. `)}}))}),500),setInterval((async()=>{(await modelUserWarn.find()).forEach((async a=>{if(a.warnDuration&&(a.warnDuration===Date.now()||Date.now()>a.warnDuration)){let e=await model.findOne({CatagoryId:a.SpaceId});await modelUserWarn.findOneAndUpdate({WarnId:a.WarnId},{$unset:{warnDuration:1}}),await modelUserWarn.findOneAndUpdate({WarnId:a.WarnId},{isWarnActive:"false"});client.users.send(a.UserId,`Warn [${a.WarnId}] from ${e.spaceName} has expired! Good for you! Now avoid getting anymore warns ok!`)}}))}),500);


client.on(Events.InteractionCreate, async (ine) => {


		const data = await model.findOne({
		CatagoryId: ine.channel.parentId
	});

	if(!data){
		
	} else {

		
	const dataBackup = await modelBackup.find({ CatagoryId: data.CatagoryId });	
		


	const dataRole = await modelRole.findOne({
					CatagoryId: data.CatagoryId
				});

	const dataUser = await modelUser.findOne({
		UserId: ine.user.id,
		SpaceBanId: data.CatagoryId
	})

    if(ine.customId == "settingsDash"){
      return ine.reply({content: "Select one of the following...", components: [
					new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
					.setCustomId('editAd')
					.setLabel('Edit Space Ad')
					.setStyle(ButtonStyle.Secondary),
                       	new ButtonBuilder()
					.setCustomId('privacySpace')
					.setLabel('Edit Space Privacy')
					.setStyle(ButtonStyle.Secondary),  
                           	new ButtonBuilder()
					.setCustomId('deleteSpaceButton')
					.setLabel('Delete this space')
					.setStyle(ButtonStyle.Danger),   
							)
				], ephemeral: true})
    }
      
		if(ine.customId == "backupList"){
			if(!dataBackup || dataBackup.length == 0){
				return ine.reply({content: "No backups have been found! Click the button below to create a new backup.", components: [
					new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
					.setCustomId('createBackup')
					.setLabel('Create your first backup')
					.setStyle(ButtonStyle.Success),
							)
				], ephemeral: true})
			} else {
			 ine.reply({content: `You have ${dataBackup.length} backups available. Click the button below to select a backup.`, components: [
					new ActionRowBuilder()
					.addComponents(
						new StringSelectMenuBuilder()
							.setCustomId("backupselect")
							.setPlaceholder("Select any of your backups.")
							.addOptions([
								
								...dataBackup.map(data => {
									return {
										label: `${data.BackupName}`,
										description: `${data.BackupName} (${data.BackupId})`,
										value: `BackUP-${data.BackupId}`
									}
								})
							])
							.setMinValues(1)
							.setMaxValues(1),
						
					) 
				], ephemeral: true }).then(() => {
				 ine.followUp({components: [
								 new ActionRowBuilder()
									 .addComponents(
										 new ButtonBuilder()
								 .setCustomId('createBackup')
								 .setLabel('Create a backup')
								 .setStyle(ButtonStyle.Success),
										 )
							 ], ephemeral: true})
				})
			}
		}
		if(ine.customId == "userRoleList"){
			return ine.reply({
				content: `Select one of the following...`, components: [
					new ActionRowBuilder()
									
				.addComponents(
					new ButtonBuilder()
			.setCustomId('addAdminModal')
			.setLabel('Add a admin to Space!')
			.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
			.setCustomId('removeAdminModal')
			.setLabel('Remove an admin from Space!')
			.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
			.setCustomId('viewAdmins')
			.setLabel('View all Admins in space!')
			.setStyle(ButtonStyle.Secondary),
				)
				], ephemeral: true
			})
		}

			if(ine.customId == "userPunishList"){
			return ine.reply({
					content: `Select one of the following...`, components: [
						new ActionRowBuilder()
									 .addComponents(
										 new StringSelectMenuBuilder()
			.setCustomId('userPunishListSM')
			.setPlaceholder('Pick one of the following punishment modules.')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Bans')
					.setDescription('View all bans, Ban a user and unban a user.')
					.setValue('userPunishListBan')
				    .setEmoji('⚒️'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Kick')
					.setDescription('Kick & Unkick a user')
					.setValue('userPunishListKick')
				    .setEmoji('🦵'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Mute')
					.setDescription('View all mutes, mute a user and unmute a user.')
				.setEmoji('🙊')
					.setValue('userPunishListMute'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Warns')
					.setDescription('View all warns, Warn a user and unwarn a user.')
					.setValue('userPunishListWarn')
				    .setEmoji('‼️'),

									 )
										 )
					], ephemeral: true
				})
			}

	client.on(Events.InteractionCreate, async (ine) => {

			
		const data = await model.findOne({
		CatagoryId: ine.channel.parentId
	});

		if(data){
			const dataRole = await modelRole.findOne({
					CatagoryId: data.CatagoryId,
		SpaceBanId: data.CatagoryId
				});

			const dataUser = await modelUser.findOne({
		UserId: ine.user.id
	})

			

if (!ine.isSelectMenu()) return;

	if (ine.customId === 'userPunishListSM') {
		if(ine.values == 'userPunishListBan'){
			return ine.reply({content:`Select one at a time.`, 
						components: [new ActionRowBuilder()
									
				.addComponents(
					new ButtonBuilder()
			.setCustomId('banUserModal')
			.setLabel('Ban a user from Space!')
			.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
			.setCustomId('unbanUserModal')
			.setLabel('Unban a user from Space!')
			.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
			.setCustomId('banUserListModal')
			.setLabel('View all bans in space.')
			.setStyle(ButtonStyle.Secondary),
				)
			], ephemeral: true
					})
		}
		
		if(ine.values == 'userPunishListMute'){
			return ine.reply({content:`Select one at a time.`, 
						components: [new ActionRowBuilder()
									
				.addComponents(
					new ButtonBuilder()
			.setCustomId('muteUserModal')
			.setLabel('Mute a user from Space!')
			.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
			.setCustomId('unmuteUserModal')
			.setLabel('Unmute a user from Space!')
			.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
			.setCustomId('viewMutes')
			.setLabel('View all Mutes in spacee.')
			.setDisabled(true)
			.setStyle(ButtonStyle.Secondary),
				)
									 
			], ephemeral: true
					})
		}
		if(ine.values == 'userPunishListKick'){
				return ine.reply({content:`Select one at a time.`, 
						components: [new ActionRowBuilder()
									
				.addComponents(
					new ButtonBuilder()
			.setCustomId('kickUserModal')
			.setLabel('Kick a user from Space!')
			.setStyle(ButtonStyle.Danger),
				)
			], ephemeral: true
					})
		}
		if(ine.values == 'userPunishListWarn'){
			return ine.reply({content:`Select one at a time.`, 
						components: [new ActionRowBuilder()
									
				.addComponents(
					new ButtonBuilder()
			.setCustomId('warnUserModal')
			.setLabel('Warn a user from Space!')
			.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
			.setCustomId('unwarnUserModal')
			.setLabel('Unwarn a user from Space!')
			.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
			.setCustomId('warnUserListModal')
			.setLabel('View all warn in space.')
			.setStyle(ButtonStyle.Secondary),
				)
			], ephemeral: true
					})
		}
	}
			
		} 
	})

	
}
			
		})
					
				

		
		

	client.on(Events.InteractionCreate, async (inet) => {

		
						
		const data = await model.findOne({
		CatagoryId: inet.channel.parentId
	});

		if(data){
			const dataUser = await modelUser.findOne({
		UserId: inet.user.id,
		SpaceBanId: data.CatagoryId
	})

            
		
      			const dataRole = await modelRole.findOne({
					CatagoryId: data.CatagoryId
				});
          
          if(inet.customId == "deleteSpaceButton"){
            
            return inet.reply({
              content: "This is a very **DANGEROUS** move, you can choose to either delete everything (roles, channels, backups, space and the database) or you can choose to just delete the database and don't effect anything to the channels or roles. You must select one of these if you are planning on deleting this, if you wish to cancel, dismiss the message.", ephemeral: true, components: [
                 new ActionRowBuilder()
									 .addComponents(
										 new ButtonBuilder()
								 .setCustomId('deleteEverythingSpace')
								 .setLabel('Delete everything')
								 .setStyle(ButtonStyle.Danger),
                                       	 new ButtonBuilder()
								 .setCustomId('deleteDatabaseSpace')
								 .setLabel('Delete database and backups.')
								 .setStyle(ButtonStyle.Secondary),
										 )
              ]
            })
            
          }
          
          if(inet.customId == "deleteEverythingSpace"){
            
            inet.channel.send("Deletion is progress! Goodbye "+data.spaceName);
            
            	const catagory = inet.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == data.spaceName)  || interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.id == data.spaceName)

		let spaceData = await model.findOne({
					CatagoryId: catagory.id
			})

		const modelConfig = require("../models/configureServer")
		const configData3 = await modelConfig.findOne({
					GuildId: inet.guild.id
				})
		
		let channel2 = client.channels.cache.get(configData3.spaceAdCH);

		channel2.messages.delete(spaceData.MessageId);
            
            client.guilds.cache.get(inet.guild.id).roles.cache.find( role => role.id == dataRole.OwnerId).delete();

				    
            client.guilds.cache.get(inet.guild.id).roles.cache.find( role => role.id == dataRole.AdminId).delete();

			    
            client.guilds.cache.get(inet.guild.id).roles.cache.find( role => role.id == dataRole.MemberId).delete();
          

		model.find({
			spaceName: data.spaceName
		}).deleteOne().exec();

		modelRole.find({
			CatagoryId: catagory.id
		}).deleteOne().exec();

		modelUser.find({
			SpaceBanId: catagory.id
		}).deleteMany().exec();
            
        modelUserWarn.find({
			SpaceId: catagory.id
		}).deleteMany().exec();
            
        let findBackups = await modelBackup.find({
          CatagoryId: data.CatagoryId
        })    
        
        findBackups.forEach(async (backupdb) => {
          backup.setStorageFolder("./backup/")
          await backup.remove(backupdb.BackupId);
        });
            
        modelBackup.find({
          CatagoryId: data.CatagoryId
        }).deleteMany().exec();        
            

	catagory.children.cache.forEach(channel => channel.delete());

	catagory.delete();

        }		
          
     if(inet.customId == "deleteDatabaseSpace"){
       
          inet.channel.send("Deletion is progress! Goodbye "+data.spaceName);
       
         	const catagory = inet.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == data.spaceName)  || inet.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.id == data.spaceName)

		let spaceData = await model.findOne({
					CatagoryId: catagory.id
			})

		const modelConfig = require("../models/configureServer")
		const configData3 = await modelConfig.findOne({
					GuildId: inet.guild.id
				})
		
		let channel2 = client.channels.cache.get(configData3.spaceAdCH);

		channel2.messages.delete(spaceData.MessageId);

		if(catagory == undefined){
			return inet.followUp("I could not delete the space as this space does not exist.")
		}

		model.find({
			spaceName: data.spaceName
		}).deleteOne().exec();

		modelRole.find({
			CatagoryId: catagory.id
		}).deleteOne().exec();

		modelUser.find({
			SpaceBanId: catagory.id
		}).deleteMany().exec();
            
        modelUserWarn.find({
			SpaceId: catagory.id
		}).deleteMany().exec();
            
        let findBackups = modelBackup.find({
          CatagoryId: data.CatagoryId
        })    
        
            
        modelBackup.find({
          CatagoryId: data.CatagoryId
        }).deleteMany().exec();   
     }
          
          if(inet.customId == "privacySpace"){
             const modal = new ModalBuilder()
			.setCustomId('privacySpaceModal')
			.setTitle('Privacy Features for Space');

		const showSpace = new TextInputBuilder()
			.setCustomId('showSpace')
			.setLabel("Space invisable in search?")
            .setValue(`${data.showSpace || "false"}`)
			.setMinLength(4)
			.setMaxLength(5)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

	
		const thirdActionRow = new ActionRowBuilder().addComponents(showSpace);

		// Add inputs to the modal
		modal.addComponents(thirdActionRow);

		// Show the modal to the user
		await inet.showModal(modal);
            
            client.on(Events.InteractionCreate, async (i) => {
				if (!i.isModalSubmit()) return;

				if(i.customId == "privacySpaceModal"){
                  const showSpace = i.fields.getTextInputValue('showSpace');
                  
                  let showSpace2 = showSpace.toUpperCase()
                  
                  if(showSpace2 == "TRUE"){
                     let x = await model.findOneAndUpdate({ CatagoryId: data.CatagoryId }, { showSpace: true });
                  
                  } else if(showSpace2 == "FALSE") {
                       let x = await model.findOneAndUpdate({ CatagoryId: data.CatagoryId }, { showSpace: false });
                  } else {
                    return i.reply({
                      content: "Please use boolean key words like true or false"
                    })
                  }
                  
                 
                  i.reply({
                    content: "Privacy features applied.", ephemeral: true
                  })
                  
                  }
            })
            
          }
          
          if(inet.customId == "editAd"){
            const modal = new ModalBuilder()
			.setCustomId('spaceEditModal')
			.setTitle('Edit your space!');

		const spaceDescription = new TextInputBuilder()
			.setCustomId('spaceDescription')
			.setLabel("Description of Space")
			.setValue(`${data.SpaceDescription || "Thats odd. Well something is supposed to be here. Guess your space was bugged."}`)
			.setMinLength(15)
			.setMaxLength(800)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		const spaceImg = new TextInputBuilder()
			.setCustomId('spaceImg')
			.setLabel("Image URL")
			.setValue(`${data.ImageURL}`)
			.setMinLength(7)
			.setMaxLength(800)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

		const WelcomeID = new TextInputBuilder()
			.setCustomId('welcomeID')
			.setLabel("Welcome Channel Name or ID")
			.setValue(`${data.WelcomeChannel}`)
			.setMinLength(1)
			.setMaxLength(48)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

	
		const thirdActionRow = new ActionRowBuilder().addComponents(spaceDescription);

			const fouthActionRow = new ActionRowBuilder().addComponents(spaceImg);


		const fifthActionRow = new ActionRowBuilder().addComponents(WelcomeID);

		// Add inputs to the modal
		modal.addComponents(thirdActionRow, fouthActionRow, fifthActionRow);

		// Show the modal to the user
		await inet.showModal(modal);
            
            
				client.on(Events.InteractionCreate, async (i) => {
				if (!i.isModalSubmit()) return;

				if(i.customId == "spaceEditModal"){
                  const spaceDescription = i.fields.getTextInputValue('spaceDescription')
                   const spaceImg = i.fields.getTextInputValue('spaceImg')
                    const welcomeId = i.fields.getTextInputValue('welcomeId')
                    let checkConfig = await modelConfig.findOne({ GuildId: i.guild.id });
                    let ch1 = await client.channels.cache.get(checkConfig.appCH);
			let msg = ch1.messages.fetch(data.MessageId).then(msg =>  msg.edit({
              embeds: [
			new EmbedBuilder()
	 			.setTitle(`${data.spaceName}`)
			.setAuthor({ name: data.spaceName, iconURL: spaceImg})
				.setDescription(`${spaceDescription}`)
			.setThumbnail(`${spaceImg}`)
				.setColor("Random")
			.setTimestamp()
			.setFooter({ text: `DIM Spaces V3 - ${data.spaceName}`, iconURL: spaceImg })
				
		]
            }));
                  
                  let x = await model.findOneAndUpdate({ CatagoryId: data.CatagoryId }, { WelcomeChannel: welcomeId })
                  
                  i.reply({
                    content: "Your space has been edited!", ephemeral: true
                  })
                  
                }
                })
          }

			if(inet.customId == "createBackup"){
				const modal = new ModalBuilder()
					.setCustomId('createBackupModal')
					.setTitle(`Create a backup for ${data.spaceName}.`);

				// Add components to modal

				// Create the text input components
				const backName = new TextInputBuilder()
					.setCustomId('backName')
					// The label is the prompt the user sees for this input
					.setLabel("Backup Label")
					// Short means only a single line of text
					.setPlaceholder("")
					.setRequired(true)
					.setMinLength(0)
					.setMaxLength(50)


					.setStyle(TextInputStyle.Short);



				// An action row only holds one text input,
				// so you need one action row per text input.
				const firstActionRow = new ActionRowBuilder().addComponents(backName);



				// Add inputs to the modal
				modal.addComponents(firstActionRow);

				// Show the modal to the user
				await inet.showModal(modal);

				client.on(Events.InteractionCreate, async (i) => {
				if (!i.isModalSubmit()) return;

				if(i.customId == "createBackupModal"){
					const backName = i.fields.getTextInputValue('backName')
						backup.setStorageFolder("./backup/")
						
	i.reply({
		content: "Creating your backup...", ephemeral: true
	})
					await backup.createSpace(i.guild, `${data.CatagoryId}`).then((bc) => {
    
                      let parsedBC = JSON.parse(bc);
                       
						i.followUp({content:`Backup has been created and saved! You can load the backup if necesscary.`, ephemeral: true})
						
								new modelBackup({
									GuildId: i.guild.id,
									CatagoryId: data.CatagoryId,
									BackupName: backName,
									BackupId: parsedBC.id,
                                    BackupData: bc
						}).save()
					})
				}
				})
			}

			if(inet.customId == "unwarnUserModal"){
							const modal = new ModalBuilder()
			.setCustomId('unwarnUserModelSB')
			.setTitle(`UnWarn a user from ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const warnId = new TextInputBuilder()
			.setCustomId('warnid')
		    // The label is the prompt the user sees for this input
			.setLabel("Warn ID")
		    // Short means only a single line of text
			.setPlaceholder("[8 character ID]")
			.setRequired(true)
			.setMinLength(8)
			.setMaxLength(8)
			
			
			.setStyle(TextInputStyle.Short);

						

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(warnId);
		
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow);

		// Show the modal to the user
		await inet.showModal(modal);

							client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "unwarnUserModelSB"){
		const warnid = i.fields.getTextInputValue('warnid');
		

		
		

		function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

		const dataUserFind = await modelUserWarn.findOne({	
		SpaceId: data.CatagoryId,
		WarnId: warnid
	})

		 const guild = client.guilds.cache.get(i.guild.id); 
		const member = await guild.members.fetch(dataUserFind.UserId);

			if(member == undefined){
			return i.reply({content: `Warn is invalid!`,  ephemeral: true });
			}									 

		if(member.roles.cache.has(dataRole.MemberId)){

		

		
if(!dataUserFind){
	

	return i.reply({content: `Warn not found!`,  ephemeral: true });

} else {

	  let x = await modelUserWarn.findOneAndUpdate({ SpaceId: data.CatagoryId, WarnId: dataUserFind.WarnId }, { isWarnActive: "false" })

	client.users.send(dataUserFind.UserId, `Your warn has been removed from ${data.spaceName}!`);

	 i.reply({content: `${member.user.username} warn has been removed and user has been nottified`,  ephemeral: true });

	
}
		} else {
	return i.reply(`${member.user.username} isn't in this space...`, { ephemeral: true });
}
		
		

	}

							})
			}

								

			if(inet.customId == "warnUserModal"){
							const modal = new ModalBuilder()
			.setCustomId('warnUserModelSB')
			.setTitle(`Warn a user from ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const userId = new TextInputBuilder()
			.setCustomId('userId')
		    // The label is the prompt the user sees for this input
			.setLabel("User Id")
		    // Short means only a single line of text
			.setPlaceholder("[User id]")
			.setRequired(true)
			.setMinLength(0)
			.setMaxLength(88)
			
			
			.setStyle(TextInputStyle.Short);

			const reasonString = new TextInputBuilder()
			.setCustomId('reason')
		    // The label is the prompt the user sees for this input
			.setLabel("Reason")
		    // Short means only a single line of text
			.setPlaceholder("Rude to our members")
			.setRequired(false)
			.setMinLength(0)
			.setMaxLength(125)
			
			.setStyle(TextInputStyle.Paragraph);

				const warnDuration = new TextInputBuilder()
			.setCustomId('warnDuration')
		
			.setLabel("Warn Duration")
		    // Short means only a single line of text
			.setPlaceholder("[5s, 5h, 5d]")
			.setRequired(false)
			.setMinLength(0)
			.setStyle(TextInputStyle.Short);

						

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(userId);
		const secondActionRow = new ActionRowBuilder().addComponents(reasonString);
					const thirActionRow = new ActionRowBuilder().addComponents(warnDuration);
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow, thirActionRow);

		// Show the modal to the user
		await inet.showModal(modal);

							client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "warnUserModelSB"){
		const userId = i.fields.getTextInputValue('userId');
		const reason = i.fields.getTextInputValue('reason') || 'Unknown reason';
		const warnDuration = i.fields.getTextInputValue('warnDuration')

		
		 const guild = client.guilds.cache.get(i.guild.id); 
		const member = await guild.members.fetch(userId);

		function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

		

	

		if(member.roles.cache.has(dataRole.MemberId)){

			const warnid = makeid(8);

			if(warnDuration){
				const ms = require("ms")

			let warnDuMS = Date.now()+ ms(warnDuration);

				new modelUserWarn({
		    WarnId: warnid,
       		UserId: userId,
			isWarnActive: "true",
			WarnReason: reason,
			SpaceId: data.CatagoryId,
			warnDuration: warnDuMS		
			
        }).save()

				client.users.send(userId, `You have been warned from ${data.spaceName} for ${reason}! [${warnid}]. Luckily this warn will expire <t:${parseInt(warnDuMS / 1000, 10)}:R>`);

	 i.reply({content: `${member.user.username} has been warned and should be notified! [${warnid}]. It expires <t:${parseInt(warnDuMS / 1000, 10)}:R>`,  ephemeral: true });
	
			} else {
				new modelUserWarn({
		    WarnId: warnid,
       		UserId: userId,
			isWarnActive: "true",
			WarnReason: reason,
			SpaceId: data.CatagoryId
			
        }).save()
	

		client.users.send(userId, `You have been warned from ${data.spaceName} for ${reason}! [${warnid}]`);

	 i.reply({content: `${member.user.username} has been warned and should be notified! [${warnid}]`,  ephemeral: true });
			}

	
	

		} else {
	return i.reply(`${member.user.username} isn't in this space...`, { ephemeral: true });
}
		
		

	}

							})
			}

								if(inet.customId == "warnUserListModal"){
					const eachDataUser = await modelUserWarn.find({
		SpaceId: data.CatagoryId, isWarnActive: "true"
	})

									if(eachDataUser.length > 0){
											inet.reply({content: "Refer to DMS", ephemeral: true})
										eachDataUser.map(a => {
										
											client.users.send(inet.user.id, `## <@${a.UserId}> - ${a.WarnReason} - ${a.WarnId}`);
											
										})
									} else {
										inet.reply({content: "No active warns found.", ephemeral: true})
									}
	
				
								
				
			}

							

			if(inet.customId == "viewAdmins"){

				let AdminF = client.guilds.cache.get(inet.guild.id).roles.cache.get(dataRole.AdminId).members.map(m=>m.user.username).join(', ')
				
				return inet.reply({content: `${AdminF}`, ephemeral: true})
			}

			if(inet.customId == "addAdminModal"){
				const modal = new ModalBuilder()
			.setCustomId('addAdminModalSB')
			.setTitle(`Add a admin to ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const userId = new TextInputBuilder()
			.setCustomId('userId')
		    // The label is the prompt the user sees for this input
			.setLabel("User Id")
		    // Short means only a single line of text
			.setPlaceholder("[User id]")
			.setRequired(true)
			.setMinLength(0)
			.setMaxLength(88)
			
			
			.setStyle(TextInputStyle.Short);

			
						

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(userId);
		
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow);

		// Show the modal to the user
		await inet.showModal(modal);

				client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

					

	if(i.customId == "addAdminModalSB"){
		const userId = i.fields.getTextInputValue('userId');

		 const guild = client.guilds.cache.get(i.guild.id);
    const role = client.guilds.cache.get(inet.guild.id).roles.cache.get(dataRole.AdminId).id;

		
    const member = await guild.members.fetch(userId);
		if(member.roles.cache.has(role)){
			return i.reply({content: `<@${userId}> already is an admin in this space!`, ephemeral: true})
		}
		
    member.roles.add(`${role}`);
	 member.roles.add(`1131972460917567608`);

		i.reply({content: `Role added to <@${userId}>!`, ephemeral: true})

		
	}
				})
			}

			if(inet.customId == "removeAdminModal"){
				const modal = new ModalBuilder()
			.setCustomId('removeAdminModalSB')
			.setTitle(`Remove an admin from ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const userId = new TextInputBuilder()
			.setCustomId('userId')
		    // The label is the prompt the user sees for this input
			.setLabel("User Id")
		    // Short means only a single line of text
			.setPlaceholder("[User id]")
			.setRequired(true)
			.setMinLength(0)
			.setMaxLength(88)
			
			
			.setStyle(TextInputStyle.Short);

			
						

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(userId);
		
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow);

		// Show the modal to the user
		await inet.showModal(modal);

				client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "removeAdminModalSB"){
		const userId = i.fields.getTextInputValue('userId');

		 const guild = client.guilds.cache.get(i.guild.id);
     const role = client.guilds.cache.get(inet.guild.id).roles.cache.get(dataRole.AdminId).id;

		
    const member = await guild.members.fetch(userId);
		if(!member.roles.cache.has(role)){
			return i.reply({content: `<@${userId}> isn't an admin`, ephemeral: true})
		}
		
    member.roles.remove(`${role}`);
	 member.roles.remove(`1131972460917567608`);

		i.reply({content: `Role removed from <@${userId}>!`, ephemeral: true})

		
	}
				})
			}
			
			if(inet.customId == "banUserListModal"){
					const eachDataUser = await modelUser.find({
		SpaceBanId: data.CatagoryId, isBanned: "true"
	})

				return inet.reply({content: `${eachDataUser.map(m=>m.UserId).join(', ') || "No bans found!"}`, ephemeral: true})
				
	
				
				
				
			}
						if(inet.customId == "unbanUserModal"){
							const modal = new ModalBuilder()
			.setCustomId('unbanUserModelSB')
			.setTitle(`Unban a user from ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const userId = new TextInputBuilder()
			.setCustomId('userId')
		    // The label is the prompt the user sees for this input
			.setLabel("User Id")
		    // Short means only a single line of text
			.setPlaceholder("[User id]")
			.setRequired(true)
			.setMinLength(0)
			.setMaxLength(88)
			
			
			.setStyle(TextInputStyle.Short);

			const reasonString = new TextInputBuilder()
			.setCustomId('reason')
		    // The label is the prompt the user sees for this input
			.setLabel("Reason")
		    // Short means only a single line of text
			.setPlaceholder("Violated one of our important rules!")
			.setRequired(false)
			.setMinLength(0)
			.setMaxLength(125)
			
			.setStyle(TextInputStyle.Paragraph);

						

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(userId);
		const secondActionRow = new ActionRowBuilder().addComponents(reasonString);
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await inet.showModal(modal);

							client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "unbanUserModelSB"){
		const userId = i.fields.getTextInputValue('userId');
		const reason = i.fields.getTextInputValue('reason') || 'Not specified'

		
		 const guild = client.guilds.cache.get(i.guild.id); 
		const member = await guild.members.fetch(userId);

		const dataUserFind = await modelUser.findOne({
		UserId: userId,
		SpaceBanId: data.CatagoryId
	})

	
if(!dataUserFind){

	return i.reply(`<@${userId}> is not banned as of currently!`)
	
} else {
	 	let x = await modelUser.findOneAndUpdate({ UserId: userId, SpaceBanId: data.CatagoryId }, { $unset: { banDuration: 1, banReason: 1, isBanned: 1} })
	
	 i.reply({content:`${member.user.username} has been unbanned and should be notified!`,  ephemeral: true });

		client.users.send(userId, `You have been unbanned from ${data.spaceName} for ${reason}!`);
}
	

	
}	
			

		

	})
						

							
						}

						if(inet.customId == "banUserModal"){
							const modal = new ModalBuilder()
			.setCustomId('banUserModelSB')
			.setTitle(`Ban a user from ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const userId = new TextInputBuilder()
			.setCustomId('userId')
		    // The label is the prompt the user sees for this input
			.setLabel("User Id")
		    // Short means only a single line of text
			.setPlaceholder("[User id]")
			.setRequired(true)
			.setMinLength(0)
			.setMaxLength(88)
			
			
			.setStyle(TextInputStyle.Short);

			const reasonString = new TextInputBuilder()
			.setCustomId('reason')
		    // The label is the prompt the user sees for this input
			.setLabel("Reason")
		    // Short means only a single line of text
			.setPlaceholder("Violated one of our important rules!")
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
		const firstActionRow = new ActionRowBuilder().addComponents(userId);
		const secondActionRow = new ActionRowBuilder().addComponents(reasonString);
								const tar = new ActionRowBuilder().addComponents(banDuration);
								const far = new ActionRowBuilder().addComponents(clearMessages);
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow, tar, far);

		// Show the modal to the user
		await inet.showModal(modal);

							client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "banUserModelSB"){
		const userId = i.fields.getTextInputValue('userId');
		const reason = i.fields.getTextInputValue('reason') || 'Not specified'
		const banDuration = i.fields.getTextInputValue('banduration')
		const CM = i.fields.getTextInputValue('clearMessages').toUpperCase() || "1"

		
	   if(userId == interaction.user.id){
			return interaction.reply({content: `You can't do a **DANGEROUS** command to yourself.`, ephemeral: true})	
		}
		
		 const guild = client.guilds.cache.get(i.guild.id); 
		const member = await guild.members.fetch(userId);

if(member.roles.cache.has(dataRole.MemberId)){
	member.roles.remove(dataRole.MemberId); 

	// Delete Message History 
		if(Number(CM) == NaN){
			if (CM === "ALL"){

  let allMessages = [];
  let lastMessageId = "";
  const { limit } = -1;
  const resolvedLimit = typeof limit === 'undefined' || limit === -1 ? Infinity : limit;

				
				const CMCAT =  client.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == data.spaceName) 
				CMCAT.children.cache.forEach(async (channel) => {
			
						const deleteCHMsgs = setInterval(async () => {
						 // create fetch options
    const fetchLimitOptions = { limit: 100, filter: m => m.author.id === userId };
				
    // fetch messages
    const messages = await channel.messages.fetch(fetchLimitOptions).then((msgse) => {
		 channel.bulkDelete(msgse, true)
	})   
					}, 500)
					
					setInterval(async () => {
						  const fetchLimitOptions = { limit: 100, filter: m => m.author.id === userId };
					
    const checkMSGs = await channel.messages.fetch(fetchLimitOptions).then((msgs) => {
							if(msgs == null || !msgs.length){
		clearInterval(deleteCHMsgs)
	}			
		
	})

	
					
					}, 500)

					
				});
			} else {
				// Do nothing....
			}
		} else {

// fetch messages
  let allMessages = [];
  let lastMessageId = "";
  const { limit } = CM;
  const resolvedLimit = typeof limit === 'undefined' || limit === -1 ? Infinity : limit;

			
			const CMCAT =  client.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == data.spaceName) 
				CMCAT.children.cache.forEach(async (channel) => {

					if(limit == -1){
						const deleteCHMsgs = setInterval(async () => {
						 // create fetch options
    const fetchLimitOptions = { limit: 100, filter: m => m.author.id === userId };
				
    // fetch messages
    const messages = await channel.messages.fetch(fetchLimitOptions).then((msgse) => {
		 channel.bulkDelete(msgse, true)
	})   
					}, 500)
					
					setInterval(async () => {
						  const fetchLimitOptions = { limit: 100, filter: m => m.author.id === userId };
					
    const checkMSGs = await channel.messages.fetch(fetchLimitOptions).then((msgs) => {
							if(msgs == null || !msgs.length){
		clearInterval(deleteCHMsgs)
	}			
		
	})

	
					
					}, 500)
					} else {
						
    const fetchLimitOptions = { limit: CM, filter: m => m.author.id === userId };
				
    // fetch messages
    const messages = await channel.messages.fetch(fetchLimitOptions).then((msgse) => {
		 channel.bulkDelete(msgse, true)
	})   
			
					
					
					}
						

					 
		
				})
		}

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

	 i.reply({content: `${member.user.username} has been banned and should be notified! It expires <t:${parseInt(banDuMS / 1000, 10)}:R> \n Note: If you have you choosen to clear messages, due to API Limits, all of the banned users messages must be send under 14 days. You can delete those messages manually though`,  ephemeral: true });
	} else {
		new modelUser({
       		UserId: userId,
			isBanned: "true",
			banReason: reason,
			SpaceBanId: data.CatagoryId
			
        }).save()

	 i.reply({content: `${member.user.username} has been banned permanantly and should be notified!  \n Note: If you have you choosen to clear messages, due to API Limits, all of the banned users messages must be send under 14 days. You can delete those messages manually though`,  ephemeral: true });

		client.users.send(userId, `You have been banned from ${data.spaceName} for ${reason}! It is permanant and it will stay that way unless you get really really lucky...`);

	}
	} else if(dataUserFind && dataUserFind.isBanned && dataUserFind.BanReason) {

	if(banDuration){
		const ms = require("ms")

			let banDuMS = Date.now()+ ms(banDuration);

		 let x = await modelUser.findOneAndUpdate({ UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason, banDuration: banDuMS })

			client.users.send(userId, `Your ban has been editted from ${data.spaceName}. Heres whats been editted \n Reason: Reason: ${reason} \n Expiration date: <t:${parseInt(banDuMS / 1000, 10)}:R>.`);

	 i.reply({content: `${member.user.username}'s banishment has been editted and should be notified! It expires <t:${parseInt(banDuMS / 1000, 10)}:R> \n Note: If you have you choosen to clear messages, due to API Limits, all of the banned users messages must be send under 14 days. You can delete those messages manually though`,  ephemeral: true });
	} 
	else {
		 let x = await modelUser.findOneAndUpdate({ UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason })

	 i.reply({content: `${member.user.username}'s banishment has been editted and should be notified!  \n Note: If you have you choosen to clear messages, due to API Limits, all of the banned users messages must be send under 14 days. You can delete those messages manually though`,  ephemeral: true });

		client.users.send(userId, `Your ban has been editted from ${data.spaceName}. Heres what been editted \n Reason: ${reason}.`);
	}
	 
}
}		 else {
	return i.reply({content: `${member.user.username} isn't in this space...`,  ephemeral: true });
}
			

		

	}
						})

							
						}

							if(inet.customId == "unmuteUserModal"){
							const modal = new ModalBuilder()
			.setCustomId('unmuteUserModelSB')
			.setTitle(`UnMute a user from ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const userId = new TextInputBuilder()
			.setCustomId('userId')
		    // The label is the prompt the user sees for this input
			.setLabel("User Id")
		    // Short means only a single line of text
			.setPlaceholder("[User id]")
			.setRequired(true)
			.setMinLength(0)
			.setMaxLength(88)
			
			
			.setStyle(TextInputStyle.Short);

			const reasonString = new TextInputBuilder()
			.setCustomId('reason')
		    // The label is the prompt the user sees for this input
			.setLabel("Reason")
		    // Short means only a single line of text
			.setPlaceholder("He was not rude :>")
			.setRequired(false)
			.setMinLength(0)
			.setMaxLength(125)
			
			.setStyle(TextInputStyle.Paragraph);

						

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(userId);
		const secondActionRow = new ActionRowBuilder().addComponents(reasonString);
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await inet.showModal(modal);

							client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "unmuteUserModelSB"){
		const userId = i.fields.getTextInputValue('userId');
		const reason = i.fields.getTextInputValue('reason') || 'Not specified'

		 const guild = client.guilds.cache.get(i.guild.id); 
		const member = await guild.members.fetch(userId);

		const catagory = client.channels.cache.get(ine.channel.parentId);

		catagory.permissionOverwrites.delete(userId);

		await i.reply(`${member.user.username} has been unmuted and should be notified!`, { ephemeral: true });

		client.users.send(userId, `Luck is in your side! You have been unmuted from ${data.spaceName} for ${reason}!`);
		
			

		

	}
						})

							
						}

						if(inet.customId == "muteUserModal"){
							const modal = new ModalBuilder()
			.setCustomId('muteUserModelSB')
			.setTitle(`Mute a user from ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const userId = new TextInputBuilder()
			.setCustomId('userId')
		    // The label is the prompt the user sees for this input
			.setLabel("User Id")
		    // Short means only a single line of text
			.setPlaceholder("[User id]")
			.setRequired(true)
			.setMinLength(0)
			.setMaxLength(88)
			
			
			.setStyle(TextInputStyle.Short);

			const reasonString = new TextInputBuilder()
			.setCustomId('reason')
		    // The label is the prompt the user sees for this input
			.setLabel("Reason")
		    // Short means only a single line of text
			.setPlaceholder("Too rude :<")
			.setRequired(false)
			.setMinLength(0)
			.setMaxLength(125)
			
			.setStyle(TextInputStyle.Paragraph);

							const muteDuration = new TextInputBuilder()
			.setCustomId('muteDuration')
		    // The label is the prompt the user sees for this input
			.setLabel("Mute Duration")
		    // Short means only a single line of text
			.setPlaceholder("[5s, 5h, 5d]")
			.setRequired(false)
			.setMinLength(0)
			.setStyle(TextInputStyle.Short);

						

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(userId);
		const secondActionRow = new ActionRowBuilder().addComponents(reasonString);
							const tActionRow = new ActionRowBuilder().addComponents(muteDuration);
							
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow, tActionRow);

		// Show the modal to the user
		await inet.showModal(modal);

							client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "muteUserModelSB"){
		const userId = i.fields.getTextInputValue('userId');
		const reason = i.fields.getTextInputValue('reason') || 'Not specified'
			const muteDuration = i.fields.getTextInputValue('muteDuration')  

		 const guild = client.guilds.cache.get(i.guild.id); 
		const member = await guild.members.fetch(userId);

		const catagory = client.channels.cache.get(i.channel.parentId);

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
			muteDuration: muteDuMS,
			SpaceBanId: data.CatagoryId
        }).save()

		await i.reply({ content: `${member.user.username} has been muted for <t:${parseInt(muteDuMS / 1000, 10)}:R> and should be notified!`,  ephemeral: true });

		client.users.send(userId, `Oh! Unlucky, You are now muted! You will be able to interact in ${data.spaceName} <t:${parseInt(muteDuMS / 1000, 10)}:R>. Reason is ${reason}!`);

			
} else {
	 let x = await modelUser.findOneAndUpdate({ UserId: userId, SpaceBanId: data.CatagoryId }, { muteDuration: muteDuMS })

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

						if(inet.customId == "kickUserModal"){
							const modal = new ModalBuilder()
			.setCustomId('kickUserModelSB')
			.setTitle(`Kick a user from ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const userId = new TextInputBuilder()
			.setCustomId('userId')
		    // The label is the prompt the user sees for this input
			.setLabel("User Id")
		    // Short means only a single line of text
			.setPlaceholder("[User id]")
			.setRequired(true)
			.setMinLength(0)
			.setMaxLength(88)
			
			
			.setStyle(TextInputStyle.Short);

			const reasonString = new TextInputBuilder()
			.setCustomId('reason')
		    // The label is the prompt the user sees for this input
			.setLabel("Reason")
		    // Short means only a single line of text
			.setPlaceholder("Uncool very Unool")
			.setRequired(false)
			.setMinLength(0)
			.setMaxLength(125)
			
			.setStyle(TextInputStyle.Paragraph);

						

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(userId);
		const secondActionRow = new ActionRowBuilder().addComponents(reasonString);
				

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await inet.showModal(modal);

							client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "kickUserModelSB"){
		const userId = i.fields.getTextInputValue('userId');
		const reason = i.fields.getTextInputValue('reason') || 'Not specified'

		 const guild = client.guilds.cache.get(i.guild.id); 
		const member = await guild.members.fetch(userId);

if(member.roles.cache.has(dataRole.MemberId)){
	member.roles.remove(dataRole.MemberId); 

	await i.reply(`${member.user.username} has been kicked and should be notified!`, { ephemeral: true });

		client.users.send(userId, `You have been kicked from ${data.spaceName} for ${reason}!`);
}		 else {
	await i.reply(`${member.user.username} isn't in this space...`, { ephemeral: true });
}
		



		
			

		

	}
						})

							
						}

						
					

						if(inet.customId == "setupDashModel"){
							
const modal = new ModalBuilder()
			.setCustomId('setupDashRole')
			.setTitle(`Setup dashboard for ${data.spaceName}.`);

		// Add components to modal

		// Create the text input components
		const ownerId = new TextInputBuilder()
			.setCustomId('ownerId')
		    // The label is the prompt the user sees for this input
			.setLabel("Owner Role Id")
		    // Short means only a single line of text
			.setPlaceholder("[Role id]")
			.setValue(`${client.guilds.cache.get(inet.guild.id).roles.cache.find( role => role.name == `${data.spaceName} - Space - Owner`)?.id || ""}`)
			
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

			const adminId = new TextInputBuilder()
			.setCustomId('adminid')
		    // The label is the prompt the user sees for this input
			.setLabel("Admin Role Id")
		    // Short means only a single line of text
			.setPlaceholder("[Role Id]")
						.setValue(`${client.guilds.cache.get(inet.guild.id).roles.cache.find( role => role.name == `${data.spaceName} - Space - Admin`)?.id || ""}`)
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

						const memberId = new TextInputBuilder()
			.setCustomId('memberId')
		    // The label is the prompt the user sees for this input
			.setLabel("Member Role Id")
		    // Short means only a single line of text
			.setPlaceholder("[Role Id]")
			.setValue(`${client.guilds.cache.get(inet.guild.id).roles.cache.find( role => role.name == `${data.spaceName} - Space - Member`)?.id || ""}`)
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(ownerId);
		const secondActionRow = new ActionRowBuilder().addComponents(adminId);
							const thirdAR = new ActionRowBuilder().addComponents(memberId);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow, thirdAR);

		// Show the modal to the user
		await inet.showModal(modal);

							client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "setupDashRole"){
		const OwnerId = i.fields.getTextInputValue('ownerId');
		const adminId = i.fields.getTextInputValue('adminid');
			const memberId = i.fields.getTextInputValue('memberId');

		modelRole.findOne({ CatagoryId: `${data.CatagoryId || inet.channel.parentId}` }, async(err, data) => {
      if(!data){
        new modelRole({
       		OwnerId: OwnerId,
			AdminId: adminId,
			MemberId: memberId,
			CatagoryId: inet.channel.parentId
			
        }).save()

		  await i.reply({content: "Dashboard Roles have been saved! Reuse to commamnd to fully use the dashboard", ephemeral: true})
	  }
				if(data){
					  let x = await modelRole.findOneAndUpdate({ CatagoryId: `${data.CatagoryId || inet.channel.parentId}` }, {OwnerId: OwnerId,
			AdminId: adminId,
			MemberId: memberId, })
					  await i.reply({content: "Edited! Reuse the command to fully use the dashboard", ephemeral: true})
				}
		})

	}
						})

							
						}
		}

						
		})

		
      			

						
				
		