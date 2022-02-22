import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { User } from "./user-model";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  ngOnInit() {
    this.signUpForm = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });
  }
  SignUp() {
    if (this.signUpForm.invalid) {
      return;
    }

    const name = this.signUpForm.get("name").value;
    const email = this.signUpForm.get("email").value;
    const phone = this.signUpForm.get("phone").value;
    const password = this.signUpForm.get("password").value;
    const confirmPassword = this.signUpForm.get("confirmPassword").value;

    this.authService.AddUser(name, email, phone, password, confirmPassword);
  }
}
