import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated: boolean = false;
  authSubscription: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService
      .getAuthStatus()
      .subscribe((authStatus: boolean) => {
        this.isUserAuthenticated = authStatus;
      });
  }
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
  Logout() {
    this.authService.Logout();
  }
  
}
