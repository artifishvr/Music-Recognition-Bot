const { SlashCommand, CommandOptionType } = require('slash-create');
const Audd = require('audd.io').Audd;

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'recognize',
            description: 'Recognize a song',
            options: [
                {
                    name: 'link',
                    type: CommandOptionType.STRING,
                    description: 'Link to a mp4 or mp3 file',
                    required: true
                }
            ],

            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');
        const audd = new Audd(process.env.AUDD_API_KEY);
        const query = ctx.options.link;

        await ctx.defer();

        audd.recognize.fromURL(query).then((res) => {
            if (res.result) { // if match found then send the result 
                return void ctx.sendFollowUp({
                    embeds: [
                        {
                          title: `${res.result.title}`,
                          description: ` by ${res.result.artist}`,
                          color: 0x00FFFF,
                          url: `${res.result.song_link}`
                        }
                      ]
                    });
                } else { // if no match found then send 
                    return void ctx.sendFollowUp({ content: `no song found 😢` });
                }
            });
    }
};

