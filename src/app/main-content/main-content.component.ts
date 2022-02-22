import { Component, OnInit, Input } from "@angular/core";
import { Posts } from "./post-model";
@Component({
  selector: "app-main-content",
  templateUrl: "./main-content.component.html",
  styleUrls: ["./main-content.component.scss"]
})
export class MainContentComponent implements OnInit {
  allPosts: Posts[] = [];
  constructor() {}

  ngOnInit() {}
  newPost(event) {
    this.allPosts.push(event);
  }
}
