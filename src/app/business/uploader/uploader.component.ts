import { Component } from '@angular/core';

//https://fireship.io/lessons/angular-firebase-storage-uploads-multi/
@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
    console.log(this.files);
  }
}
