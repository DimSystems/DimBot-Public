const client = require("../main");
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ButtonBuilder, ButtonStyle, EmbedBuilder,  } = require("discord.js")
const model = require("../models/space")
const { execSync } = require("child_process")

client.on(Events.InteractionCreate, async (interaction) => {
	if(interaction.customId == "createApplication"){
		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('createAppModal')
			.setTitle('Apply for your space');

		// Add components to modal

		// Create the text input components
		const roleId = new TextInputBuilder()
			.setCustomId('roleId')
		    // The label is the prompt the user sees for this input
			.setLabel("Username & Email")
		    // Short means only a single line of text
			.setPlaceholder("@mee69 & mee69@aprex.tech")
			
			.setMinLength(0)
			.setMaxLength(48)
			
			.setStyle(TextInputStyle.Short);

		const spaceName = new TextInputBuilder()
			.setCustomId('spaceName')
			.setLabel("Name of your Space")
			.setMinLength(2)
			.setMaxLength(100)
					.setPlaceholder("DIM Spaces")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);


		const spaceDescription = new TextInputBuilder()
			.setCustomId('spaceDescription')
			.setLabel("Description of your Space")
			.setMinLength(15)
			.setMaxLength(800)
			.setPlaceholder("Hmm 15 required")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		const spaceImg = new TextInputBuilder()
			.setCustomId('spaceImg')
			.setLabel("Space Icon [Image URL]")
			.setMinLength(7)
			.setMaxLength(800)
			.setPlaceholder("https://example.com/example.png [512x512 px recommanded]")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

		const WelcomeID = new TextInputBuilder()
			.setCustomId('plans')
			.setLabel("Why are you applying & Additonal Info")
			.setMinLength(6)
			.setMaxLength(500)
			.setPlaceholder("bla blah")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);
		

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

	if(interaction.customId == "createAppModal"){

			const roleId = interaction.fields.getTextInputValue('roleId');
	const spaceName = interaction.fields.getTextInputValue('spaceName');
		const spaceDescription = interaction.fields.getTextInputValue('spaceDescription');
		const spaceImg = interaction.fields.getTextInputValue('spaceImg');
		const WelcomeID = interaction.fields.getTextInputValue('plans');
      
      	if(!spaceImg.includes("https://")){
			return interaction.reply({content: "Invalid Image URL", ephemeral: true})
		}

const modelConfig = require("../models/configureServer")

		const configData = await modelConfig.findOne({
			GuildId: interaction.guild.id
		})
		
			const channel = client.channels.cache.get(configData.appRecieveCH);

		if(channel == undefined){
			return interaction.reply("Invalid channel configured! Ask whoever configured this server for help.")
		}

		channel.send({content: `<@&${configData.reportGlobalRL}> \n New application from ${interaction.user.username}! \n User & Mail: \`\`\`${roleId}\`\`\` \n Space Name: \`\`\`${spaceName}\`\`\` \n Space Description: \`\`\`${spaceDescription}\`\`\` \n Space Icons: \`\`\`${spaceImg}\`\`\` \n Info: \`\`\`${WelcomeID}\`\`\``})

		channel.send("Contact the user after decision has been made!")

		interaction.reply({content: "Your application has been sent! Please be patient for a response via dms or mail!", ephemeral: true})
	}

})