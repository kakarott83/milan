import { ToastrService } from 'ngx-toastr';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  public showSuccess(titel: string, text: string): void {
    this.toastr.success(text, titel, {
      progressAnimation: 'increasing',
      timeOut: 3000,
    });
  }

  public showInfo(titel: string, text: string): void {
    this.toastr.info(text, titel, {
      progressAnimation: 'increasing',
      timeOut: 3000,
    });
  }

  public showWarning(titel: string, text: string): void {
    this.toastr.warning(text, titel, {
      progressAnimation: 'increasing',
      timeOut: 3000,
    });
  }

  public showError(titel: string, text: string): void {
    this.toastr.error(text, titel, {
      progressAnimation: 'increasing',
      timeOut: 3000,
    });
  }
}
