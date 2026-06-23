import { Component } from "@angular/core";
import { ModalService } from "../../services/modal.service";

import { UiInputComponent } from "@shared/ui/input";
import { UiModalComponent } from "@shared/ui/modal";
import { UiButtonComponent } from "@shared/ui/button";

@Component({
  selector: "app-user-info-card",
  standalone: true,
  imports: [UiInputComponent, UiButtonComponent, UiModalComponent],
  templateUrl: "./user-info-card.component.html",
  styles: ``,
})
export class UserInfoCardComponent {
  constructor(public modal: ModalService) {}

  isOpen = false;
  openModal() {
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
  }

  user = {
    firstName: "Musharof",
    lastName: "Chowdhury",
    email: "randomuser@pimjo.com",
    phone: "+09 363 398 46",
    bio: "Team Manager",
    social: {
      facebook: "https://www.facebook.com/PimjoHQ",
      x: "https://x.com/PimjoHQ",
      linkedin: "https://www.linkedin.com/company/pimjo",
      instagram: "https://instagram.com/PimjoHQ",
    },
  };

  handleSave() {
    // Handle save logic here
    console.log("Saving changes...");
    this.modal.closeModal();
  }
}
