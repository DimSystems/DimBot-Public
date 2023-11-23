const client = require("../main");
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const model = require("../models/space")
const { execSync } = require("child_process")

client.on(Events.InteractionCreate, async (interaction) => {
	if(interaction.customId == "create"){
		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('createModal')
			.setTitle('Create a space');

		// Add components to modal

		// Create the text input components
		const roleId = new TextInputBuilder()
			.setCustomId('roleId')
		    // The label is the prompt the user sees for this input
			.setLabel("Role Id or Name")
		    // Short means only a single line of text
			.setPlaceholder("[ROLE ID OR NAME]")
			
			.setMinLength(1)
			.setMaxLength(48)
			
			.setStyle(TextInputStyle.Short);

		const spaceName = new TextInputBuilder()
			.setCustomId('spaceName')
			.setLabel("Name of Space or ID")
			.setPlaceholder("[CATAGORY ID OR NAME]")
			.setMinLength(1)
			.setMaxLength(100)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

		const spaceDescription = new TextInputBuilder()
			.setCustomId('spaceDescription')
			.setLabel("Description of Space")
			.setPlaceholder("We are the coolest so join us! :)")
			.setMinLength(15)
			.setMaxLength(800)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		const spaceImg = new TextInputBuilder()
			.setCustomId('spaceImg')
			.setLabel("Image URL")
			.setPlaceholder("https://imagesource.com/")
			.setMinLength(7)
			.setMaxLength(800)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

		const WelcomeID = new TextInputBuilder()
			.setCustomId('welcomeID')
			.setLabel("Welcome Channel Name or ID")
			.setPlaceholder("[CATAGORY ID OR NAME]")
			.setMinLength(1)
			.setMaxLength(48)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(roleId);
		const secondActionRow = new ActionRowBuilder().addComponents(spaceName);
		const thirdActionRow = new ActionRowBuilder().addComponents(spaceDescription);

			const fouthActionRow = new ActionRowBuilder().addComponents(spaceImg);


		const fifthActionRow = new ActionRowBuilder().addComponents(WelcomeID);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fouthActionRow, fifthActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
	}

	
})



client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isModalSubmit()) return;

	if(interaction.customId == "createModal"){
			let roleId = interaction.fields.getTextInputValue('roleId');
	const spaceName = interaction.fields.getTextInputValue('spaceName');
		const spaceDescription = interaction.fields.getTextInputValue('spaceDescription');
		const spaceImg = interaction.fields.getTextInputValue('spaceImg');
		let WelcomeID = interaction.fields.getTextInputValue('welcomeID');

		let roleCheck = interaction.guild.roles.cache.get(roleId);

		if(roleCheck == null){
			let roleCheck2 = interaction.guild.roles.cache.find(role =>  role.name == roleId);
			if(roleCheck2 == null){
				return interaction.reply({content: "Role doesn't exist in the server!", ephemeral: true})
			} else {
				roleId = roleCheck2.id;
			}
			 
		}

		if(interaction.guild.members.cache.get("1150482920323170395").roles.highest.position < interaction.guild.roles.cache.get(roleId).position){
			return interaction.reply({
				content: "I can not do anything role related if my role hireachy is lower than the role used.",
				ephemeral: true
			})
		}

		if(!spaceImg.includes("https://")){
			return interaction.reply({content: "Invalid Image URL", ephemeral: true})
		}

		


			const modelConfig = require("../models/configureServer")


		const configData = await modelConfig.findOne({
			GuildId: interaction.guild.id
		})

		// if(!configData.){
		// 		throw new Error(`All channel config fields must have a value!`);
		// 	}

		let checkName = await model.findOne({ spaceName: spaceName  });

		if(checkName && checkName.roleId !== roleId ){
			return interaction.reply({content:"A pre existing space exists with the same name! Please choose a different one!", ephemeral: true})
		}

		const channel = client.channels.cache.get(configData.spaceAdCH);

		if(channel == undefined){
			return interaction.reply({content:"Invalid channel configured! Please reconfigurate.", ephemeral: true})
		}

		

		const catagory = interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == spaceName) || interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.id == spaceName);
		


		if(catagory == undefined){
			return interaction.reply({content:"Space names must equal to a valid catagory in the server. Please try again.", ephemeral: true})
		}

		

		let welcomeCheck = catagory.children.cache.get(WelcomeID);

		if(welcomeCheck == null){
			let welcomeCheck2 = catagory.children.cache.find(channel => channel.type == ChannelType.GuildText && channel.name == WelcomeID);
			if(welcomeCheck2 == null){
				return interaction.reply({content:"Invalid Welcome Channel! Make sure the the channel id or name exists inside the catagory or exists in the server!", ephemeral: true})
			} else {
				WelcomeID = welcomeCheck2.id;
			}
				
		}

		channel.send({embeds: [
			new EmbedBuilder()
	 			.setTitle(`${spaceName}`)
			.setAuthor({ name: spaceName, iconURL: spaceImg})
				.setDescription(`${spaceDescription}`)
			.setThumbnail(`${spaceImg}`)
				.setColor("Random")
			.setTimestamp()
			.setFooter({ text: `DIM Spaces V3 - ${spaceName}`, iconURL: spaceImg })
				
		], components: [
			new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
			.setCustomId(`join-${roleId}`)
			.setLabel(`Join ${spaceName}`)
			.setStyle(ButtonStyle.Secondary)
						
				)
			]
		}).then((msg) => {

			model.findOne({ roleId: roleId, GuildId: interaction.guild.id }, async(err, data) => {
      if(!data){
        new model({
       		roleId: roleId,
			spaceName: spaceName,
			SpaceDescription: spaceDescription,
			MessageId: msg.id,
			ImageURL: spaceImg,
			WelcomeChannel: WelcomeID,
			CatagoryId: catagory.id,
			GuildId: interaction.guild.id
        }).save()

		  interaction.reply({content: "Created!", ephemeral: true})
	  }
				if(data){
					  let x = await model.findOneAndUpdate({ roleId: roleId }, {spaceName: spaceName, spaceName: spaceName, SpaceDescription: spaceDescription, MessageId: msg.id, ImageURL: spaceImg,
			WelcomeChannel: WelcomeID, CatagoryId: catagory.id, GuildId: interaction.guild.id })
					  interaction.reply({content: "Edited Space.", ephemeral: true})
				}
		})

		

		
	})
				 }
	
})