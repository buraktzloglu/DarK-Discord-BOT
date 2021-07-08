const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});

const { prefix } = require('./config.json');

require('dotenv').config()
require("./util/eventHandler")(client)

const fs = require("fs");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("[!] Komutlar bulunamadı!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        client.commands.set(pull.config.name, pull);  
        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name)
        });
    });
});

client.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(client,message,args)
});

client.on("guildMemberAdd", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === '🚪-ᴋᴀᴘɪ')
    var wembed = new Discord.MessageEmbed()
    .setTitle('__**HoşGeldin, Dostum**!__')
    .setDescription(`__${member}__ **DarK® Oyun Sunucularına Katıldı!** :wave:`)
    .addField(`**Bilgilendirme:**`,`🔸 <#801456036607295488> Tercih ettiğiniz oyunu seçebilirsiniz.\n🔸 <#680113204105314314> Bizi daha iyi tanıyabilirsiniz.\n🔸 <#666714282746183681> Ödeme yapmadan önce lütfen okuyun.`)
    .setThumbnail(member.user.displayAvatarURL({format: "png"}))
    .setColor('GREEN');
    welcomeChannel.send (wembed)
});

client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id === "801456036607295488") {
        if (reaction.emoji.name === 'minecraft'){
            await reaction.message.guild.members.cache.get(user.id).roles.add("801365017412894732")
            await reaction.message.guild.members.cache.get(user.id).roles.add("689934172307062786")
        }
        else if (reaction.emoji.name === 'unturned'){
            await reaction.message.guild.members.cache.get(user.id).roles.add("801441935168503818")
            await reaction.message.guild.members.cache.get(user.id).roles.add("689934172307062786")
        }
    }
})

client.on("messageReactionRemove", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id === "801456036607295488") {
        if (reaction.emoji.name === 'minecraft'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove("801365017412894732")
        }
        else if (reaction.emoji.name === 'unturned'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove("801441935168503818")
        }
    }
})

client.login(process.env.BOT_TOKEN);