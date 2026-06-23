import { Component } from "@angular/core";
import { ModalService } from "../../../services/modal.service";

import { UiModalComponent } from "@shared/ui/modal";
import { UiButtonComponent } from "@shared/ui/button";
import { UiInputComponent } from "@shared/ui/input";

@Component({
  selector: "app-user-meta-card",
  imports: [UiModalComponent, UiButtonComponent, UiInputComponent],
  templateUrl: "./user-meta-card.component.html",
  styles: ``,
})
export class UserMetaCardComponent {
  constructor(public modal: ModalService) {}

  isOpen = false;
  openModal() {
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
  }

  // Example user data (could be made dynamic)
  user = {
    firstName: "Musharof",
    lastName: "Chowdhury",
    role: "Team Manager",
    location: "Arizona, United States",
    avatar: "/images/user/owner.jpg",
    social: {
      facebook: "https://www.facebook.com/PimjoHQ",
      x: "https://x.com/PimjoHQ",
      linkedin: "https://www.linkedin.com/company/pimjo",
      instagram: "https://instagram.com/PimjoHQ",
    },
    email: "randomuser@pimjo.com",
    phone: "+09 363 398 46",
    bio: "Team Manager",
  };

  handleSave() {
    // Handle save logic here
    console.log("Saving changes...");
    this.modal.closeModal();
  }
}
