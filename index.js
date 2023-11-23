const Cluster = require('discord-hybrid-sharding');
const config = require("./config.js")

const manager = new Cluster.Manager(`./main.js`, {
    totalShards: 1, // Use 'auto' if u want it to be Auto.
    shardsPerClusters: 1, 
    mode: 'process' , 
    token: process.env.TOKEN || config.BotConfig.token,
    usev13: true,
});

manager.on('clusterCreate', cluster => console.log(`[🔷 SHARD/CUSTER] ${cluster.id}`));
manager.spawn({ timeout: -1 });