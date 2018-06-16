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
    try {
        if (messageReaction._emoji.reaction.emoji.name !== "🤦") return;
        let gmem = messageReaction.message.member
        if (!gmem.hasPermission("MANAGE_SERVER") && !gmem.guild.roles.find("name", "Hall-of-Cringe")) return;
        let hoc = gmem.guild.channels.find("name", "hall-of-cringe");
        if (!hoc) {
            user.send("I see that you tried to cringe a message, please run -setup for me to do this. Thanks!");
        }
        const embed = {
            "title": `${user}`,
            "description": messageReaction.message.content,
            "url": "https://discordapp.com",
            "color": 5141678,
            "timestamp": new Date(),
            "author": {
                "name": gmem.displayName,
                "url": "",
                "icon_url": user.avatarURL
            }
        };
        return hoc.send({embed});
    } catch(e){
        message.channel.send("Error has occurred - "+e);
    }
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
        try {
            if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("sorry but I do not have enough permissions. Please enable ADMINISTRATOR permission for me.")
            let g1 = message.guild.channels.find("name", "hall-of-cringe");
            console.log(args);
            if (g1) {
                console.log("a")
                if (args[1] === '--override') {
                    console.log("ok");
                    g1.delete();
                } else {
                    return message.channel.send("The channel already exists, running this command could cause the channel to be reset. Do -setup --override to force remake it.");
                }
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
                }).then(d => {
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
                    return g2.send({embed});
                }).catch(e => message.channel.send("An error has occurred - ```" + e + "```"));
            return;
        } catch(e){
            return message.channel.send("An error occurred - "+e);
        }
    } else {
        return;
    }
});
client.login(process.env.BOT_TOKEN);