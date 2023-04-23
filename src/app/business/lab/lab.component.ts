import { map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FileUpload } from 'src/app/models/files';
import { MailService } from 'src/app/shared/service/mail.service';

import { Component, OnInit } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';

import { UploadService } from '../../shared/service/upload.service';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss'],
})
export class LabComponent implements OnInit {
  fileInfo: string;
  file: File = null;
  baseUrl = 'travel';
  progress = 0;
  myUrl;
  myFiles: any[];
  selectedFiles?: FileList;
  currentFileUpload: FileUpload;
  percentage = 0;
  token: any;

  constructor(
    private uploadService: UploadService,
    private mailService: MailService
  ) {}

  ngOnInit(): void {
    console.log('Test');
    this.uploadService
      .getFiles(10)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            key: c.payload.key,
            ...c.payload.val(),
          }))
        ),
        tap((files) => console.log(files, 'Tap'))
      )
      .subscribe((fileUploads) => {
        this.myFiles = fileUploads;
      });
  }

  onFileSelect(event) {
    this.file = event.target.files[0];
    this.selectedFiles = event.target.files;
    console.log(this.file);

    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;

      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }

      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    const uploadfile = this.file;
    this.fileInfo = `${uploadfile.name} (${formatBytes(uploadfile.size)})`;
  }

  upload() {
    const fileName = Date.now();
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushToFile(this.currentFileUpload, fileName);
        /*.subscribe(
            (percentage) => {
              console.log(percentage, 'percentage');
              this.percentage = Math.round(percentage ? percentage : 0);
            },
            (error) => {
              console.log(error);
            }
          );*/
      }
    }
  }

  sendMail() {}

  getToken() {
    this.mailService
      .getToken()
      .then((response) => {
        this.token = response.token;
      })
      .catch((error) => {
        console.log(error, 'ErrorUI');
      });
  }
}
