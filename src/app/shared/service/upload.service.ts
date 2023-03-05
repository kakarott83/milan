import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { FileUpload } from '../../models/files';

//https://www.bezkoder.com/angular-11-file-upload-firebase-storage/

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  title = 'TravelFiles';
  downloadURL: Observable<string>;
  url;
  private fileFolder = '/travel';
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  pushToFile(
    fileUpload: FileUpload,
    fileName: any
  ): Observable<number | undefined> {
    let name = fileName;
    const filePath = `${this.fileFolder}/${name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, fileUpload);

    task
      .snapshotChanges()
      .pipe(
        tap((data) => console.log(task.percentageChanges(), 'TapService')),
        finalize(() => {
          fileRef.getDownloadURL().subscribe((downLoadURL) => {
            fileUpload.url = downLoadURL;
            fileUpload.name = fileUpload.file.name;
            this.saveFileDate(fileUpload);
          });
        })
      )
      .subscribe();

    return task.percentageChanges();
  }

  private saveFileDate(fileUpload: FileUpload): void {
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

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.fileFolder).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.fileFolder);
    storageRef.child(name).delete();
  }
}
