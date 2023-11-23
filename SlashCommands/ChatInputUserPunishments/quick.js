const { Client, CommandInteraction, ApplicationCommandOptionType, PermissionFlagsBits, ChannelType } = require("discord.js");
const Discord = require(`discord.js`)
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const execSync = require('child_process').execSync;
const model = require("../../models/space")
const modelRole = require("../../models/spaceRole")
const modelUser = require("../../models/spaceUser")
const modelUserWarn = require("../../models/spaceUserWarn")



module.exports = {
	name: "quick",
	description: "Do quick commands without a dashboard!",
	devOnly: true,
	modalCmd: true,
	options: [
		{
			name: "add",
			type: 2,
			description: "Adding a punishment to a user in space",
			options: [
				{
					name: "kick",
					type: 1,
					description: "Kick a user from space",
					options: [
						{
							name: "user",
							type: 6,
							description: "A user in your space.",
							required: true
						}, {
							name: "reason",
							type: 3,
							description: "Any reason why you kicked this user",
						}
					],
				}, {
					name: "ban",
					type: 1,
					description: "Ban a user from space",
					options: [
						{
							name: "user",
							type: 6,
							description: "A user in your space.",
							required: true
						}, {
							name: "reason",
							type: 3,
							description: "Any reason why you banned this user",
						}, {
							name: "duration",
							type: 3,
							description: "Duration of banishment: 5s, 5d, 5y",
						},
						{
							name: "delete-message-history",
							type: 3,
							description: "[Number, 'All', (default is none)]",
						}
					],
				}, {
					name: "mute",
					type: 1,
					description: "Mute a user from space",
					options: [
						{
							name: "user",
							type: 6,
							description: "A user in your space.",
							required: true
						}, {
							name: "reason",
							type: 3,
							description: "Any reason why you muted this user",
						}, {
							name: "duration",
							type: 3,
							description: "5m, 5h, 5d",
						}
					],
				}, {
					name: "warn",
					type: 1,
					description: "Warn a user from space",
					options: [
						{
							name: "user",
							type: 6,
							description: "A user in your space.",
							required: true
						}, {
							name: "reason",
							type: 3,
							description: "Any reason why you warned this user",
						}, {
							name: "duration",
							type: 3,
							description: "[5s, 5d, 5h]",
						}
					],
				},
			]
		}, {
			name: "remove",
			type: 2,
			description: "Removing a punishment to a user in space",
			options: [
				{
					name: "ban",
					type: 1,
					description: "Remove a user's ban from space",
					options: [
						{
							name: "user",
							type: 6,
							description: "A user in your space.",
							required: true
						}, {
							name: "reason",
							type: 3,
							description: "Any reason why you unbanned this user",
						}
					],
				},
				{
					name: "mute",
					type: 1,
					description: "Unmute a user from space",
					options: [
						{
							name: "user",
							type: 6,
							description: "A user in your space.",
							required: true
						}, {
							name: "reason",
							type: 3,
							description: "Any reason why you unmuted this user",
						}
					],
				},
				{
					name: "warn",
					type: 1,
					description: "Removes a user's warn from space",
					options: [
						{
							name: "warnid",
							type: 3,
							description: "Warn ids come with a warn.",
							required: true
						}
					],
				},
			]

		},


	],


	run: async (client, interaction, args) => {

	if(!interaction.channel.parentId) return interaction.reply({content: "Please use this command in a catagory please!", ephemeral: true});
		
		const data = await model.findOne({
			CatagoryId: interaction.channel.parentId
		});

		if (!data) {

			return interaction.reply({ content: "This isn't a space!", ephemeral: true })


		}

		const dataRole = await modelRole.findOne({
			CatagoryId: data.CatagoryId
		});

		if (!dataRole) {
			await interaction.reply({
				content: `Seems like this space is new and the database needs a refresher. Click on this button to continue`,
				components: [new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('setupDashModel')
							.setLabel('Setup!')
							.setStyle(ButtonStyle.Primary)

					)
				], ephemeral: true
			})
		}

		if (!interaction.member.roles.cache.has(dataRole.AdminId) || !interaction.member.roles.cache.has(dataRole.OwnerId)) {
			const modelConfig = require("../../models/configureServer")
				const configData = await modelConfig.findOne({
							GuildId: interaction.guild.id
						})

			return interaction.reply({content: `Seems like you can't use the dashboard as your do not have the valid permissions... Maybe create your own space to have your own dashboard. Apply at <#${configData.appCH}>`, ephemeral: true})			
		}

		if (interaction.options.getSubcommandGroup() === "add") {
			if (interaction.options.getSubcommand() === 'kick') {

				
				
				const user = interaction.options.getUser('user');
				const reason = interaction.options.getString('reason') || "Not specified";

				const userId = user.id;

				if(userId == interaction.user.id){
			return interaction.reply({content: `You can't do a **DANGEROUS** command to yourself.`, ephemeral: true})	
		}
				
				const guild = client.guilds.cache.get(interaction.guild.id);
				const member = await guild.members.fetch(userId);

				if (member.roles.cache.has(dataRole.MemberId)) {
					member.roles.remove(dataRole.MemberId);

					await interaction.reply({ content: `${member.user.username} has been kicked and should be notified!`, ephemeral: true });

					client.users.send(userId, `You have been kicked from ${data.spaceName} for ${reason}!`);
				} else {
					await interaction.reply({ content: `${member.user.username} isn't in this space...`, ephemeral: true });
				}



			}

			if (interaction.options.getSubcommand() === 'ban') {

				const user = interaction.options.getUser('user');
				const reason = interaction.options.getString('reason') || "Not specified";
				const banDuration = interaction.options.getString('duration');
				const CM = interaction.options.getString('delete-message-history') || "1"

				if (CM !== "1") {
					CM = CM.toUpperCase();
				}

				const userId = user.id;

				if(userId == interaction.user.id){
			return interaction.reply({content: `You can't do a **DANGEROUS** command to yourself.`, ephemeral: true})	
		}

			if(NaN==Number(CM)){if("ALL"===CM){const{limit:e}=-1;client.channels.cache.find((e=>e.type==ChannelType.GuildCategory&&e.name==data.spaceName)).children.cache.forEach((async e=>{const t=setInterval((async()=>{const t={limit:100,filter:e=>e.author.id===userId};await e.messages.fetch(t).then((t=>{e.bulkDelete(t,!0)}))}),500);setInterval((async()=>{const a={limit:100,filter:e=>e.author.id===userId};await e.messages.fetch(a).then((e=>{null!=e&&e.length||clearInterval(t)}))}),500)}))}}else{const{limit:e}=CM;client.channels.cache.find((e=>e.type==ChannelType.GuildCategory&&e.name==data.spaceName)).children.cache.forEach((async t=>{if(-1==e){const e=setInterval((async()=>{const e={limit:100,filter:e=>e.author.id===userId};await t.messages.fetch(e).then((e=>{t.bulkDelete(e,!0)}))}),500);setInterval((async()=>{const a={limit:100,filter:e=>e.author.id===userId};await t.messages.fetch(a).then((t=>{null!=t&&t.length||clearInterval(e)}))}),500)}else{const e={limit:CM,filter:e=>e.author.id===userId};await t.messages.fetch(e).then((e=>{t.bulkDelete(e,!0)}))}}))}

				const guild = client.guilds.cache.get(interaction.guild.id);
				const member = await guild.members.fetch(userId);

				if (member.roles.cache.has(dataRole.MemberId)) {
					member.roles.remove(dataRole.MemberId);

					const dataUserFind = await modelUser.findOne({
		GuildId: interaction.guild.id,		
		UserId: userId,
		SpaceBanId: data.CatagoryId,
	})

if(dataUserFind && !dataUserFind.isBanned && !dataUserFind.BanReason){
			if(banDuration) {
		const ms = require("ms")

			let banDuMS = Date.now()+ ms(banDuration);

					 let x = await modelUser.findOneAndUpdate({ GuildId: interaction.guild.id, UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason, banDuration: banDuMS })

					client.users.send(userId, `You have been banned from ${data.spaceName} for ${reason}! Luckily this ban will expire <t:${parseInt(banDuMS / 1000, 10)}:R>`);

				interaction.reply({content: `${member.user.username} has been banned and should be notified! It expires <t:${parseInt(banDuMS / 1000, 10)}:R> \n Note: If you have you choosen to clear messages, due to API Limits, all of the banned users messages must be send under 14 days. You can delete those messages manually though`,  ephemeral: true });

			}
	else {
		let x = await modelUser.findOneAndUpdate({ GuildId: interaction.guild.id, UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason })

			interaction.reply({content: `${member.user.username} has been banned permanantly and should be notified!  \n Note: If you have you choosen to clear messages, due to API Limits, all of the banned users messages must be send under 14 days. You can delete those messages manually though`,  ephemeral: true });

		client.users.send(userId, `You have been banned from ${data.spaceName} for ${reason}! It is permanant and it will stay that way unless you get really really lucky...`);
	}
		}

					if (!dataUserFind) {

						if (banDuration) {
							const ms = require("ms")

							let banDuMS = Date.now() + ms(banDuration);

							new modelUser({
								GuildId: interaction.guild.id,
								UserId: userId,
								isBanned: "true",
								banReason: reason,
								SpaceBanId: data.CatagoryId,
								banDuration: banDuMS
							}).save()

							client.users.send(userId, `You have been banned from ${data.spaceName} for ${reason}! Luckily this ban will expire <t:${parseInt(banDuMS / 1000, 10)}:R>`);

							interaction.reply({ content: `${member.user.username} has been banned and should be notified! It expires <t:${parseInt(banDuMS / 1000, 10)}:R>`, ephemeral: true });
						} else {
							new modelUser({
								GuildId: interaction.guild.id,
								UserId: userId,
								isBanned: "true",
								banReason: reason,
								SpaceBanId: data.CatagoryId

							}).save()

							interaction.reply({ content: `${member.user.username} has been banned permanantly and should be notified!`, ephemeral: true });

							client.users.send(userId, `You have been banned from ${data.spaceName} for ${reason}! It is permanant and it will stay that way unless you get really really lucky...`);

						}
					} else if(dataUserFind && dataUserFind.isBanned && dataUserFind.BanReason){

						if (banDuration) {
							const ms = require("ms")

							let banDuMS = Date.now() + ms(banDuration);

							let x = await modelUser.findOneAndUpdate({ GuildId: interaction.guild.id, UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason, banDuration: banDuMS })

							client.users.send(userId, `Your ban has been editted from ${data.spaceName}. Heres whats been editted \n Reason: Reason: ${reason} \n Expiration date: <t:${parseInt(banDuMS / 1000, 10)}:R>.`);

							interaction.reply({ content: `${member.user.username}'s banishment has been editted and should be notified! It expires <t:${parseInt(banDuMS / 1000, 10)}:R>`, ephemeral: true });
						}
						else {
							let x = await modelUser.findOneAndUpdate({GuildId: interaction.guild.id, UserId: userId, SpaceBanId: data.CatagoryId }, { isBanned: "true", banReason: reason })

							interaction.reply({ content: `${member.user.username}'s banishment has been editted and should be notified!`, ephemeral: true });

							client.users.send(userId, `Your ban has been editted from ${data.spaceName}. Heres what been editted \n Reason: ${reason}.`);
						}

					}
				} else {
					return interaction.reply({ content: `${member.user.username} isn't in this space...`, ephemeral: true });
				}



			}

			if (interaction.options.getSubcommand() === 'mute') {

				const user = interaction.options.getUser('user');
				const reason = interaction.options.getString('reason') || "Not specified";

				const muteDuration = interaction.options.getString('duration');

				const userId = user.id;
				if(userId == interaction.user.id){
			return interaction.reply({content: `You can't do a **DANGEROUS** command to yourself.`, ephemeral: true})	
		}

				const guild = client.guilds.cache.get(interaction.guild.id);
				const member = await guild.members.fetch(userId);

				const catagory = client.channels.cache.get(interaction.channel.parentId);

				catagory.permissionOverwrites.edit(userId, { SendMessages: false, SendMessagesInThreads: false, CreatePublicThreads: false, CreatePrivateThreads: false, Connect: false, AddReactions: false });

				if (muteDuration) {
					const ms = require("ms")

					let muteDuMS = Date.now() + ms(muteDuration);

					const dataUserFind = await modelUser.findOne({
						GuildId: interaction.guild.id,
						UserId: userId,
						SpaceBanId: data.CatagoryId
					})



					if (!dataUserFind) {
						new modelUser({
							GuildId: interaction.guild.id,
							UserId: userId,
							muteDuration: Number(muteDuMS),
							SpaceBanId: data.CatagoryId
						}).save()

						await interaction.reply({ content: `${member.user.username} has been muted for <t:${Math.round(muteDuMS / 1000)}:R> and should be notified!`, ephemeral: true });

						client.users.send(userId, `Oh! Unlucky, You are now muted! You will be able to interact in ${data.spaceName} <t:${Math.round(muteDuMS / 1000)}:R>. Reason is ${reason}!`);


					} else {
						let x = await modelUser.findOneAndUpdate({GuildId: interaction.guild.id, UserId: userId, SpaceBanId: data.CatagoryId }, { muteDuration: Number(muteDuMS) })

						await interaction.reply({ content: `${member.user.username} muted duration has been added to <t:${Math.round(muteDuMS / 1000)}:R> and should be notified!`, ephemeral: true });

						client.users.send(userId, `Oh! Unlucky, your mute time has been editted and now you will be able to interact in ${data.spaceName} <t:${Math.round(muteDuMS / 1000)}:R>. Reason is ${reason}!`);
					}
				}

				if (!muteDuration) {
					await interaction.reply({ content: `${member.user.username} has been muted permanantly and should be notified!`, ephemeral: true });

					client.users.send(userId, `You have been muted permanantly from ${data.spaceName} for ${reason}!`);
				}


			}

			if (interaction.options.getSubcommand() === 'warn') {
				const user = interaction.options.getUser('user');
				const reason = interaction.options.getString('reason') || "Not specified";
				const warnDuration = interaction.options.getString('duration')

				const userId = user.id;
				if(userId == interaction.user.id){
			return interaction.reply({content: `You can't do a **DANGEROUS** command to yourself.`, ephemeral: true})	
		}

				const guild = client.guilds.cache.get(interaction.guild.id);
				const member = await guild.members.fetch(userId);

				function makeid(length) {
					let result = '';
					const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
					const charactersLength = characters.length;
					let counter = 0;
					while (counter < length) {
						result += characters.charAt(Math.floor(Math.random() * charactersLength));
						counter += 1;
					}
					return result;
				}

				const dataUserFind = await modelUserWarn.findOne({
					GuildId: interaction.guild.id,
					UserId: userId,
					SpaceId: data.CatagoryId,
					WarnReason: reason
				})

				if (member.roles.cache.has(dataRole.MemberId)) {

					const warnid = makeid(8);

					if (warnDuration) {
						const ms = require("ms")

						let warnDuMS = Date.now() + ms(warnDuration);

						new modelUserWarn({
							GuildId: interaction.guild.id,
							WarnId: warnid,
							UserId: userId,
							isWarnActive: "true",
							WarnReason: reason,
							SpaceId: data.CatagoryId,
							warnDuration: warnDuMS

						}).save()

						client.users.send(userId, `You have been warned from ${data.spaceName} for ${reason}! [${warnid}]. Luckily this warn will expire <t:${parseInt(warnDuMS / 1000, 10)}:R>`);

						interaction.reply({ content: `${member.user.username} has been warned and should be notified! [${warnid}]. It expires <t:${parseInt(warnDuMS / 1000, 10)}:R>`, ephemeral: true });

					} else {
						new modelUserWarn({
							GuildId: interaction.guild.id,
							WarnId: warnid,
							UserId: userId,
							isWarnActive: "true",
							WarnReason: reason,
							SpaceId: data.CatagoryId

						}).save()


						client.users.send(userId, `You have been warned from ${data.spaceName} for ${reason}! [${warnid}]`);

						interaction.reply({ content: `${member.user.username} has been warned and should be notified! [${warnid}]`, ephemeral: true });
					}

				} else {
					return interaction.reply({ content: `${member.user.username} isn't in this space...`, ephemeral: true });
				}

			}
		}


		if (interaction.options.getSubcommandGroup() === "remove") {
			if (interaction.options.getSubcommand() === 'ban') {
				const user = interaction.options.getUser('user');
				const reason = interaction.options.getString('reason') || "Not specified";

				const userId = user.id;
if(userId == interaction.user.id){
			return interaction.reply({content: `You can't do a **DANGEROUS** command to yourself.`, ephemeral: true})	
		}
				const guild = client.guilds.cache.get(interaction.guild.id);
				const member = await guild.members.fetch(userId);

				const dataUserFind = await modelUser.findOne({
					GuildId: interaction.guild.id,
					UserId: userId,
					SpaceBanId: data.CatagoryId
				})



				if (!dataUserFind) {

					interaction.reply({ content: `${member.user.username} is not banned from this space!`, ephemeral: true });


				} else {
					let x = await modelUser.findOneAndUpdate({GuildId: interaction.guild.id, UserId: userId, SpaceBanId: data.CatagoryId }, { $unset: { banDuration: 1, banReason: 1, isBanned: 1} })

					interaction.reply({ content: `${member.user.username} has been unbanned and should be notified!`, ephemeral: true });

					client.users.send(userId, `You have been unbanned from ${data.spaceName} for ${reason}!`);
				}


			}
			if (interaction.options.getSubcommand() === 'mute') {
				const user = interaction.options.getUser('user');
				const reason = interaction.options.getString('reason') || "Not specified";

				const userId = user.id;
if(userId == interaction.user.id){
			return interaction.reply({content: `You can't do a **DANGEROUS** command to yourself.`, ephemeral: true})	
		}
				const guild = client.guilds.cache.get(interaction.guild.id);
				const member = await guild.members.fetch(userId);

				const catagory = client.channels.cache.get(interaction.channel.parentId);

				catagory.permissionOverwrites.delete(userId);

				await interaction.reply({ content: `${member.user.username} has been unmuted and should be notified!`, ephemeral: true });

				client.users.send(userId, `Luck is in your side! You have been unmuted from ${data.spaceName} for ${reason}!`);



			}

			if (interaction.options.getSubcommand() === 'warn') {

				const warnid = interaction.options.getString('warnid');

				function makeid(length) {
					let result = '';
					const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
					const charactersLength = characters.length;
					let counter = 0;
					while (counter < length) {
						result += characters.charAt(Math.floor(Math.random() * charactersLength));
						counter += 1;
					}
					return result;
				}

				const dataUserFind = await modelUserWarn.findOne({
					GuildId: interaction.guild.id,
					SpaceId: data.CatagoryId,
					WarnId: warnid
				})

				const guild = client.guilds.cache.get(interaction.guild.id);
				const member = await guild.members.fetch(dataUserFind.UserId);

				if (member == undefined) {
					return interaction.reply({ content: `Warn is invalid!`, ephemeral: true });
				}

				if (member.roles.cache.has(dataRole.MemberId)) {




					if (!dataUserFind) {


						return interaction.reply({ content: `Warn not found!`, ephemeral: true });

					} else {

						let x = await modelUserWarn.findOneAndUpdate({ SpaceId: data.CatagoryId, WarnId: dataUserFind.WarnId }, { isWarnActive: "false" })

						client.users.send(dataUserFind.UserId, `Your warn has been removed from ${data.spaceName}!`);

						interaction.reply({ content: `${member.user.username} warn has been removed and user has been nottified`, ephemeral: true });


					}
				} else {
					return interaction.reply(`${member.user.username} isn't in this space...`, { ephemeral: true });
				}
			}

		}



	}
}