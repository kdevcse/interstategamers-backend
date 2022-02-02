import admin from 'firebase-admin';

export async function updateData(app: admin.app.App, data: any[], collection: string) {
    if (!data)
      return;
  
    var collectionRef = app.firestore().collection(collection);
    
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
  