import { Component } from "@angular/core";

import { PageBreadcrumbComponent } from "../../../shared/common/page-breadcrumb/page-breadcrumb.component";
import { ComponentCardComponent } from "../../../shared/common/component-card/component-card.component";
import { UiImageComponent } from "@shared/ui/image";
import { UiGridComponent } from "@shared/ui/grid";

const COVER_IMAGE = {
  src: "/images/grid-image/image-01.png",
  alt: "Cover",
};

const TWO_COL_IMAGES = [
  { src: "/images/grid-image/image-02.png", alt: "Image 2" },
  { src: "/images/grid-image/image-03.png", alt: "Image 3" },
];

const THREE_COL_IMAGES = [
  { src: "/images/grid-image/image-04.png", alt: "Image 4" },
  { src: "/images/grid-image/image-05.png", alt: "Image 5" },
  { src: "/images/grid-image/image-06.png", alt: "Image 6" },
];

@Component({
  selector: "app-images",
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    UiImageComponent,
    UiGridComponent,
  ],
  templateUrl: "./images.component.html",
  styles: ``,
})
export class ImagesComponent {
  readonly coverImage = COVER_IMAGE;
  readonly twoColImages = TWO_COL_IMAGES;
  readonly threeColImages = THREE_COL_IMAGES;
}
