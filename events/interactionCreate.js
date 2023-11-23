const client = require("../main");
const modelConfig = require("../models/configureServer")
const modelAgreement = require("../models/agreement")
const modelDev = require("../models/devSettings")
const { MessageEmbed, Collection, Events, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js")
const cooldowns = new Map();

const adminRole = client.config.adminRole;



client.on(Events.InteractionCreate, async (interaction) => {

  	let checkMaintence = await modelDev.findOne({ isMaintence: true });
  
  let developers = [
    "1076512386078474240"
  ]
  
  if(!developers.includes(interaction.user.id)){
     if(checkMaintence){
       if(checkMaintence.maintenceDate){
          return interaction.reply({
        content: `# Dim is currently on maintenance mode. \n > ${checkMaintence.maintenceMsg} \n ## This maintenance will end <t:${parseInt(checkMaintence.maintenceDate / 1000, 10)}:R>.`, ephemeral: true
      })
       } else {
          return interaction.reply({
        content: `# Dim is currently on maintenance mode. \n > ${checkMaintence.maintenceMsg} \n ## Maintenance will be permanant until a developer disables maintenance.`,ephemeral: true
      })
       }
  }
  }
   
    
	if(!interaction.guild) return interaction.reply("Dim is a bot for Servers not DMS!")
  
  
	
    // Slash Command Handling
    if (interaction.isCommand()) {

		
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.followUp({ content: "An error has occured " });

		let checkConfig = await modelConfig.findOne({ GuildId: interaction.guild.id })

		let checkAgree = await modelAgreement.findOne({ GuildId: interaction.guild.id })

		if(interaction.memberPermissions.any("Administrator")) {
			if(!checkAgree){
				return interaction.reply({ content: "Hello Admin! Please, agree to our [Terms of Service](https://dimbot.xyz/tos) and [Privacy Policy](https://dimbot.xyz/privacy) in order to use Dim.", components: [
					new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
					.setCustomId('agreetos')
					.setLabel('Yes, I agree')
					.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
							.setCustomId('disagreetos')
							.setLabel('No, I don\'t agree')
							.setStyle(ButtonStyle.Danger),
						)
				], ephemeral: true })
			}

			if(cmd.name !== "configurate" && !checkConfig || cmd.name !== "configurate" && checkConfig.reportGlobalRL == null || cmd.name !== "configurate" && checkConfig.HostCH == null ){
				return interaction.reply({content: "Hello Admin! This server can not use any other commands than </configurate:1158096144925212683>. \n > This server has not been configurated which can cause issues. Please contact your server's admins to configurate this server. \n If you have configured this server, go to this [page](https://www.dimbot.xyz/howtogetstarted) to understand how to use dim and how it works", ephemeral: true })
			}	
		} else {
			if(!checkAgree){
		return interaction.reply({content: "Hello! Please ask your admin to agree to our services to make this server accessible for using this bot.", ephemeral: true})	
			} 	if(cmd.name !== "configurate" && !checkConfig || cmd.name !== "configurate" && checkConfig.reportGlobalRL == null || cmd.name !== "configurate" && checkConfig.HostCH == null ){
				return interaction.reply({content:  "Please ask your local administrator of this server to configure this serer." , ephemeral: true})
			}
		}
	
		

      function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + "h, " + minutes + "m, " + seconds + "s";
      }

       if (cmd.cooldown) {
        if (!cooldowns.has(cmd.name)) {
          cooldowns.set(cmd.name, new Collection());
        }
        let currentDate = Date.now();
        let userCooldowns = cooldowns.get(cmd.name);
        let cooldownAmount = (cmd.cooldown || 3) * 1000;
        if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
            let timeLeft = Math.round((expirationDate - currentDate) / 1000);
            return interaction.reply({ content: `⌚ Your on a cooldown! Wait **${msToTime(timeLeft.toString())}** before using this command again!` })
          } else {
            userCooldowns.set(interaction.user.id, currentDate);
          }
        } else {
          userCooldowns.set(interaction.user.id, currentDate);
        }
      }

		if(cmd.modalCmd == false){
				if(cmd.ephemeralCmd == true){
			  await interaction.deferReply({ ephemeral: true }).catch(() => {});
		} else {
			  await interaction.deferReply({ ephemeral: false }).catch(() => {});
		}
		} else {
			
		}

	
    
      const args = [];

      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
          option.options.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }
      interaction.member = interaction.guild.members.cache.get(interaction.user.id);
      cmd.run(client, interaction, args);
    }

    // Context Menu Handling
    if (interaction.isUserContextMenuCommand()) {
        // await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }

	 if (interaction.isAutocomplete()) {

			const command = 							   client.slashCommands.get(interaction.commandName);
        if (command) command.autocomplete(interaction);
		
	}
	
})