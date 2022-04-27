const dotenv = require("dotenv");
const path = require("path");
const { SlashCreator, GatewayServer } = require("slash-create");
const { Client } = require("discord.js");

dotenv.config();

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_CLIENT_ID,
  publicKey: process.env.DISCORD_CLIENT_PUBKEY,
  token: process.env.DISCORD_CLIENT_TOKEN,
  client
});


client.on("ready", () => {
  client.user.setActivity("your music", {
    type: "LISTENING",
  });
  setInterval(() => {
    client.user.setActivity("your music", {
      type: "LISTENING",
    });
  }, 3600000);

  console.log(`Logging in as ${client.user.tag}`);

  console.log("Ready!");
});

creator
  .withServer(
    new GatewayServer(
      (handler) => client.ws.on('INTERACTION_CREATE', handler)
    )
  )
  .registerCommandsIn(path.join(__dirname, 'commands'))
  .syncCommands();

client.login(process.env.DISCORD_CLIENT_TOKEN);
module.exports = {
  client,
  creator,
};