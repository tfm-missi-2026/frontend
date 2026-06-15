import { Component } from "@angular/core";

import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { UiVideoComponent } from "@shared/ui/video";

const SAMPLE_VIDEO = "https://www.youtube.com/embed/dQw4w9WgXcQ";

@Component({
  selector: "app-videos",
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    UiVideoComponent,
  ],
  templateUrl: "./videos.component.html",
  styles: ``,
})
export class VideosComponent {
  readonly sampleVideo = SAMPLE_VIDEO;
}
