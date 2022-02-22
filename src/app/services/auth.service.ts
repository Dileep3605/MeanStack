import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../auth/signup/user-model";
import { Subject, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  private authToken: string;
  private authStatusListener = new BehaviorSubject<boolean>(false);
  tokenExpireTime: any;
  userId: string;
  constructor(private _http: HttpClient, private router: Router) {}

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }
  autoAuthData() {
    const isAutoAuth = this.getAuthData();
    const now = new Date();
    const expirationIn = isAutoAuth.expirationDate.getTime() - now.getTime();
    if (expirationIn > 0) {
      this.authToken = isAutoAuth.token;
      this.AuthExpirationTime(expirationIn / 1000);
      this.userId = isAutoAuth.userId;
      this.authStatusListener.next(true);
    }
  }
  getToken() {
    return this.authToken;
  }
  getUserId() {
    return this.userId;
  }
  AddUser(
    name: string,
    email: string,
    phone: number,
    password: string,
    confirmPassword
  ) {
    const userDetail: User = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      confirmPassword: confirmPassword,
    };
    const url = "http://localhost:3000/api/user/signup";
    this._http
      .post<{ message: string; userData: User; isUserCreated: boolean }>(
        url,
        userDetail
      )
      .subscribe((resonse) => {
        if (resonse.isUserCreated) {
          this.router.navigate(["/login"]);
        }
      });
    {
    }
  }

  AuthExpirationTime(expireTime: number) {
    setTimeout(() => {
      this.Logout();
    }, expireTime * 1000);
  }

  ValidateUser(email: string, password: string) {
    const loginDetails = {
      username: email,
      password: password,
    };
    const url = "http://localhost:3000/api/user/login";
    this._http
      .post<{ token: string; expireTime: number; userId: string }>(
        url,
        loginDetails
      )
      .subscribe((response) => {
        const token = response.token;
        this.authToken = token;
        if (this.authToken) {
          const expireTime = response.expireTime;
          this.tokenExpireTime = expireTime;
          this.AuthExpirationTime(this.tokenExpireTime);
          this.userId = response.userId;
          const now = new Date();
          const expireTokenDate = new Date(
            now.getTime() + this.tokenExpireTime * 1000
          );
          this.storeAuthData(this.authToken, expireTokenDate, this.userId);
          console.log(expireTokenDate);
          this.authStatusListener.next(true);
          this.router.navigate(["/"]);
        }
      });
  }

  private storeAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
  }
  getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
  Logout() {
    this.authToken = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenExpireTime * 1000);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(["/"]);
  }
}
