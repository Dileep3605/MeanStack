import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  isAuthValid = false;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    this.authService.getAuthStatus().subscribe((authStatus: boolean) => {
      this.isAuthValid = authStatus;
      if (!this.isAuthValid) {
          this.router.navigate(['/login']);
      }
    });
    return this.isAuthValid;
  }
}
