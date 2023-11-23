const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const Discord = require('discord.js');
const globPromise = promisify(glob);
const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const {Events} = require("discord.js")

module.exports = async (client) => {
    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`);
    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
      const file = require(value);
      if (!file?.name) return;
      client.slashCommands.set(file.name, file);
      arrayOfSlashCommands.push(file);
    }); 

    
    client.on(Events.GuildCreate, async (guild) => {
   await client.application.commands.set(arrayOfSlashCommands);
   return console.log(`⚡ I was Invited to ${guild.name}! I will now start creating the Slash Commands (If i have perms)`)
    })

		
/* START - IMPORTANT */
/* DEPLOYMENT CODE */

const _0xee0a35=_0x5a12;function _0x5a12(e,n){const t=_0x5e83();return(_0x5a12=function(e,n){return t[e-=148]})(e,n)}function _0x5e83(){const e=["435845DqvTpV","then","set","16EGXvlo","42NuYtPq","log","149570nhGxBe","ClientReady","42468OoOkCH","83708cAyADR","800745IunSiL","306dCfOkj","5990502GxfJiF","\n Bot is not ready for use! Please fix your errors via on top!","process","[?25l","catch","212tccfDM","[?25h","write","3431504OBMCtv","hide","application","180WcdfYG","\rLoaded all slash commands successfully"];return(_0x5e83=function(){return e})()}(function(e,n){const t=_0x5a12,r=_0x5e83();for(;;)try{if(482828===parseInt(t(158))/1*(parseInt(t(152))/2)+-parseInt(t(157))/3*(parseInt(t(166))/4)+-parseInt(t(149))/5*(parseInt(t(153))/6)+-parseInt(t(161))/7+parseInt(t(169))/8+-parseInt(t(160))/9*(-parseInt(t(155))/10)+parseInt(t(159))/11*(parseInt(t(172))/12))break;r.push(r.shift())}catch(e){r.push(r.shift())}})(),client.on(Events[_0xee0a35(156)],(async()=>{const e=_0xee0a35,{stdout:n}=require(e(163));setTimeout((async()=>{const t=e;var r=function(){const e=_0x5a12,t=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"],r={hide:e(164),show:e(167)};n[e(168)](r.hide);let s=0;return setInterval((function(){n[e(168)]("\r"+t[s++]+" Loading slash commands!"),s=s>=t.length?0:s}),3)}();try{await client[t(171)].commands[t(151)](arrayOfSlashCommands)[t(150)]((e=>{const s=t;clearInterval(r);const a="[?25l";s(167);n[s(168)](a),n[s(168)](green(s(148))),console.log("\nBot ready for use!")}))[t(165)]((e=>{const s=t;clearInterval(r);const a={hide:s(164),show:"[?25h"};throw n[s(168)](a[s(170)]),n.write(red("\rFailure of deployment Error: \n"+e)),new Error(red(s(162)))}))}catch(e){console[t(154)](String(e.stack))}}),1500)}));

/* END - IMPORTANT */
/* DEPLOYMENT CODE */
	
}


