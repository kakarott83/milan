import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-spends-dialog',
  templateUrl: './spends-dialog.component.html',
  styleUrls: ['./spends-dialog.component.scss'],
})
export class SpendsDialogComponent {
  form: FormGroup;
  selectedType: string = '';
  spendTypes = ['Taxi', 'Hotel', 'Auto', 'Sonstiges'];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: { message: string },
    public dialogRef: MatDialogRef<SpendsDialogComponent>
  ) {
    this.form = this.fb.group({
      type: [''],
      date: [''],
      value: [0],
      text: [''],
    });
  }

  submit(form: NgForm) {
    console.log(form, 'Form');
    this.dialogRef.close({
      clicked: 'submit',
      form: form,
    });
  }
}
