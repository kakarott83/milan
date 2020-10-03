import { Component, OnInit } from '@angular/core';
import { Form } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from 'src/app/class/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();

  constructor(
    private router: Router,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    //console.log(this.user);
    this.router.navigate([`../dashboard`])
  }

}
