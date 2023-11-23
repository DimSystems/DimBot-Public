const { Client, CommandInteraction, ApplicationCommandType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require("discord.js");
const Discord = require(`discord.js`)
const { glob } = require("glob");
const model = require("../models/space")
const modelRole = require("../models/spaceRole")
const modelConfig = require("../models/configureServer")
const modelAgree = require("../models/agreement")
const { promisify } = require("util");
const globPromise = promisify(glob);
const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");

const client = require("../main");

client.on(Events.InteractionCreate, async (i) => {

		let checkConfig = await modelConfig.findOne({ GuildId: i.guild.id });

	if(i.customId == "agreetos"){

	i.reply({content: "Thank you! You can continue using Dim now", ephemeral: true}).then((int) => {
			setInterval(() => {
				int.delete()
			}, 2500)
		})
		
        let checkAgree = await modelAgree.findOne({ GuildId: i.guild.id });
      
        if(!checkAgree){
          new modelAgree({
            GuildId: i.guild.id,
            Agreement: true
          }).save();
          
        } else {
          	await modelAgree.findOneAndUpdate({ GuildId: i.guild.id }, { Agreement: true });
        }
	
	} 

	if(i.customId == "disagreetos"){

	i.reply({content: "Ok.", ephemeral: true}).then((int) => {
		setInterval(() => {
			int.delete()
		}, 1500)
	})

		

	} 
	

	if(i.customId == "configureAdmin"){
		if(!checkConfig){
			return i.reply({content: "You need to configurate everything before configurating admin."})
		}
		
		const modal = new ModalBuilder()
			.setCustomId('configadm')
			.setTitle(`Configurate ${i.guild.name.substring(0, 14)} - Admin Channels`);

		// Add components to modal

		// Create the text input components
		const reportchannelglobal = new TextInputBuilder()
			.setCustomId('adminchannel')
			// The label is the prompt the user sees for this input
			.setLabel("Host Channel")
			// Short means only a single line of text
			.setPlaceholder("[Channel Id]")

			.setMinLength(0)
			.setMaxLength(88)

			.setStyle(TextInputStyle.Short);



		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(reportchannelglobal);
		// Add inputs to the modal
		modal.addComponents(firstActionRow);

		// Show the modal to the user
		await i.showModal(modal);
	}

	if(i.customId == 'configadm'){
		const HostCH = i.fields.getTextInputValue('adminchannel')

		let ch0 = i.guild.channels.cache.get(HostCH);

		if(ch0 == undefined){
			return i.reply({content: "Uh oh! Your configuration could not be set up due to this error: \n > Please use a proper channel id inside this guild", ephemeral: true});
		}

			

				i.reply({content: `We are done with the role stuff. Heres a full review on it \n **This is all of the channel configuration you saved.** \n > 1. Report Channel Global - <#${checkConfig.reportGlobalCH}> (${checkConfig.reportGlobalCH})  \n > 2. Report Channel Space - <#${checkConfig.reportSpaceCH}> (${checkConfig.reportSpaceCH}) \n > 3. Space Invitation Channel - <#${checkConfig.spaceAdCH}> (${checkConfig.spaceAdCH}) \n > 4. Space Application Recieve Channel - <#${checkConfig.appRecieveCH}> (${checkConfig.appRecieveCH}) \n > 5. Space Application Channnel - <#${checkConfig.appCH}> (${checkConfig.appCH}) 
		\n > 6. Report Role Global - <@&${checkConfig.reportGlobalRL}> (${checkConfig.reportGlobalRL}) \n > 7. Report Role Space - <@&${checkConfig.reportSpaceRL}> (${checkConfig.reportSpaceRL}) \n > 8. Host Channel - <#${HostCH}> (${HostCH})  \n Everything is done, systems will be sent through those channels! To reset, click the reset button below.`, ephemeral: true, components: [
						new ActionRowBuilder()		
						.addComponents(
							new ButtonBuilder()
					.setCustomId('restartConfigProcess')
					.setLabel('Reset and Restart')
					.setStyle(ButtonStyle.Danger),
						)
					]})

		let thread1 = await ch0.threads.create({
			name: 'Space Creation',
			autoArchiveDuration: 60,
			reason: 'Creating Spaces inside Guild',
		});

		let thread2 = await ch0.threads.create({
			name: 'Space removal',
			autoArchiveDuration: 60,
			reason: 'Removing Spaces inside Guild',
		});
		
		await modelConfig.findOneAndUpdate({ GuildId: i.guild.id }, { HostCH: HostCH, HostCHTH1: thread1.id, HostCHTH2: thread2.id });

		let threadChannel1 = client.channels.cache.get(thread1.id);
		let threadChannel2 = client.channels.cache.get(thread2.id);

			threadChannel1.send({ embeds: [
									new EmbedBuilder()
									.setTitle("Create a space/Edit a space")
									 .setDescription("Edit or create a space using the creation process.")

									.setColor("Random")

								] , components: [new ActionRowBuilder()
									.addComponents(
										new ButtonBuilder()
								.setCustomId('create')
								.setLabel('Create!')
								.setStyle(ButtonStyle.Primary)

									)
								]
							})

			threadChannel2.send({ embeds: [
									new EmbedBuilder()
									.setTitle("Delete a space")
									 .setDescription("This is a very dangerous move! Do the procedure if its necesscary!")

									.setColor("Random")

								] , components: [new ActionRowBuilder()
									.addComponents(
										new ButtonBuilder()
								.setCustomId('delete')
								.setLabel('Yes, delete!')
								.setStyle(ButtonStyle.Danger)

									)
								]
							})
	}

	if(i.customId == "restartConfigProcess"){
		if(checkConfig){
			let ch0 = await client.channels.cache.get(checkConfig.HostCH)
			const thread1 = ch0.threads.cache.find(x => x.id === checkConfig.HostCHTH1);
			if(thread1 !== null ) thread1.delete()
			const thread2 = ch0.threads.cache.find(x => x.id === checkConfig.HostCHTH2);
			if(thread2 !== null) thread2.delete()
			let ch1 = await client.channels.cache.get(checkConfig.appCH);
			let msg = ch1.messages.fetch(checkConfig.appCHID).then(msg =>  msg.delete());
			
			
			await modelConfig.findOne({ GuildId: i.guild.id }).deleteOne().exec();
		} else {
			return i.reply({ content: "Reset is already completed so uh stop pressing the button >:(", ephemeral: true });
		}
			

		const modal = new ModalBuilder()
			.setCustomId('configchmd')
			.setTitle(`Configurate ${i.guild.name.substring(0, 18)} - Channels`);

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
		await i.showModal(modal);
	}

	if(i.customId == "configchmd1"){
		const reportglobalrl = i.fields.getTextInputValue('reportGlobalRL')
		const reportspacerl = i.fields.getTextInputValue('reportSpaceRL')

	let role0 = i.guild.roles.cache.get(reportglobalrl);
		let role1 = i.guild.roles.cache.get(reportspacerl);

		if(role0 == undefined || role1 == undefined){
			return i.reply({content: "Uh oh! Your configuration could not be set up due to this error: \n > Please use a proper role id inside this guild", ephemeral: true});
		}


		await modelConfig.findOneAndUpdate({ GuildId: i.guild.id }, { reportGlobalRL: reportglobalrl, reportSpaceRL: reportspacerl })

		i.reply({content: `We are done with the role stuff. Heres a full review on it \n **This is all of the channel configuration you saved.** \n > 1. Report Channel Global - <#${checkConfig.reportGlobalCH}> (${checkConfig.reportGlobalCH})  \n > 2. Report Channel Space - <#${checkConfig.reportSpaceCH}> (${checkConfig.reportSpaceCH}) \n > 3. Space Invitation Channel - <#${checkConfig.spaceAdCH}> (${checkConfig.spaceAdCH}) \n > 4. Space Application Recieve Channel - <#${checkConfig.appRecieveCH}> (${checkConfig.appRecieveCH}) \n > 5. Space Application Channnel - <#${checkConfig.appCH}> (${checkConfig.appCH}) 
\n > 6. Report Role Global - <@&${reportglobalrl}> (${reportglobalrl}) \n > 7. Report Role Global - <@&${reportspacerl}> (${reportspacerl}) \n Click continue to finish and if you wish to reset and restart, click the button`, ephemeral: true, components: [
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

		const channel = client.channels.cache.get(checkConfig.appCH);

		channel.send({
				 embeds: [
					new EmbedBuilder()
					.setTitle("Apply to create a space")
					 .setDescription("You will be given a model of what you need to get started!")
					.setColor("Random")

				] , components: [new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
				.setCustomId('createApplication')
				.setLabel('Start!')
				.setStyle(ButtonStyle.Primary)

					)
				]
			}).then(async (msg) => {
			await modelConfig.findOneAndUpdate({ GuildId: i.guild.id }, { appCHID: msg.id });
			})
		
		

	}
	
	if(i.customId == "configchmd"){
	const reportglobalch = i.fields.getTextInputValue('reportglobalch');
	const reportspacech = i.fields.getTextInputValue('reportspacechannel');
	const spaceadch = i.fields.getTextInputValue('spaceadchannel');	
	const apprecievech = i.fields.getTextInputValue('apprecievechannel');
	const appch = i.fields.getTextInputValue('appch');

		

			const channel0 = i.guild.channels.cache.get(reportglobalch);
			const channel1 = i.guild.channels.cache.get(reportspacech);
			const channel2 = i.guild.channels.cache.get(spaceadch);
			const channel3 = i.guild.channels.cache.get(apprecievech);
			const channel4 = i.guild.channels.cache.get(appch);

			if(channel0 == undefined || channel1 == undefined || channel2 == undefined || channel2 == undefined || channel3 == undefined || channel4 == undefined){
				return i.reply({content: "Uh oh! Your configuration could not be set up due to this error: \n > Please use a proper channel id inside the guild", ephemeral: true})
			}

	if(checkConfig == null){
		new modelConfig({
       		GuildId: i.guild.id,
			reportGlobalCH: reportglobalch,
			reportSpaceCH: reportspacech,
			spaceAdCH: spaceadch,
			appRecieveCH: apprecievech,
			appCH: appch
        }).save()

		i.reply({content: `We are done with the channel stuff. Heres a full review on it \n **This is all of the channel configuration you saved.** \n > 1. Report Channel Global - <#${reportglobalch}> (${reportglobalch})  \n > 2. Report Channel Space - <#${reportspacech}> (${reportspacech}) \n > 3. Space Invitation Channel - <#${spaceadch}> (${spaceadch}) \n > 4. Space Application Recieve Channel - <#${apprecievech}> (${apprecievech}) \n > 5. Space Application Channnel - <#${appch}> (${appch}) \n The only one we have left are the *roles*. Click on the following buttons to continue or edit your channel configuration. \n Note: All systems will be sent and will be working when you finish the configuration process`, ephemeral: true, components: [
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

		
		
	} else {
		await modelConfig.findOneAndUpdate({ GuildId: i.guild.id }, { reportGlobalCH: reportglobalch,
			reportSpaceCH: reportspacech,
			spaceAdCH: spaceadch,
			appRecieveCH: apprecievech,
			appCH: appch })

		i.reply({content: `We are done with the channel stuff. Heres a full review on it \n **This is all of the channel configuration you saved.** \n > 1. Report Channel Global - <#${reportglobalch}> (${reportglobalch})  \n > 2. Report Channel Space - <#${reportspacech}> (${reportspacech}) \n > 3. Space Invitation Channel - <#${spaceadch}> (${spaceadch}) \n > 4. Space Application Recieve Channel - <#${apprecievech}> (${apprecievech}) \n > 5. Space Application Channnel - <#${appch}> (${appch}) \n The only one we have left are the *roles*. Click on the following buttons to continue or edit your channel configuration. \n Note: All systems will be sent and will be working when you finish the configuration process`, ephemeral: true, components: [
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
		
	}	

		
		
	} 
	if(i.customId == "configrlmd"){
		
	}	
			if(i.customId == "editConfig1"){
				
					const modal = new ModalBuilder()
			.setCustomId('configchmd')
			.setTitle(`Configurate ${i.guild.name.substring(0, 18)} - Channels`);

		// Add components to modal

		// Create the text input components
		const reportchannelglobal = new TextInputBuilder()
			.setCustomId('reportglobalch')
		    // The label is the prompt the user sees for this input
			.setLabel("Report Global Channel id")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
			.setValue(checkConfig.reportGlobalCH)
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		

		const reportchannelspace = new TextInputBuilder()
		.setCustomId('reportspacechannel')
		    // The label is the prompt the user sees for this input
			.setLabel("Report Space Channel id")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
			.setValue(checkConfig.reportSpaceCH)
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		const spaceAdCh = new TextInputBuilder()
		.setCustomId('spaceadchannel')
		    // The label is the prompt the user sees for this input
			.setLabel("Space Invitation Channel")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
				.setValue(checkConfig.spaceAdCH)
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		const apprecievech = new TextInputBuilder()
		.setCustomId('apprecievechannel')
		    // The label is the prompt the user sees for this input
			.setLabel("Space App Recieve Channel")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
				.setValue(checkConfig.appRecieveCH)
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		const appch = new TextInputBuilder()
		.setCustomId('appch')
		    // The label is the prompt the user sees for this input
			.setLabel("Space App Channel")
		    // Short means only a single line of text
			.setPlaceholder("[Channel Id]")
			.setValue(checkConfig.appCH)
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
		await i.showModal(modal);
			}

else if(i.customId == "continueConfig1"){
	const modal = new ModalBuilder()
		.setCustomId('configchmd1')
		.setTitle(`Configurate ${i.guild.name.substring(0, 24)} - Roles`);

	const reportrolespace = new TextInputBuilder()
	.setCustomId('reportSpaceRL')
		// The label is the prompt the user sees for this input
		.setLabel("Report Space Role id")
		// Short means only a single line of text
		.setPlaceholder("[Role Id]")

		.setMinLength(0)
		.setMaxLength(88)

		.setStyle(TextInputStyle.Short);

	const reportroleglobal = new TextInputBuilder()
	.setCustomId('reportGlobalRL')
		// The label is the prompt the user sees for this input
		.setLabel("Space Global Role ID")
		// Short means only a single line of text
		.setPlaceholder("[Channel Id]")

		.setMinLength(0)
		.setMaxLength(88)

		.setStyle(TextInputStyle.Short);


	// An action row only holds one text input,
	// so you need one action row per text input.
	const firstActionRow = new ActionRowBuilder().addComponents(reportrolespace);
	const secondActionRow = new ActionRowBuilder().addComponents(reportroleglobal);
	

	// Add inputs to the modal
	modal.addComponents(firstActionRow, secondActionRow);

	// Show the modal to the user
	await i.showModal(modal);
}	
	
})