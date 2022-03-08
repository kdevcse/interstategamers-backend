

import admin from 'firebase-admin';
import { applicationDefault } from "firebase-admin/app";
import { IEpisodeInfo, IRankingInfo } from '../interfaces/episode-info';

export enum CollectionType {
  EPISODE = "podcast-data",
  RATINGS = "ratings-data"
}

export class FirebaseClient {
  public App: admin.app.App;

  constructor() {
    this.App = admin.initializeApp({credential: applicationDefault()});
  }

  async updateData(data: IEpisodeInfo[] | IRankingInfo[], collection: CollectionType) {
    if (!data)
      return;
    
    var collectionRef = this.App.firestore().collection(collection);
    
    await collectionRef.get().then((c) => {
      for (let i = 0; i < data.length; i++) {
        if (!c.docs.some(doc => doc.id === data[i].id)) {
          data[i].id ? collectionRef.doc(data[i].id).set(data[i]) : collectionRef.add(data[i]);
        } else {
          collectionRef.doc(data[i].id).update(data[i]);
        }
      }
      return;
    }).catch((error) => {
      console.log(`Error updating data: ${error}`);
    });
  }
}