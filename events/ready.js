const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const client = require("../main");
const figlet = require("figlet");
const Cluster = require('discord-hybrid-sharding');

const {ActionRowBuilder, Events, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, } = require("discord.js")

const adminRole = client.config.adminRole;




client.on(Events.ClientReady, () => {
// console.clear()
//   console.log(red.bold("Checking for any errors"))
// console.clear()


		if(!client.config.BotConfig.status){
				throw new Error(`Status Type In Config must have a value`);
			}
	
  console.log(white.bold(`
  				\n 2023
	  \n Dim Software - Dim Devs
      `))
    console.log(white(`Token Valid → ` + magenta(`${client.user.tag}`) +  ` has logged on`));
    console.log(white("URL → " + blue(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)))

const statustypes = [
			"Watching {users} users in {guild} servers right now on {shardcount} shards",
			"Working hard on computing some cool cmds",
			"Busy handling {users} users",
			"Invite me if you wish",
			"Achievement status - {users} users and {guild} guilds on {shardcount} shards",
	        "Running on {shardcount} shards"
		]

	
   client.user.setActivity(statustypes[Math.floor(Math.random() * statustypes.length)]
      .replace("{users}", client.guilds.cache.reduce((a, g) => a+g.memberCount, 0), 0)
      .replace("{guild}", client.guilds.cache.size, 0 )
	.replace("{shardcount}", Cluster.data.TOTAL_SHARDS)					   
    , { type: client.config.BotConfig.type })
  client.user.setStatus(client.config.BotConfig.status);



	 setInterval(async () => {
       

 const statustypes = [
			"Watching {users} users in {guild} servers right now on {shardcount} shards",
			"Working hard on computing some cool cmds",
			"Busy handling {users} users",
			"Invite me if you wish",
			"Achievement status - {users} users and {guild} guilds on {shardcount} shards",
	        "Running on {shardcount} shards"
		]

	
   client.user.setActivity(statustypes[Math.floor(Math.random() * statustypes.length)]
      .replace("{users}", client.guilds.cache.reduce((a, g) => a+g.memberCount, 0), 0)
      .replace("{guild}", client.guilds.cache.size, 0 )
	.replace("{shardcount}", Cluster.data.TOTAL_SHARDS)					   
    , { type: client.config.BotConfig.type })
  client.user.setStatus(client.config.BotConfig.status);
 
		 
    }, 60000)

	/* IMPORTANT EMBEDS! You can place them in any channel but i recommand making them private for only you and your admins! I recommand placing them in threads to keep it orgnaized too! */ 


 /*  Example of Application code, you can set this to any channel you will like and once the bot starts up, it will be send and be ready for use    */
 //	 const channel = client.channels.cache.get('1168581226647527445');

// 	channel.send({
	// 		 embeds: [
	 //			new EmbedBuilder()
		//		.setTitle("Maintence mode - Disable")
			//	 .setDescription("A modal will popup giving you a description to disable maintence")
				
			//	.setColor("Random")
				
	 //		] , components: [new ActionRowBuilder()
	//	.addComponents(
	 //				new ButtonBuilder()
		//	.setCustomId('disableMaintenceMode')
	//	.setLabel('Enable')
		//	.setStyle(ButtonStyle.Success)
						
			//)
	//	]
 	// })

	
 /*  Example of creation code, you can set this to any channel you will like and once the bot starts up, it will be send and be ready for use    */
	// const channel = client.channels.cache.get('1140569543622795384');

	// 	channel.send({
	// 		 embeds: [
	// 			new EmbedBuilder()
	// 			.setTitle("Create a space/Edit a space")
	// 			 .setDescription("Edit or create a space using the creation process.")
				
	// 			.setColor("Random")
				
	// 		] , components: [new ActionRowBuilder()
	// 			.addComponents(
	// 				new ButtonBuilder()
	// 		.setCustomId('create')
	// 		.setLabel('Create!')
	// 		.setStyle(ButtonStyle.Primary)
						
	// 			)
	// 		]
	// 	})

	 /*  Example of Removal code, This completely wipes everything from the space, from the spaceRole, spaceUser and the space model! Very dangerous! */
	
	// const channel = client.channels.cache.get('1140570696288837753');

	// 	channel.send({
	// 		 embeds: [
	// 			new EmbedBuilder()
	// 			.setTitle("Delete a space")
	// 			 .setDescription("This is a very dangerous move! Do the procedure if its necesscary!")
				
	// 			.setColor("Random")
				
	// 		] , components: [new ActionRowBuilder()
	// 			.addComponents(
	// 				new ButtonBuilder()
	// 		.setCustomId('delete')
	// 		.setLabel('Yes, delete!')
	// 		.setStyle(ButtonStyle.Danger)
						
	// 			)
	// 		]
	// 	})
	
})
