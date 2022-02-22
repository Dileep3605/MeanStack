import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Posts } from "../post-model";
import { PostsService } from "src/app/services/posts-service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: "app-add-post",
  templateUrl: "./add-post.component.html",
  styleUrls: ["./add-post.component.scss"]
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  postId: string;
  mode: string = "add";
  post: Posts;
  imagePreview: string;
  @ViewChild("post", { static: true }) postFormValue;
  constructor(
    private fb: FormBuilder,
    public postService: PostsService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      postTitle: ["", Validators.required],
      postImage: [null, [Validators.required]],
      postContent: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.GetPostId();
  }

  GetPostId() {
    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.postService.GetEditedPost(this.postId).subscribe(
          response => {
            this.post = response.post;
          },
          () => {},
          () => {
            this.postForm.setValue({
              postTitle: this.post.title,
              postContent: this.post.description,
              postImage: this.post.imagePath
            });
            this.imagePreview = this.post.imagePath;
          }
        );
      } else {
        this.mode = "add";
        this.postId = null;
      }
    });
  }

  ChangePostImage(event: Event) {
    debugger;
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({
      postImage: file
    });
    this.postForm.get("postImage").updateValueAndValidity();
    let fr = new FileReader();
    fr.onload = () => {
      this.imagePreview = fr.result as string;
    };
    fr.readAsDataURL(file);
  }

  AddPost() {
    if (this.postForm.valid) {
      if (this.mode === "add") {
        const post = {
          title: this.postForm.get("postTitle").value,
          description: this.postForm.get("postContent").value,
          image: this.postForm.get("postImage").value
        };
        this.postService.AddPost(post.title, post.description, post.image);
        this.postFormValue.resetForm();
      }
      if (this.mode === "edit") {
        debugger;
        this.postService
          .UpdatePost(
            this.postId,
            this.postForm.get("postTitle").value,
            this.postForm.get("postContent").value,
            this.postForm.get("postImage").value
          )
          .subscribe(response => {
            this.router.navigate(["/"]);
          });
      }
    }
  }
  ResetAddPostForm() {
    this.postForm.setValue({
      postTitle: "",
      postContent: "",
      postImage: null
    });
  }
}
