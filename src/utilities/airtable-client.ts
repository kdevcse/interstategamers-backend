import { IAirtableRecord, IAirtableResponse } from '../interfaces/airtable-api';
import { IEpisodeInfo, IRankingInfo } from '../interfaces/episode-info';
import fetch from 'node-fetch';

export class AirtableClient {

  private AirtableKey: string;
  private AirtableId: string;

  constructor(airtableKey: string, airtableId: string) {
    this.AirtableKey = airtableKey;
    this.AirtableId = airtableId;
  }

  private correctAirtableObjectPropertyNames(dataObj: IAirtableRecord): IRankingInfo {
    var rData: any = {};
    rData.id = dataObj.id; //Need to put id into one object container
  
    Object.keys(dataObj.fields).forEach((key) => {
      var newKeyName = key.toLowerCase().replace(' ', '_').replace('.','');
      newKeyName = newKeyName.includes('kevin\'s') ? newKeyName.replace('kevin\'s', 'k') : newKeyName;
      newKeyName = newKeyName.includes('peter\'s') ? newKeyName.replace('peter\'s', 'p') : newKeyName;
      newKeyName = newKeyName.includes('guest_rating') ? newKeyName.replace('guest', 'g') : newKeyName;
      rData[newKeyName] = dataObj.fields[key];
    });
  
    return rData as IRankingInfo;
  }

  async getAirtableData(simplecastData: IEpisodeInfo[]): Promise<IRankingInfo[]> {
    var url = `https://api.airtable.com/v0/${this.AirtableId}/Ratings?api_key=${this.AirtableKey}`;
    const airtableResponse = await fetch(url, {method: 'get'});
    const airtableResponseData = await airtableResponse.json() as IAirtableResponse;
    var rankings: IRankingInfo[] = [];
    for(let i = 0; i < airtableResponseData.records.length; i++) {
      var rData = this.correctAirtableObjectPropertyNames(airtableResponseData.records[i]);
  
      /*Tie episode to ranking*/
      const episodeData = simplecastData.find(ep => rData.episode === `${ep.season.number}-${ep.number}`);
  
      if (episodeData) {
        rData.published_at = episodeData.published_at;
      }
  
      rankings.push(rData);
    }
    console.log('Ratings successfully imported from AirTable');
    return rankings;
  }
}