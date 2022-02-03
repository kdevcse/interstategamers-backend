export enum DiscordColors {
    Default = 3447003,
    Success = 4961603,
    Error = 15022389
}

/* API Docs: https://discord.com/developers/docs/resources/webhook#execute-webhook
/* More Fields exist these are just some I thought could be useful */

export interface IDiscordBodyMessage {
    content?: string,
    embeds?: IDiscordEmbedObject[]
    username?: string,
    avatar_url?: string,
    tts?: boolean,
    payload_json?: string,
}

export interface IDiscordEmbedObject {
    title?: string,
    color?: number,
    description?: string,
    timestamp?: Date,
    type?: string
    url?: string,
    image?: IDiscordMediaObject,
    thumbnail?: IDiscordMediaObject,
    video?: IDiscordMediaObject,
    footer?: IDiscordEmbedFooter,
    fields?: IDiscordFieldObject[]
}

export interface IDiscordMediaObject {
    url?: string,
    proxy_url?: string,
    height?: number,
    width?: number
}

export interface IDiscordEmbedFooter {
    text: string,
    icon_url?: string,
    proxy_icon_url?: string
}

export interface IDiscordFieldObject {
    name: string,
    value: string,
    inline?: boolean
}