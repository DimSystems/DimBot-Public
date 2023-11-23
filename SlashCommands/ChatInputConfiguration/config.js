const { Client, CommandInteraction, ApplicationCommandType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const Discord = require(`discord.js`)
const { glob } = require("glob");
const model = require("../../models/space")
const modelRole = require("../../models/spaceRole")
const modelConfig = require("../../models/configureServer")
const { promisify } = require("util");
const globPromise = promisify(glob);
const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
module.exports = {
    name: "configurate",
    description: "Configurate this server to make this bot usable.",
	type: ApplicationCommandType.ChatInput,
    devOnly: false,
	ephemeralCmd: true,
	modalCmd: true,
    
    run: async (client, interaction, args) => {
      
      if(!interaction.member.permissions.has("ManageGuild") && !interaction.member.permissions.has("Administrator")){
        return interaction.reply({
          content: "Configuration is for the the cool admins, not you!", ephemeral: true
        })
      }

		let checkConfig = await modelConfig.findOne({ GuildId: interaction.guild.id });

		
		if(!checkConfig){
			const modal = new ModalBuilder()
			.setCustomId('configchmd')
			.setTitle(`Configurate ${interaction.guild.name.substring(0, 18)} - Channels`);

		// Add components to modal

		// Create the text input components
		const reportchannelglobal = new TextInputBuilder()
			.setCustomId('reportglobalch')
		    // The label is the prompt the user sees for this input
			.setLabel("Report Global Channel id")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
			
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		

		const reportchannelspace = new TextInputBuilder()
		.setCustomId('reportspacechannel')
		    // The label is the prompt the user sees for this input
			.setLabel("Report Space Channel id")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
			
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		const spaceAdCh = new TextInputBuilder()
		.setCustomId('spaceadchannel')
		    // The label is the prompt the user sees for this input
			.setLabel("Space Invitation Channel")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
			
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		const apprecievech = new TextInputBuilder()
		.setCustomId('apprecievechannel')
		    // The label is the prompt the user sees for this input
			.setLabel("Space App Recieve Channel")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
			
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		const appch = new TextInputBuilder()
		.setCustomId('appch')
		    // The label is the prompt the user sees for this input
			.setLabel("Space App Channel")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
			
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(reportchannelglobal);
		const secondActionRow = new ActionRowBuilder().addComponents(reportchannelspace);
		const tar = new ActionRowBuilder().addComponents(spaceAdCh);
		const thar = new ActionRowBuilder().addComponents(apprecievech);
		const far = new ActionRowBuilder().addComponents(appch);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow, tar, thar, far);

		// Show the modal to the user
		await interaction.showModal(modal);
		} else if(checkConfig && !checkConfig.reportGlobalRL && !checkConfig.reportSpaceRL){
			interaction.reply({content: `Lets go back to where we were last off... \n **This is all of the channel configuration you saved.** \n > 1. Report Channel Global - <#${checkConfig.reportGlobalCH}> (${checkConfig.reportGlobalCH})  \n > 2. Report Channel Space - <#${checkConfig.reportSpaceCH}> (${checkConfig.reportSpaceCH}) \n > 3. Space Invitation Channel - <#${checkConfig.spaceAdCH}> (${checkConfig.spaceAdCH}) \n > 4. Space Application Recieve Channel - <#${checkConfig.appRecieveCH}> (${checkConfig.appRecieveCH}) \n > 5. Space Application Channnel - <#${checkConfig.appCH}> (${checkConfig.appCH}) \n The only one we have left are the *roles*. Click on the following buttons to continue or edit your channel configuration. \n Note: All systems will be sent and will be working when you finish the configuration process`, ephemeral: true, components: [
				new ActionRowBuilder()		
				.addComponents(
					new ButtonBuilder()
			.setCustomId('editConfig1')
			.setLabel('Edit Config Channels')
			.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
			.setCustomId('continueConfig1')
			.setLabel('Continue')
			.setStyle(ButtonStyle.Success),
				)
			]})
		} else if(checkConfig && !checkConfig.HostCH){
				interaction.reply({content: `We are done with the role stuff. Heres a full review on it \n **This is all of the channel configuration you saved.** \n > 1. Report Channel Global - <#${checkConfig.reportGlobalCH}> (${checkConfig.reportGlobalCH})  \n > 2. Report Channel Space - <#${checkConfig.reportSpaceCH}> (${checkConfig.reportSpaceCH}) \n > 3. Space Invitation Channel - <#${checkConfig.spaceAdCH}> (${checkConfig.spaceAdCH}) \n > 4. Space Application Recieve Channel - <#${checkConfig.appRecieveCH}> (${checkConfig.appRecieveCH}) \n > 5. Space Application Channnel - <#${checkConfig.appCH}> (${checkConfig.appCH}) 
			\n > 6. Report Role Global - <@&${checkConfig.reportGlobalRL}> (${checkConfig.reportGlobalRL}) \n > 7. Report Role Global - <@&${checkConfig.reportSpaceRL}> (${checkConfig.reportSpaceRL}) \n Click continue to finish and if you wish to reset and restart, click the button`, ephemeral: true, components: [
							new ActionRowBuilder()		
							.addComponents(
								new ButtonBuilder()
						.setCustomId('restartConfigProcess')
						.setLabel('Reset and Restart')
						.setStyle(ButtonStyle.Danger),
								new ButtonBuilder()
								.setCustomId('configureAdmin')
								.setLabel('Continue')
								.setStyle(ButtonStyle.Success),
							)
						]})

		} else {
			interaction.reply({content: `We are done with the role stuff. Heres a full review on it \n **This is all of the channel configuration you saved.** \n > 1. Report Channel Global - <#${checkConfig.reportGlobalCH}> (${checkConfig.reportGlobalCH})  \n > 2. Report Channel Space - <#${checkConfig.reportSpaceCH}> (${checkConfig.reportSpaceCH}) \n > 3. Space Invitation Channel - <#${checkConfig.spaceAdCH}> (${checkConfig.spaceAdCH}) \n > 4. Space Application Recieve Channel - <#${checkConfig.appRecieveCH}> (${checkConfig.appRecieveCH}) \n > 5. Space Application Channnel - <#${checkConfig.appCH}> (${checkConfig.appCH}) 
							 \n > 6. Report Role Global - <@&${checkConfig.reportGlobalRL}> (${checkConfig.reportGlobalRL}) \n > 7. Report Role Space - <@&${checkConfig.reportSpaceRL}> (${checkConfig.reportSpaceRL}) \n > 8. Host Channel - <#${checkConfig.HostCH}> (${checkConfig.HostCH})  \n Everything is done, systems will be sent through those channels! To reset, click the reset button below.`, ephemeral: true, components: [
											 new ActionRowBuilder()		
											 .addComponents(
												 new ButtonBuilder()
										 .setCustomId('restartConfigProcess')
										 .setLabel('Reset and Restart')
										 .setStyle(ButtonStyle.Danger),
											 )
										 ]})
		}

		
		
	}
}