const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite");
const prefix = "!";
const util = require("util");
const existsLink = require("exists-link");
const isImage = require('is-image');

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
async function checkText(txtData){
    let exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    txtData = txtData.match(exp);
    if(!txtData) return;
    txtData = txtData.filter(word=>isImage(word));
    return txtData;
}
client.on("ready", () => {
  console.log("Bot is online!");
  client.user.setPresence({ game: { name: "-help | "+client.guilds.size+" guilds"}});
  checkText("hello ther https://cdn.discordapp.com/attachments/343887031434346500/457617393833738262/GMod_Logo.png");
});

client.on("messageReactionAdd", async (messageReaction, user) => {
    try {
        if (messageReaction._emoji.reaction.emoji.name !== "🤦") return;
        let gmem = messageReaction.message.member;
        let guy = messageReaction.message.member.guild.members.find("id", user.id);
        let role = gmem.guild.roles.find("name", "Hall-of-Cringe");
        let hoc = gmem.guild.channels.find("name", "hall-of-cringe");
        if (!hoc) {
            user.send("I see that you tried to cringe a message, please run -setup for me to do this. Thanks!");
        }
        let text = messageReaction.message.content;
        let Attachment = (messageReaction.message.attachments).array();
        if (!guy.hasPermission("MANAGE_GUILD") && !guy.roles.has(role.id)) return;
        var image;
        let links = await checkText(text);
        if(Attachment[0]) {
            image = Attachment[0].url;
        } else if(links){
            image = links[0];
        } else {
          image = ""
        }
        const embed = {
            "description": text,
            "url": "https://discordapp.com",
            "color": 5141678,
            "timestamp": new Date(),
            "image": {
                "url": image
            },
            "author": {
                "name": gmem.user.tag,
                "url": "",
                "icon_url": gmem.user.avatarURL
            }
        };
        return hoc.send({embed});
    } catch(e){
        console.log("[ID#0]Error has occurred - "+e);
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
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You don't have enough permissions smh")
            let g1 = message.guild.channels.find("name", "hall-of-cringe");
            let g2 = message.guild.roles.find("name", "Hall-of-Cringe");
            if (g1) {
                if (args[1] === '--override') {
                    g1.delete();
                } else {
                    return message.channel.send("The channel already exists, running this command could cause the channel to be reset. Do -setup --override to force remake it.");
                }
            }
            if(g2){
                if(args[1] === '--override'){
                    g2.delete();
                } else {
                    return message.channel.send("The role already exists, running this command could cause the role members to be reset. Do -setup --override to force remake it.");
                }
            }
            message.guild.createRole({
                name: "Hall-of-Cringe"
            });
            let everyone = message.guild.defaultRole;
            return message.guild.createChannel("hall-of-cringe", 'text', [{
                id: message.guild.me,
                allow: ['SEND_MESSAGES']
            }])
                .then(async function(d) {
                    let role = message.guild.roles.find("name", "Hall-of-Cringe");
                    d.overwritePermissions(everyone, {
                        'SEND_MESSAGES': false,
                    }).catch(e => message.channel.send("[ID#1] An error has occurred - ```" + e + "```"));
                    d.overwritePermissions(role.id, {
                        'SEND_MESSAGES': true,
                        'MANAGE_MESSAGES': true,
                    }).catch(e => message.channel.send("[ID#2] An error has occurred - ```" + e + "```"));
                }).then(async d => {
                        var g2 = await message.guild.channels.find("name", "hall-of-cringe");
                        if(!g2){
                            var g2 = await message.guild.channels.find("name", "hall-of-cringe");
                        }
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
                    }).catch(e => message.channel.send("[ID#3] An error has occurred - ```" + e + "```"));
            return;
        } catch(e){
            return message.channel.send("An error occurred - "+e);
        }
    } else if(s === "help") {
        const embed = {
            "title": "Welcome to Hall of Cringe",
            "description":"To cringe a message use -setup and react a message with :face_palm: - you must have manage guild or the role Hall-of-Cringe",
            "color": 5141678,
            "timestamp": new Date(),
            "fields": [
                {
                    "name": "-help",
                    "value": "Help commands"
                },
                {
                    "name": "-setup",
                    "value": "Sets up the bot"
                },
                {
                    "name": "-ping",
                    "value": "Pings the bot"
                },
                {
                    "name": "🤦",
                    "value": "React with this to cringe a message"
                }
            ]
        };
        return message.channel.send({embed});
    } else {
            return
    }
});
client.login(process.env.BOT_TOKEN);
