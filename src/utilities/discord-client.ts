import fetch from 'node-fetch';
import { IDiscordBodyMessage, DiscordColors } from '../interfaces/discord-api.js';

export class DiscordClient {

    private Webhook: string;

    constructor(webhookId: string, webhookToken: string) {
        this.Webhook = `https://discordapp.com/api/webhooks/${webhookId}/${webhookToken}`;
    }
    
    private buildRequestBody(title: string, message: string, color: number) {
        const jsonBody: IDiscordBodyMessage = {
            embeds: [
                {
                    title: title,
                    description: message,
                    color: color,
                    url: 'https://theigcast.com',
                    image: {
                        url: 'https://raw.githubusercontent.com/kdevcse/interstategamers/master/src/assets/images/main.png',
                        proxy_url: 'https://theigcast.com'
                    }
                }
            ]
        };

        return {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(jsonBody)
        }
    }

    async postToDiscord(title: string, message: string, color: DiscordColors = DiscordColors.Default) {
        const requestBody = this.buildRequestBody(title, message, color);
        await fetch(this.Webhook, requestBody);
    }
}