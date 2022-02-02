import admin from 'firebase-admin';
import { IApiKeys } from '../interfaces/api-keys';
import { IEpisodeInfo } from '../interfaces/episode-info';
import { ISimplecastApiResponse } from '../interfaces/simplecast-api';
import { updateData } from './utility-functions.js';
import fetch from 'node-fetch';

export class SimplecastClient {

    private App: admin.app.App;

    constructor(app: admin.app.App) {
        this.App = app;
    }

    private async getSimplecastData (url: string, podKey: string): Promise<ISimplecastApiResponse> {
        try {
            const header = { 'authorization' : `Bearer ${podKey}` };
            const res = await fetch(url, {
                method: 'get',
                headers: header
            });
            const data = res.json();
            return data as Promise<ISimplecastApiResponse>;
        } catch (error) {
            console.log(`Error making Simplecast request: ${error}`);
            return null;
        }
    }    

    async updatedSimplecastData(apiKeys: IApiKeys): Promise<IEpisodeInfo[]> {
        var updatedSimplecastData: IEpisodeInfo[] = [];
        var url = `https://api.simplecast.com/podcasts/${apiKeys.simplecast_id}/episodes`;
        var simplecastData = await this.getSimplecastData(url, apiKeys.simplecast_key);
      
        if (!simplecastData)
          return updatedSimplecastData;
      
        Array.prototype.push.apply(updatedSimplecastData, simplecastData.collection);
      
        const total = simplecastData.pages.total;
        var count = 0;
        while (simplecastData && simplecastData.pages.next && count < total) {
          // eslint-disable-next-line no-await-in-loop
          simplecastData = await this.getSimplecastData(simplecastData.pages.next.href, apiKeys.simplecast_key);
      
          if (!simplecastData)
            return updatedSimplecastData;
      
          Array.prototype.push.apply(updatedSimplecastData, simplecastData.collection);
          count++;
        }
      
        updateData(this.App, updatedSimplecastData, 'podcast-data');
        console.log('Episodes successfully imported from Simplecast');
        return updatedSimplecastData;
    }
}