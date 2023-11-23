const { Client, CommandInteraction, ApplicationCommandType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const Discord = require(`discord.js`)
const { glob } = require("glob");
const model = require("../../models/space")
const modelRole = require("../../models/spaceRole")
const { promisify } = require("util");
const globPromise = promisify(glob);
const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
module.exports = {
    name: "dashboard",
    description: "View the dashboard of your space!",
	type: ApplicationCommandType.ChatInput,
    devOnly: false,
	ephemeralCmd: true,
	
    
    run: async (client, interaction, args) => {

		if(!interaction.channel.parentId) return interaction.reply({content: "Please use this command in a catagory please!", ephemeral: true});
     		
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
      
       if(interaction.member.roles.cache.has(dataRole?.AdminId) && !interaction.member.roles.cache.has(dataRole?.OwnerId)){
						await interaction.reply({content:`Welcome to the Admin Panel/Dashboard! \n > Information: \n Punishments = Mute, Bans and Kicks`, 
						components: [new ActionRowBuilder()
									 .addComponents(
					new ButtonBuilder()
			.setCustomId('userPunishList')
			.setLabel('Punishments')
			.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
			.setCustomId('userRoleList')
			.setLabel('Roles')
			.setStyle(ButtonStyle.Success)					 .setDisabled(true),
										 
                                       new ButtonBuilder()
										 .setCustomId('backupList')
										 .setLabel('Backup')
										 .setStyle(ButtonStyle.Primary)					 .setDisabled(false), new ButtonBuilder()
										 .setCustomId('settingsDash')
										 .setLabel('Settings')
										 .setStyle(ButtonStyle.Secondary)					 .setDisabled(true),
                                       
				)
			], ephemeral: true
					})
					
    }

		   if(interaction.member.roles.cache.has(dataRole?.OwnerId)){
						await interaction.reply({content:`Welcome to the Admin Panel/Dashboard! \n > Information: \n Punishments = Mute, Bans, Kick & Warn \n Roles = Admin Roles \n `, 
						components: [new ActionRowBuilder()
									 .addComponents(
					new ButtonBuilder()
			.setCustomId('userPunishList')
			.setLabel('Punishments')
			.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
			.setCustomId('userRoleList')
			.setLabel('Roles')
			.setStyle(ButtonStyle.Success)					 .setDisabled(false),
										 new ButtonBuilder()
										  .setCustomId('backupList')
										  .setLabel('Backup')
										  .setStyle(ButtonStyle.Primary)					 .setDisabled(false), new ButtonBuilder()
										 .setCustomId('settingsDash')
										 .setLabel('Settings')
										 .setStyle(ButtonStyle.Secondary)					 .setDisabled(false),
                                                         
                                       
				)
			], ephemeral: true
					})
					
    }
						if(!interaction.member.roles.cache.has(dataRole?.AdminId) || !interaction.member.roles.cache.has(dataRole?.OwnerId)){
							const modelConfig = require("../../models/configureServer")
					const configData = await modelConfig.findOne({
								GuildId: interaction.guild.id
							})
							
				return interaction.reply({content: `Seems like you can't use the dashboard as your do not have the valid permissions... Maybe create your own space to have your own dashboard. Apply at <#${configData.appCH}>`, ephemeral: true})			
						} 



				}
					
				

        }
     