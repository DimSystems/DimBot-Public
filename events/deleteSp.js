const client = require("../main");
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const model = require("../models/space")
const model2 = require("../models/spaceUser")
const model3 = require("../models/spaceRole")
const modelBackup = require( "../models/Backup");
const backup = require("dim-backup")

const { execSync } = require("child_process")

client.on(Events.InteractionCreate, async (interaction) => {
	if(interaction.customId == "delete"){
		const modal = new ModalBuilder()
			.setCustomId('deleteModal')
			.setTitle('Delete a space!');

		// Add components to modal

		// Create the text input components
		const spaceName = new TextInputBuilder()
			.setCustomId('spaceName')
		    // The label is the prompt the user sees for this input
			.setLabel("Space Name or ID")
		    // Short means only a single line of text
			.setPlaceholder("[CATAGORY NAME OR ID]")
			
			.setMinLength(1)
			.setMaxLength(100)
			
			.setStyle(TextInputStyle.Short);

		const deletechbool = new TextInputBuilder()
		.setCustomId('deletebool')
		// The label is the prompt the user sees for this input
		.setLabel("Delete Catagories and Roles?")
		// Short means only a single line of text
		.setPlaceholder("[true or false]")

		.setMinLength(4)
		.setMaxLength(5)

		.setStyle(TextInputStyle.Short);


		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(spaceName);
		const secActionRow = new ActionRowBuilder().addComponents(deletechbool);



		
		// Add inputs to the modal
		modal.addComponents(firstActionRow,secActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
	}
})

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isModalSubmit()) return;

	if(interaction.customId == "deleteModal"){
		const spaceName = interaction.fields.getTextInputValue('spaceName');
		let boolDelete = interaction.fields.getTextInputValue('deletebool') || "true";

		const catagory = interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == spaceName)  || interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.id == spaceName)

		let spaceData = await model.findOne({
					CatagoryId: catagory.id
			})

		const modelConfig = require("../models/configureServer")
		const configData = await modelConfig.findOne({
					GuildId: interaction.guild.id
				})
		
		let channel2 = client.channels.cache.get(configData.spaceAdCH);

		channel2.messages.delete(spaceData.MessageId);

		if(catagory == undefined){
			return interaction.reply("I could not delete the space as this space does not exist.")
		}

		model.find({
			spaceName: spaceName
		}).deleteOne().exec();

		model2.find({
			CatagoryId: catagory.id
		}).deleteOne().exec();

		model3.find({
			SpaceBanId: catagory.id
		}).deleteMany().exec();
      
         let findBackups = modelBackup.find({
          CatagoryId: data.CatagoryId
        })    
        
        findBackups.forEach(async (backupdb) => {
          backup.setStorageFolder("./backup/")
          await backup.remove(backupdb.BackupId);
        });
            
        modelBackup.find({
          CatagoryId: data.CatagoryId
        }).deleteMany().exec();   

		interaction.reply({content:`${spaceName} has been deleted and everything has been wiped!`, ephemeral: true}).then(() => {

			if(boolDelete == "true"){
				catagory.children.cache.forEach(channel => channel.delete());

				catagory.delete();

					client.guilds.cache.get(interaction.guild.id).roles.cache.find( role => role.name == `${spaceName} - Space - Member`).delete();

				client.guilds.cache.get(interaction.guild.id).roles.cache.find( role => role.name == `${spaceName} - Space - Admin`).delete();

				client.guilds.cache.get(interaction.guild.id).roles.cache.find( role => role.name == `${spaceName} - Space - Owner`).delete();

			} else {
				return;
			}
			
			
		})

		
		

		

		
		
	}
											 })