import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { UiModalComponent } from "@shared/ui/modal";
import { UiButtonComponent } from "@shared/ui/button";
import { ComponentCardComponent } from "../../../common/component-card/component-card.component";

@Component({
  selector: "app-vertically-centered-modal",
  imports: [
    CommonModule,
    UiModalComponent,
    UiButtonComponent,
    ComponentCardComponent,
  ],
  templateUrl: "./vertically-centered-modal.component.html",
  styles: ``,
})
export class VerticallyCenteredModalComponent {
  isOpen = false;

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  handleSave() {
    console.log("Saving changes...");
    this.closeModal();
  }
}
