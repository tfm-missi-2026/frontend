import { Component } from "@angular/core";
import { ButtonComponent } from "../../../ui/button/button.component";
import { UiModalComponent } from "@shared/ui/modal";

@Component({
  selector: "app-invoice-preview-modal",
  imports: [ButtonComponent, UiModalComponent],
  templateUrl: "./invoice-preview-modal.component.html",
  styles: ``,
})
export class InvoicePreviewModalComponent {
  isOpen = false;

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
}
