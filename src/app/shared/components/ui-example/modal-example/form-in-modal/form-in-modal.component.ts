import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { UiModalComponent } from "@shared/ui/modal";
import { UiButtonComponent } from "@shared/ui/button";
import { ComponentCardComponent } from "../../../common/component-card/component-card.component";
import { LabelComponent } from "../../../form/label/label.component";
import { InputFieldComponent } from "../../../form/input/input-field.component";

@Component({
  selector: "app-form-in-modal",
  imports: [
    CommonModule,
    UiModalComponent,
    UiButtonComponent,
    ComponentCardComponent,
    LabelComponent,
    InputFieldComponent,
  ],
  templateUrl: "./form-in-modal.component.html",
  styles: ``,
})
export class FormInModalComponent {
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
