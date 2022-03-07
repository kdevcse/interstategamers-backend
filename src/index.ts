import 'dotenv/config.js';
import { SimplecastClient } from "./utilities/simplecast-client.js";
import { AirtableClient } from "./utilities/airtable-client.js";
import { DiscordClient } from "./utilities/discord-client.js";
import { DiscordColors } from "./interfaces/discord-api.js";
import { CollectionType, FirebaseClient } from './utilities/firebase-client.js';

/*Main Function*/
async function mainFunc() {

  const discordClient = new DiscordClient(process.env.DISCORD_WEBHOOK_ID, process.env.DISCORD_WEBHOOK_TOKEN);
  const simplecastClient = new SimplecastClient(process.env.SIMPLECAST_ID, process.env.SIMPLECAST_KEY);
  const airtableClient = new AirtableClient(process.env.AIRTBALE_KEY, process.env.AIRTABLE_APP_ID);

  try {
    const firebaseClient = new FirebaseClient();
    const simplecastData = await simplecastClient.getSimplecastData();
    firebaseClient.updateData(simplecastData, CollectionType.EPISODE);
    const airtableData = await airtableClient.getAirtableData(simplecastData);
    firebaseClient.updateData(airtableData, CollectionType.RATINGS);

    console.log('Import successful');

    discordClient.postToDiscord(
      'IG Database Update Successful',
      'Simplecast and Airtable info were successfully imported into the IG database\nhttps://theigcast.com',
      DiscordColors.Success);
  } catch(e) {
    console.log(`Error occurred while trying to update podcast data: ${e}`);
    console.log('Import Failed');
    
    discordClient.postToDiscord(
      'IG Database Update Error',
      `Simplecast and Airtable info FAILED to import into the IG database\n\n${e}`,
      DiscordColors.Error);
  }
}

await mainFunc();