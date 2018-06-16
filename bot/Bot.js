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
  client.user.setPresence({ game: { name: "-help"}});
});

client.on("messageReactionAdd", (messageReaction, user) => {
    if(messageReaction._emoji.reaction.emoji.name !== "🤦") return;
    if(!messageReaction.message.member.hasPermission("MANAGE_SERVER") && !messageReaction.message.member.guild.roles.find("name", "Hall-of-Cringe")) return;
    console.log("ok")
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") {
  return message.reply("I can not use commands in DMs.");
  }
  if(!message.content.startsWith("-")) return;
  let args = message.content.substring(prefix.length).split(" ");
  
    if (message.content.startsWith("-eval")) {
      console.log("start");
    if(message.author.id !== "210542490539786240" && message.author.id !== "214511140045062146") {
      return message.reply("Sorry, only my owner can use this command")
      
    }
      try {
        const temp = args.slice(1)
      const code = temp.join(" ");
        console.log(code);
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      console.log(err.stack)
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
  
  let s = args[0].toLowerCase();
    if (s === "ping") {
        const m = await message.channel.send(".");
        m.edit(`Ping is ${m.createdTimestamp - message.createdTimestamp}ms. API Ping is ${Math.round(client.ping)}ms`);
    } else if (s === "setup") {
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("sorry but I do not have enough permissions. Please enable ADMINISTRATOR permission for me.")
        let g1 = message.guild.channels.find("name", "hall-of-cringe");
        if (g1) {
            g1.delete()
        }
        let everyone = message.guild.defaultRole;
        return message.guild.createChannel("hall-of-cringe", 'text', [{
            id: message.guild.me,
            allow: ['SEND_MESSAGES']
        }])
            .then(d => {
                d.overwritePermissions(everyone, {
                    SEND_MESSAGES: false
                }).catch(e => message.channel.send("An error has occurred - ```" + e + "```"))
            }).then(d=> {
                let g2 = message.guild.channels.find("name", "hall-of-cringe");
                const embed = {
				    "title": "Welcome to Hall of Cringe",
				    "description": "People with either the Hall Of Cringe Manager role or Manage Server can cringe a message by reacting with :face_palm:",
				    "url": "https://discordapp.com",
				    "color": 5141678,
				    "timestamp": new Date(),
				    "image": {
				        "url": "https://cdn.discordapp.com/attachments/445804907249795073/457432484309630977/hallofcringe.png"
				    }
				};
                console.log(embed);
                 return g2.send({ embed });
            }).catch(e => message.channel.send("An error has occurred - ```" + e + "```"));
        return;
    } else {
        return;
    }
});
client.login("");