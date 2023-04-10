import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';

import { FileUpload } from '../../models/files';

//https://www.bezkoder.com/angular-11-file-upload-firebase-storage/

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  title = 'TravelFiles';
  downloadURL: Observable<string>;
  task: AngularFireUploadTask;
  snapshot: Observable<any>;

  url;
  private fileFolder = '/travel';
  constructor(
    private db: AngularFireDatabase,
    private ds: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  pushToFile(
    fileUpload: FileUpload,
    fileName: any,
    travelFolder?: string
  ): Promise<any> {
    let name = fileName;

    if (travelFolder !== '') {
      this.fileFolder = '/' + travelFolder;
    }

    const filePath = `${this.fileFolder}/${name}`;
    /*const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, fileUpload);*/
    const storage = getStorage();
    const uploadRef = ref(storage, fileName);
    const uploadFileRef = ref(storage, filePath);

    return uploadBytes(uploadFileRef, fileUpload.file).then((snapshot) => {
      return getDownloadURL(uploadFileRef);
    });

    // task
    //   .snapshotChanges()
    //   .pipe(
    //     finalize(async () => {
    //       await fileRef.getDownloadURL().subscribe((downLoadURL) => {
    //         fileUpload.url = downLoadURL;
    //         fileUpload.name = fileUpload.file.name;
    //         this.saveFileDate(fileUpload);
    //       });
    //     })
    //   )
    //   .subscribe();

    //return task.percentageChanges();
  }

  public saveFileDate(fileUpload: FileUpload): void {
    this.db.list(this.fileFolder).push(fileUpload);
  }

  getUrl(fileName): Observable<string> {
    const filePath = `${this.fileFolder}/${fileName}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.fileFolder, (ref) => ref.limitToLast(numberItems));
  }

  getList(id: string): Promise<any> {
    const storage = getStorage();
    const listRef = ref(storage, id);

    return listAll(listRef)
      .then(async (res) => {
        let docs = [];
        const { items } = res;
        const urls = await Promise.all(
          items.map((item) => {
            getDownloadURL(item).then((url) => {
              console.log(url);
              let doc = { url: url, name: item.name };
              docs.push(doc);
            });
            //console.log(doc);
          })
        );
        return docs;
      })
      .catch((error) => {
        console.log('keine Items');
        return error;
      });
  }

  deleteFile(file: string) {
    const storage = getStorage();
    const desertRef = ref(storage, file);

    deleteObject(desertRef)
      .then(() => {
        console.log('File gelöscht');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.fileFolder).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.fileFolder);
    storageRef.child(name).delete();
  }
}
