import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IEpisodeInfo, IRankingInfo } from '../interfaces/episode-info.js';
import { SupabaseEpisodes, SupabaseRatingsOverall, SupabaseTables } from '../interfaces/supabase.js';

export class MySupabaseClient {

  Client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.Client = createClient(supabaseUrl, supabaseAnonKey);
  }

  private async upsertRatingsTable(rating: IRankingInfo, simplecastId: string): Promise<number> {
    
    const dataToUpsert: SupabaseRatingsOverall = {
      id: rating.id,
      gameplay: rating.gameplay,
      audio: rating.audio,
      visuals: rating.visuals,
      aesthetics: rating.aesthetics,
      content: rating.content,
      ig_score: rating.ig_score,
      game: rating.game,
      platform: rating.platform,
      year: rating.year,
      k_gameplay: rating.k_gameplay,
      k_audio: rating.k_audio,
      k_visuals: rating.k_visuals,
      k_aesthetics: rating.k_aesthetics,
      k_content: rating.k_content,
      k_rating: rating.k_rating,
      p_gameplay: rating.p_gameplay,
      p_audio: rating.p_audio,
      p_visuals: rating.p_visuals,
      p_aesthetics: rating.p_aesthetics,
      p_content: rating.p_content,
      p_rating: rating.p_rating,
      g_gameplay: rating.g_gameplay,
      g_audio: rating.g_audio,
      g_visuals: rating.g_visuals,
      g_aesthetics: rating.g_aesthetics,
      g_content: rating.g_content,
      g_rating: rating.g_rating,
      guest: rating.guest,
      ign: rating.ign,
      metacritic: rating.metacritic,
      simplecast_id: simplecastId
    };
    
    const { data, error } = await this.Client.from(SupabaseTables.RATINGS).upsert([dataToUpsert], { ignoreDuplicates: true });

    if (error) {
      console.error(error);
      throw Error(`Error upserting ratings for overall: ${error.message}`);
    }

    return data[0]?.id as number;
  }

  async updateTables(episodes: IEpisodeInfo[], ratings: IRankingInfo[]) {

    for(let episode of episodes) {
      const associatedRating = ratings.find(rating => rating.episode === `${episode.season.number}-${episode.number}`);
      let ratingsTableId: number;

      if (associatedRating) {
        ratingsTableId = await this.upsertRatingsTable(associatedRating, episode.id);
      }

      const { error } = await this.Client.from(SupabaseTables.SIMPLECAST_EPISODES).upsert([{
        simplecast_id: episode.id,
        title: episode.title,
        description: episode.description,
        season: episode.season.number,
        number: episode.number,
        href: episode.href,
        guid: episode.guid,
        published_at: episode.published_at,
        updated_at: episode.updated_at,
        type: episode.type,
        status: episode.status,
        is_hidden: episode.is_hidden,
        image_url: episode.image_url,
        image_path: episode.image_path,
        days_since_release: episode.days_since_release,
        enclosure_url: episode.enclosure_url,
        ratings_id: ratingsTableId
      } as SupabaseEpisodes], { ignoreDuplicates: true });

      if (error) {
        console.error(error);
        throw Error(`Error upserting episodes: ${error.message}`);
      }
    }
  }
}