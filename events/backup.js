 const model = require("../models/space")
	const modelRole = require("../models/spaceRole")
const modelUser = require("../models/spaceUser")
const modelUserWarn = require("../models/spaceUserWarn")
const modelBackup = require( "../models/Backup");

const backup = require("dim-backup")
backup.setStorageFolder("./backup/")

const client = require("../main.js")

const {CommandInteraction, ApplicationCommandType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType} = require("discord.js")


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

if(ine.customId == "backupselect"){
	dataBackup.forEach((db) => {
		if(ine.values == `BackUP-${db.BackupId}`){
			ine.reply({content: `What do you want to do with your backup (${db.id})?`, components: [
						   new ActionRowBuilder()
							   .addComponents(
								   new ButtonBuilder()
						   .setCustomId(`loadBackup-${db.BackupId}`)
						   .setLabel('Load the backup')
						   .setStyle(ButtonStyle.Primary),
						 new ButtonBuilder()
						 .setCustomId(`removeBackup-${db.BackupId}`)
						 .setLabel('Remove the backup')
						 .setStyle(ButtonStyle.Danger),
								   )
					   ], ephemeral: true})
		}
	})
} 
		dataBackup.forEach(async (db) => {
			if(ine.customId == `loadBackup-${db.BackupId}`){

				ine.reply({
					content: "Please be patient while your backup is getting loaded!"
				})

              // For subscriptions/premium, no max limit.
              
				await backup.loadSpace(db.BackupData, ine.guild, {
					maxMessagesPerChannel: 100
				}).then(async () => {

					let catagory1 = await ine.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.id == data.CatagoryId) 

					catagory1.setName("[TEMPORARY]").then(async  () => {
						let catagory2 = await ine.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == data.spaceName) 

						let findWelcomeName = catagory1.children.cache.find(channel => channel.id == data.WelcomeChannel).name;

						console.log(findWelcomeName);

							let welcomeName = catagory2.children.cache.find(channel => channel.name == findWelcomeName).id;

                            const dataBackup2 = await modelBackup.find({ CatagoryId: data.CatagoryId });	
                      
                     dataBackup2.forEach(async (db) => {
                       	await modelBackup.findOneAndUpdate({ CatagoryId: data.CatagoryId }, { CatagoryId: catagory2.id });
                     });
                      
							await model.findOneAndUpdate({ CatagoryId: data.CatagoryId }, { CatagoryId: catagory2.id, WelcomeChannel: welcomeName  })	

						await modelUser.findOneAndUpdate({ SpaceBanId: data.CatagoryId }, { SpaceBanId: catagory2.id })	

						await modelUserWarn.findOneAndUpdate({ SpaceId: data.CatagoryId }, { SpaceId: catagory2.id })	

						await modelRole.findOneAndUpdate({ CatagoryId: data.CatagoryId }, { CatagoryId: catagory2.id })	
						
							catagory1.children.cache.forEach(channel => channel.delete());

							catagory1.delete();
                      
                      
							catagory2.children.cache.find(channel => channel.name == findWelcomeName).send(`Backup ${db.BackupName} (${db.BackupId}) has been loaded. No worries, everything has been moved so that it's seemless. Hope thats all you need.`)

					})

				

				
				})
			} else if(ine.customId == `removeBackup-${db.BackupId}`){
              
             const dataBackup2 = await modelBackup.findOne({ BackupId: db.BackupId }).deleteOne().exec();
                
                ine.reply({
content: "Backup has been removed!", ephemeral: true
                })

}
		})
	}
})