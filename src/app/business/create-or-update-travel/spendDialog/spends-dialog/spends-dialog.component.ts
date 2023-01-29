import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-spends-dialog',
  templateUrl: './spends-dialog.component.html',
  styleUrls: ['./spends-dialog.component.scss'],
})
export class SpendsDialogComponent implements OnInit {
  form: FormGroup;
  selectedType: string = '';
  spendTypes = ['Taxi', 'Hotel', 'Auto', 'Sonstiges'];

  constructor(
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SpendsDialogComponent>
  ) {
    console.log(data.start, 'DialogStart');
    this.form = this.fb.group({
      type: [''],
      date: [''],
      value: [''],
      text: [''],
    });
  }

  ngOnInit(): void {}

  submit(form: NgForm) {
    console.log(form, 'Form');
    this.dialogRef.close({
      clicked: 'submit',
      form: form,
    });
  }
}
