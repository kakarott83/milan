import { Component, OnInit } from '@angular/core';
import { RadioControlValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/class/user';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  user = new User();

  constructor(
    private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.user);
    this.router.navigate([`../login`]);
  }

}
