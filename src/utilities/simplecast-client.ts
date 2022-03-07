import { IEpisodeInfo } from '../interfaces/episode-info';
import { ISimplecastApiResponse } from '../interfaces/simplecast-api';
import fetch from 'node-fetch';

export class SimplecastClient {

    private SimplecastApiId: string;
    private SimplecastApiKey: string;

    constructor(simplecastApiId: string, simplecastApiKey: string) {
        this.SimplecastApiId = simplecastApiId;
        this.SimplecastApiKey = simplecastApiKey;
    }

    private async requestSimplecastData (url: string, podKey: string): Promise<ISimplecastApiResponse> {
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

    async getSimplecastData(): Promise<IEpisodeInfo[]> {
        var updatedSimplecastData: IEpisodeInfo[] = [];
        var url = `https://api.simplecast.com/podcasts/${this.SimplecastApiId}/episodes`;
        var simplecastData = await this.requestSimplecastData(url, this.SimplecastApiKey);
      
        if (!simplecastData)
          return updatedSimplecastData;
      
        Array.prototype.push.apply(updatedSimplecastData, simplecastData.collection);
      
        const total = simplecastData.pages.total;
        var count = 0;
        while (simplecastData && simplecastData.pages.next && count < total) {
          // eslint-disable-next-line no-await-in-loop
          simplecastData = await this.requestSimplecastData(simplecastData.pages.next.href, this.SimplecastApiKey);
      
          if (!simplecastData)
            return updatedSimplecastData;
      
          Array.prototype.push.apply(updatedSimplecastData, simplecastData.collection);
          count++;
        }
      
        console.log('Episodes successfully imported from Simplecast');
        return updatedSimplecastData;
    }
}