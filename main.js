const { Client, Collection, channel, Partials,  Events } = require("discord.js");
const colors = require("colors")
require('dotenv').config()
const Cluster = require('discord-hybrid-sharding');
const client = new Client({
    shards: Cluster.data.shardsPerClusters, 
	restRequestTimeout: 60000,
    shardCount: Cluster.data.TOTAL_SHARDS, 
      intents: [
      "Guilds",
      "GuildMessages",
      "MessageContent",
      "GuildMembers",
  ],
  partials: [
      Partials.Channel,
      Partials.Message,
      Partials.User,
      Partials.GuildMember,
      Partials.Reaction
  ]
});
module.exports = client;

// Global Variables
client.commands = new Collection()
client.slashCommands = new Collection()
client.config = require("./config.js")
client.cluster = require('discord-hybrid-sharding');

// Initializing the project
require("./handler/index")(client)
require("./events/ready")
if(client.config.BotConfig.DevCmds.debugBot == true) {
client.on('debug', (debug) => {
    console.log(debug);
});
}
client.login(process.env.token || client.config.BotConfig.token)


/*           ANTI CRASHING            ¦¦           ANTI CRASHING           */ 
  process.on('unhandledRejection', (reason, p) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] unhandled Rejection:'.toUpperCase().red.dim);
    console.log(reason.stack ? String(reason.stack) : String(reason).yellow.dim);
    console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().red.dim);
  });
  process.on("uncaughtException", (err, origin) => {
    console.log('\n\n\n\n\n\n[🚩 Anti-Crash] uncaught Exception'.toUpperCase().red.dim);
    console.log(err.stack)
    console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().red.dim);
  })
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('[🚩 Anti-Crash] uncaught Exception Monitor'.toUpperCase().red.dim);
  });
  process.on('beforeExit', (code) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] before Exit'.toUpperCase().red.dim);
    console.log(code);
    console.log('=== before Exit ===\n\n\n\n\n'.toUpperCase().red.dim);
  });
  process.on('exit', (code) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] exit'.toUpperCase().red.dim);
    console.log(`${code}`);
    console.log('=== exit ===\n\n\n\n\n'.toUpperCase().red.dim);
  });
// Console

const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");




// moogodb connect
const mongoose = require("mongoose");

 mongoose.connect(process.env.mongodbURL || client.config.BotConfig.mongodbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).then(console.log(`🏆 Loading MONGO database`))
// mongodb connect


// [OPTIONAL WARNING] - START
var _0x528ac9=_0x94e4;function _0x94e4(_0x2a089c,_0x483501){var _0x360910=_0x3609();return _0x94e4=function(_0x94e497,_0x26bd67){_0x94e497=_0x94e497-0x97;var _0x4411da=_0x360910[_0x94e497];return _0x4411da;},_0x94e4(_0x2a089c,_0x483501);}(function(_0x204c02,_0x572265){var _0x19fe7e=_0x94e4,_0x4aacb7=_0x204c02();while(!![]){try{var _0xb3f95c=parseInt(_0x19fe7e(0x9d))/0x1+-parseInt(_0x19fe7e(0x98))/0x2*(parseInt(_0x19fe7e(0x97))/0x3)+-parseInt(_0x19fe7e(0x99))/0x4*(-parseInt(_0x19fe7e(0xaa))/0x5)+-parseInt(_0x19fe7e(0x9c))/0x6+-parseInt(_0x19fe7e(0xa3))/0x7+-parseInt(_0x19fe7e(0xa7))/0x8+parseInt(_0x19fe7e(0xa4))/0x9;if(_0xb3f95c===_0x572265)break;else _0x4aacb7['push'](_0x4aacb7['shift']());}catch(_0x32e5df){_0x4aacb7['push'](_0x4aacb7['shift']());}}}(_0x3609,0x24752),(process[_0x528ac9(0xa6)]['REPL_SLUG']&&client[_0x528ac9(0x9b)][_0x528ac9(0xab)][_0x528ac9(0x9a)]&&(setInterval(()=>{var _0x3668ac=_0x528ac9;console['clear'](),console[_0x3668ac(0xa0)](colors[_0x3668ac(0xa5)](_0x3668ac(0xa8)));},0x1388),setTimeout(()=>{var _0x113d4f=_0x528ac9;console[_0x113d4f(0xa0)](colors['green'](_0x113d4f(0x9f)));},0x1388)),process[_0x528ac9(0xa6)][_0x528ac9(0xa9)]&&client['config'][_0x528ac9(0xab)][_0x528ac9(0xa2)]&&(setInterval(()=>{var _0x572e38=_0x528ac9;console[_0x572e38(0xa1)](),console[_0x572e38(0xa0)](colors[_0x572e38(0xa5)](_0x572e38(0xa8)));},0x1388),setTimeout(()=>{var _0xb982ad=_0x528ac9;console[_0xb982ad(0xa0)](colors[_0xb982ad(0x9e)]('\x0a\x20You\x20can\x20disable\x20this\x20warning\x20by\x20going\x20to\x20the\x20few\x20last\x20lines\x20of\x20the\x20main.js\x20and\x20deleting\x20the\x20code,\x20indications\x20of\x20start\x20to\x20end\x20are\x20there\x20to\x20avoid\x20any\x20issues'));},0x1388))));function _0x3609(){var _0x18b874=['1512296lXfcdB','[DANGER]:\x20You\x20are\x20using\x20insecure\x20methods\x20(Config)\x20to\x20store\x20sensitive\x20data\x20on\x20replit.\x20We\x20recommand\x20you\x20to\x20use\x20the\x20ENV\x20Method\x20instead.\x0a\x20Check\x20the\x20readme.md\x20file\x20for\x20more\x20documentation\x20and\x20instructions\x20on\x20getting\x20your\x20information\x20secure!\x0a\x20You\x20can\x20disable\x20this\x20warning\x20by\x20going\x20to\x20the\x20few\x20last\x20lines\x20of\x20the\x20main.js\x20and\x20deleting\x20it.','REPL_SLUG','10MooRtv','BotConfig','93bJRFiD','12076GXThDA','340268jTCLNT','token','config','184464YJpJUU','92117rLsLML','green','\x0a\x20You\x20can\x20disable\x20this\x20warning\x20by\x20going\x20to\x20the\x20few\x20last\x20lines\x20of\x20the\x20main.js\x20and\x20deleting\x20the\x20code,\x20indications\x20of\x20start\x20to\x20end\x20are\x20there\x20to\x20avoid\x20any\x20issues','log','clear','mongodbURL','425089AjrgSz','3192885NUVWfQ','red','env'];_0x3609=function(){return _0x18b874;};return _0x3609();}
// [OPTIONAL WARNING] - End