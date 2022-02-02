import admin from 'firebase-admin';
import { IAirtableRecord, IAirtableResponse } from '../interfaces/airtable-api';
import { IApiKeys } from '../interfaces/api-keys';
import { IEpisodeInfo, IRankingInfo } from '../interfaces/episode-info';
import { updateData } from './utility-functions.js';
import fetch from 'node-fetch';

export class AirtableClient {
    private App: admin.app.App;

    constructor(app: admin.app.App){
        this.App = app;
    }

    private correctAirtableObjectPropertyNames(dataObj: IAirtableRecord): IRankingInfo {
      var rData: any = {};
      rData.id = dataObj.id; //Need to put id into one object container
    
      Object.keys(dataObj.fields).forEach((key) => {
        var newKeyName = key.toLowerCase().replace(' ', '_').replace('.','');
        newKeyName = newKeyName.includes('kevin\'s') ? newKeyName.replace('kevin\'s', 'k') : newKeyName;
        newKeyName = newKeyName.includes('peter\'s') ? newKeyName.replace('peter\'s', 'p') : newKeyName;
        rData[newKeyName] = dataObj.fields[key];
      });
    
      return rData as IRankingInfo;
    }

    async updatedAirtableData(apiKeys: IApiKeys, simplecastData: IEpisodeInfo[]) {
      var url = `https://api.airtable.com/v0/appDCLBXIkefciEz4/Ratings?api_key=${apiKeys.airtable_key}`;
      const airtableResponse = await fetch(url, {method: 'get'});
      const airtableResponseData = await airtableResponse.json() as IAirtableResponse;
      var rankings = [];
      for(let i = 0; i < airtableResponseData.records.length; i++) {
        var rData = this.correctAirtableObjectPropertyNames(airtableResponseData.records[i]);
    
        /*Tie episode to ranking*/
        const episodeData = simplecastData.find(ep => rData.episode === `${ep.season.number}-${ep.number}`);
    
        if (episodeData) {
          rData.published_at = episodeData.published_at;
        }
    
        rankings.push(rData);
      }
      updateData(this.App, rankings, 'ratings-data');
      console.log('Ratings successfully imported from AirTable');
    }
}