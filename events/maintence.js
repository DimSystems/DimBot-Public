const model = require("../models/space")
	const modelRole = require("../models/spaceRole")
const modelUser = require("../models/spaceUser")
const modelUserWarn = require("../models/spaceUserWarn")
const modelBackup = require( "../models/Backup");
const modelDev = require("../models/devSettings")

const client = require("../main.js")

const {CommandInteraction, ApplicationCommandType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType} = require("discord.js")

setInterval(async () => {
   	let checkMaintence = await modelDev.findOne({ isMaintence: true });
  
    if(checkMaintence){
      if(checkMaintence.maintenceDate < Date.now()){
        let x = await modelDev.findOneAndUpdate({ isMaintence: true }, { isMaintence: false });
        
        let channel1 = client.channels.cache.get("1168581226647527445");
        
        channel1.send("Maintenance has ended due to the the length of the maintenance has ended.")
        
      }
    }
}, 500)


client.on(Events.InteractionCreate, async (ine) => {
	
  	let checkMaintence = await modelDev.findOne({ isMaintence: true });
    
    if(ine.customId == "enableMaintenceMode"){
      
      if(checkMaintence){
        return ine.reply({
          content: "A maintence is already ongoing, please disable and re enable to change it.", ephemeral: true
        })
      } else {
        const modal = new ModalBuilder()
			.setCustomId('enableMaintenceModal')
			.setTitle('Enable maintence for dim');

		// Add components to modal

		// Create the text input components
		const spaceName = new TextInputBuilder()
			.setCustomId('maintencemsg')
		    // The label is the prompt the user sees for this input
			.setLabel("Reason of maintence")
		    // Short means only a single line of text
			.setPlaceholder("Testing bot commands...")
			.setMinLength(1)
			
			.setStyle(TextInputStyle.Paragraph);

		const deletechbool = new TextInputBuilder()
		.setCustomId('maintencedate')
		// The label is the prompt the user sees for this input
		.setLabel("Length of maintence")
		// Short means only a single line of text
		.setPlaceholder("[5m, 5h, 5d]")
        .setRequired(false)
		.setMinLength(2)
		.setStyle(TextInputStyle.Short);


		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(spaceName);
		const secActionRow = new ActionRowBuilder().addComponents(deletechbool);



		
		// Add inputs to the modal
		modal.addComponents(firstActionRow,secActionRow);

		// Show the modal to the user
		await ine.showModal(modal);
      }
      
    
      
    } else if(ine.customId == "disableMaintenceMode") {
      let checkMaintence3 = await modelDev.findOne({ isMaintence: false });
      
      if(checkMaintence3){
          return ine.reply({
          content: "Not enabled...", ephemeral: true
        })
      } else {
          let x = await modelDev.findOneAndUpdate({ isMaintence: true }, { isMaintence: false });
        ine.reply({
          content: "Disabled!", ephemeral: true
        })
      }
    }


})

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isModalSubmit()) return;

	if(interaction.customId == "enableMaintenceModal"){
      let maintencemsg = interaction.fields.getTextInputValue('maintencemsg');
      let maintencedate = interaction.fields.getTextInputValue('maintencedate');
      
      let ms = require("ms");
      
      let convertDate = Date.now()+ ms(maintencedate);
      
      
      let checkMaintence2 = await modelDev.find();
      
      if(checkMaintence2.length > 0){
        if(maintencedate){
           let x = await modelDev.findOneAndUpdate({ isMaintence: false }, { isMaintence: true, maintenceMsg: maintencemsg, maintenceDate: convertDate });
         interaction.reply({
          content: `Maintence has been set! It will go for <t:${parseInt(convertDate / 1000, 10)}:R>.`
        })
        } else {
           let x = await modelDev.findOneAndUpdate({ isMaintence: false }, { isMaintence: true, maintenceMsg: maintencemsg });
           interaction.reply({
          content: `Maintence has been set! It will go on forever until you disable it.`
        })
        }
        
      } else {
        if(maintencedate){
            new modelDev({
             isMaintence: true,
             maintenceMsg: maintencemsg,
             maintenceDate: convertDate
        }).save()
              interaction.reply({
          content: `Maintence has been set! It will go for <t:${parseInt(convertDate / 1000, 10)}:R>.`
        })
          
        } else {
            new modelDev({
             isMaintence: true,
             maintenceMsg: maintencemsg,
        }).save()
          
              interaction.reply({
          content: `Maintence has been set! It will go on forever until you disable it.`
        })
        }
      
        
    
      }
      
    }
})