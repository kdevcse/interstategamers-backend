import admin from 'firebase-admin';
import { IEpisodeInfo } from '../interfaces/episode-info';
import { ISimplecastApiResponse } from '../interfaces/simplecast-api';
import { updateData } from './utility-functions.js';
import fetch from 'node-fetch';

export class SimplecastClient {

    private SimplecastApiId: string;
    private SimplecastApiKey: string;

    constructor(simplecastApiId: string, simplecastApiKey: string) {
        this.SimplecastApiId = simplecastApiId;
        this.SimplecastApiKey = simplecastApiKey;
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

    async updatedSimplecastData(app: admin.app.App): Promise<IEpisodeInfo[]> {
        var updatedSimplecastData: IEpisodeInfo[] = [];
        var url = `https://api.simplecast.com/podcasts/${this.SimplecastApiId}/episodes`;
        var simplecastData = await this.getSimplecastData(url, this.SimplecastApiKey);
      
        if (!simplecastData)
          return updatedSimplecastData;
      
        Array.prototype.push.apply(updatedSimplecastData, simplecastData.collection);
      
        const total = simplecastData.pages.total;
        var count = 0;
        while (simplecastData && simplecastData.pages.next && count < total) {
          // eslint-disable-next-line no-await-in-loop
          simplecastData = await this.getSimplecastData(simplecastData.pages.next.href, this.SimplecastApiKey);
      
          if (!simplecastData)
            return updatedSimplecastData;
      
          Array.prototype.push.apply(updatedSimplecastData, simplecastData.collection);
          count++;
        }
      
        updateData(app, updatedSimplecastData, 'podcast-data');
        console.log('Episodes successfully imported from Simplecast');
        return updatedSimplecastData;
    }
}