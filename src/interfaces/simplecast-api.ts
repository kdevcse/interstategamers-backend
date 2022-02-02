import { IEpisodeInfo } from "./episode-info";

export interface ISimplecastApiResponse {
    collection: IEpisodeInfo[],
    pages: {
        total: number,
        next: {
            href: string
        }
    }
}