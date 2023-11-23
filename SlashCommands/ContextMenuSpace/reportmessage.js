const { Client, CommandInteraction, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events } = require("discord.js");
const Discord = require(`discord.js`)
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
module.exports = {
    name: "Report a message!",
    // description: "Has this message broken some rules from aa space or TOS. Report it.",
   type: ApplicationCommandType.Message,
	ephemeralCmd: true,
	modalCmd: true,
   // devOnly: true,
    
    run: async (client, interaction, args) => {

		if(interaction.targetMessage.author.id == "1150482920323170395"){
			return interaction.reply({
				content: "What did i do???"
			})
		}


const modal = new ModalBuilder()
			.setCustomId('reportMsg')
			.setTitle(`Report this message by ${interaction.targetMessage.author.username}.`);

		// Add components to modal

		// Create the text input components
		const reporttype = new TextInputBuilder()
			.setCustomId('reporttype')
		    // The label is the prompt the user sees for this input
			.setLabel("Report Type")
		    // Short means only a single line of text
			.setPlaceholder("[Dim, Global or Name of Space]")
			
			.setMinLength(0)
			.setMaxLength(88)
			
			.setStyle(TextInputStyle.Short);

		

		const reportreason = new TextInputBuilder()
			.setCustomId('reportReason')
			.setLabel("Reason of Report")
			.setMinLength(15)
			.setMaxLength(800)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph)

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(reporttype);
		const secondActionRow = new ActionRowBuilder().addComponents(reportreason);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);

		client.on(Events.InteractionCreate, async (i) => {
	if (!i.isModalSubmit()) return;

	if(i.customId == "reportMsg"){
	const reportType = i.fields.getTextInputValue('reporttype');
			const reportReason = i.fields.getTextInputValue('reportReason');

		const model = require("../../models/space")
        	const modelConfig = require("../../models/configureServer")

		  
		const data = await model.findOne({
			spaceName: reportType,
		})

		const configData = await modelConfig.findOne({
			GuildId: i.guild.id
		})

		

		var reportTypeCap = reportType.toUpperCase() 

		if(ReportTypeCap.includes("DIM")){
			const { username } = interaction.targetUser;


				const channel = client.channels.cache.get("1164832799501582407");

			channel.send(`:bangbang: ***New Report <@&1096120032645369968>*** :bangbang:  \n Interaction: Message \n Report Type: DIM GLOBAL \n Report Reason \`\`\`${reportReason}\`\`\` \n Report Creator: \`\`\`${interaction.user.username}\`\`\` \n User that has been reported: \`\`\`${interaction.targetMessage.author.username}\`\`\` \n Message Content: \`\`\`${content}\`\`\` \n Message Id: \`\`\`${interaction.targetMessage.id}\`\`\` \n - Check user activity and see if it has violated any rules.`).then(async () => {
				await i.reply({content: `Your report to ${interaction.targetMessage.author.username} has been send successfully.`, ephemeral: true})
			})


		}

		if(reportTypeCap.includes("GLOBAL")){

			    const { content } = interaction.targetMessage;

		
			const channel = client.channels.cache.get(configData.reportGlobalCH);

			channel.send(`:bangbang: ***New Report <@&${configData.reportGlobalRL}>*** :bangbang:  \n Interaction: Message \n Report Type: GLOBAL \n Report Reason \`\`\`${reportReason}\`\`\` \n Report Creator: \`\`\`${interaction.user.username}\`\`\` \n User that has been reported: \`\`\`${interaction.targetMessage.author.username}\`\`\` \n Message Content: \`\`\`${content}\`\`\` \n Message Id: \`\`\`${interaction.targetMessage.id}\`\`\` \n - Check user activity and see if it has violated any rules.`).then(async () => {
				await i.reply({content: `Your report to ${interaction.targetMessage.author.username} has been send successfully.`, ephemeral: true})
			})
			
		} else {
			if(!data){
				return i.reply({content: `${reportType} is a invalid space name. All space names are cap sensitive!`, ephemeral: true });
			} else {
				  const { content } = interaction.targetMessage;
				
				const channel = client.channels.cache.get(configData.reportSpaceCH);
				
					channel.send(`:bangbang: ***New Report <@&${configData.reportSpaceRL}>*** :bangbang:  \n Interaction: Message \n Report Type: Spaces [${data.spaceName}] \n Report Reason \`\`\`${reportReason}\`\`\` \n Report Creator: \`\`\`${interaction.user.username}\`\`\` \n User that has been reported: \`\`\`${interaction.targetMessage.author.username}\`\`\` \n Message Content: \`\`\`${content}\`\`\` \n Message Id: \`\`\`${interaction.targetMessage.id}\`\`\` \n - Check user activity and see if it has violated any rules.`).then(async () => {
				await i.reply({content: `Your report to ${interaction.targetMessage.author.username} has been send successfully.`, ephemeral: true})
			})
			}
		}

		
	}
		})


		
        

		
        }
      }
    