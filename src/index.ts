import { applicationDefault } from "firebase-admin/app";
import admin from 'firebase-admin';
import { SimplecastClient } from "./utilities/simplecast-client.js";
import { AirtableClient } from "./utilities/airtable-client.js";
import { IApiKeys } from "./interfaces/api-keys";

/*Main Function*/
async function mainFunc() {
  try {
    const app = admin.initializeApp({
      credential: applicationDefault()
    });
    var apiKeysColl = await app.firestore().collection('api-keys').get().catch(error => {
      console.log(`Error retrieving api key: ${error}`);
    });

    if (!apiKeysColl || !apiKeysColl.docs[0])
      return;

    var apiKeys = apiKeysColl.docs[0].data() as IApiKeys;

    const simplecastClient = new SimplecastClient(app);
    const airtableClient = new AirtableClient(app);

    const simplecastData = await simplecastClient.updatedSimplecastData(apiKeys);
    await airtableClient.updatedAirtableData(apiKeys, simplecastData);

    console.log('Import successful');
  } catch(e) {
    console.log(`Error occurred while trying to update podcast data: ${e}`);
    console.log('Import Failed');
  }
};

mainFunc();