import { Component } from "@angular/core";

import { CommonBreadcrumbComponent } from "../../../shared/common/page-breadcrumb";
import { CommonComponentCardComponent } from "../../../shared/common/component-card";
import { UiVideoComponent } from "@shared/ui/video";

const SAMPLE_VIDEO = "https://www.youtube.com/embed/dQw4w9WgXcQ";

@Component({
  selector: "app-videos",
  imports: [
    CommonBreadcrumbComponent,
    CommonComponentCardComponent,
    UiVideoComponent,
  ],
  templateUrl: "./videos.component.html",
  styles: ``,
})
export class VideosComponent {
  readonly sampleVideo = SAMPLE_VIDEO;
}
