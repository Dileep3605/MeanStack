import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  Login() {
    if (this.loginForm.invalid) {
      return;
    }
    const username = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.auth.ValidateUser(username, password);
  }
}
