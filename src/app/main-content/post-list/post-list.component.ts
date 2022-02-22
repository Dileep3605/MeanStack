import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { Posts } from "../post-model";
import { PostsService } from "src/app/services/posts-service";


@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(
    public postService: PostsService,
    private router: Router,
    private authService: AuthService
  ) {}
  posts: Posts[] = [];
  subscription: Subscription;
  isLoader: boolean = true;
  pageSize: number = 3;
  userId: string;
  currentPage: number = 1;
  totalPost: number = 100;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  isUserAuthValid: boolean = false;
  ngOnInit() {
    this.postService.GetPosts(this.pageSize, this.currentPage);
    this.userId = this.authService.getUserId();
    this.subscription = this.postService
      .GetUpdatedPostData()
      .subscribe((postData: { posts: Posts[]; postCount: number }) => {
        this.posts = postData.posts;
        this.isLoader = false;
        console.table(this.posts);
      });
      this.authService.getAuthStatus().subscribe((authStatus: boolean)=>{
        this.isUserAuthValid = authStatus;
        this.userId = this.authService.getUserId();
      })
  }
  DeletePost(id: string, index: number) {
    this.isLoader = true;
    this.postService.DeletePost(id, index).subscribe((postData) => {
      this.postService.GetPosts(this.pageSize, this.currentPage);
    });
  }
  EditPost(postId: string) {
    this.router.navigate([`editPost/${postId}`]);
  }

  onPageChange(pageData: PageEvent) {
    this.isLoader = true;
    this.pageSize = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postService.GetPosts(this.pageSize, this.currentPage);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
