import { Component } from "@angular/core";
import { UiButtonComponent } from "@shared/ui/button";
import { UiModalComponent } from "@shared/ui/modal";

@Component({
  selector: "app-invoice-preview-modal",
  imports: [UiButtonComponent, UiModalComponent],
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
