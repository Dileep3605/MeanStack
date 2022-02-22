import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Posts } from "../main-content/post-model";

@Injectable({ providedIn: "root" })
export class PostsService {
  posts: Posts[] = [];
  postUpdated = new Subject<{ posts: Posts[]; postCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}

  GetPosts(perPageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${perPageSize}&page=${currentPage}`;
    let url = "http://localhost:3000/api/posts" + queryParams;
    this.http
      .get<{ message: string; posts: any; postCount: number }>(url)
      .pipe(
        map((postData) => {
          return {
            postsData: postData.posts.map((post) => {
              return {
                title: post.title,
                description: post.description,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),

            postsCount: postData.postCount,
          };
        })
      )
      .subscribe(
        (transformedPost) => {
          this.posts = transformedPost.postsData;
          console.log(this.posts);
          this.postUpdated.next({
            posts: [...this.posts],
            postCount: transformedPost.postsCount,
          });
        },
        (err) => {
          console.log(err);
        },
        () => {}
      );
  }
  GetUpdatedPostData() {
    return this.postUpdated.asObservable();
  }
  AddPost(title: string, description: string, image: File) {
    let url = "http://localhost:3000/api/posts";
    const postData = new FormData();
    postData.append("title", title);
    postData.append("description", description);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Posts }>(url, postData)
      .subscribe((response) => {
        this.router.navigate(["/"]);
      });
  }

  GetEditedPost(postId: string) {
    let url = "http://localhost:3000/api/posts/" + postId;
    return this.http.get<{ message: string; post: Posts }>(url);
  }
  UpdatePost(
    id: string,
    title: string,
    description: string,
    image: File | string
  ) {
    let formData: Posts | FormData;
    if (typeof image === "object") {
      formData = new FormData();
      formData.append("id", id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", image);
    } else {
      formData = {
        id: id,
        title: title,
        description: description,
        imagePath: image,
        creator: null,
      };
    }

    let url = "http://localhost:3000/api/posts/" + id;
    return this.http.put<{ message: string }>(url, formData);
  }
  DeletePost(postId: string, index: number) {
    let url = "http://localhost:3000/api/posts/" + postId;
    return this.http.delete(url);
  }
}
