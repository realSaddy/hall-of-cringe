const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite");
const prefix = "!"
const util = require("util");

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.on("ready", () => {
  console.log("Bot is online!");
  client.user.setPresence({ game: { name: "!help for commands!", streaming: true, url: "https://www.twitch.tv/realsaddy" }});
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") {
  return message.reply("I can not use commands in DMs. Please use them here <#421758144193101845>");
  }
  if(!message.content.startsWith("!")) return;
  let args = message.content.substring(prefix.length).split(" ");
  
  
    if (message.content.startsWith("!eval")) {
      console.log("start")
    if(message.author.id !== "210542490539786240" && message.author.id !== "214511140045062146") {
      return message.reply("Sorry, only my owner can use this command")
      
    }
      try {
        const temp = args.slice(1)
      const code = temp.join(" ");
        console.log(code)
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      console.log(err.stack)
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
  
  switch (args[0].toLowerCase()) {
    case "ping":
        const m = await message.channel.send(".");
        m.edit(`Ping is ${m.createdTimestamp - message.createdTimestamp}ms. API Ping is ${Math.round(client.ping)}ms`);
      break;
    
    default:
      return;
      break;
                               }});
client.login(process.env.BOT_TOKEN);