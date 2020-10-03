import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/class/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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
