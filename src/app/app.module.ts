import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { MaterialModule } from "./modules/material.module";
import { MainContentComponent } from "./main-content/main-content.component";
import { LeftNavComponent } from "./left-nav/left-nav.component";
import { AddPostComponent } from "./main-content/add-post/add-post.component";
import { PostListComponent } from "./main-content/post-list/post-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthInterceptor } from "./services/auth-interceptor";
import { AuthGuard } from "./services/auth.guard";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainContentComponent,
    LeftNavComponent,
    AddPostComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
