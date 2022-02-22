import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddPostComponent } from "./main-content/add-post/add-post.component";
import { PostListComponent } from "./main-content/post-list/post-list.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./services/auth.guard";

const routes: Routes = [
  {
    path: "create",
    component: AddPostComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "editPost/:postId",
    component: AddPostComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "",
    component: PostListComponent,
  },
  {
    path: "**",
    pathMatch: "full",
    component: PostListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
