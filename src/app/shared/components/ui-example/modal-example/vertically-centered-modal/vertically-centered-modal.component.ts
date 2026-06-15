import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { UiModalComponent } from "@shared/ui/modal";
import { ComponentCardComponent } from "../../../common/component-card/component-card.component";
import { ButtonComponent } from "../../../ui/button/button.component";

@Component({
  selector: "app-vertically-centered-modal",
  imports: [
    CommonModule,
    UiModalComponent,
    ComponentCardComponent,
    ButtonComponent,
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
