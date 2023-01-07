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
    @Inject(MAT_DIALOG_DATA) data: { message: string },
    public dialogRef: MatDialogRef<SpendsDialogComponent>
  ) {
    this.form = this.fb.group({
      type: [''],
      date: [''],
      value: [''],
      text: [''],
    });
  }

  ngOnInit(): void {
    // this.form.valueChanges.subscribe((f) => {
    //   if (f.value) {
    //     this.form.patchValue(
    //       {
    //         value: this.currencyPipe.transform(
    //           f.value, //.replace(/\D/g, '').replace(/^0+/, ''),
    //           'EUR',
    //           'symbol',
    //           '1.0-0'
    //         ),
    //       },
    //       { emitEvent: false }
    //     );
    //   }
    // });
  }

  submit(form: NgForm) {
    console.log(form, 'Form');
    this.dialogRef.close({
      clicked: 'submit',
      form: form,
    });
  }
}
