const { REST , Routes } = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: '/creator',
    description: 'Replies with the creator of this bot.',
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);


(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_APP_ID),
            {body: commands},
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();