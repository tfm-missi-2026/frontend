import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UiButtonComponent } from "@shared/ui/button";
import { UiCardComponent } from "@shared/ui/card";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { IconEditPencilComponent } from "@shared/icons";

import { UserProfilePersonalInfo, UserProfileSocialLinks } from "./user-profile.types";

const SAMPLE_INFO: UserProfilePersonalInfo = {
  firstName: "Musharof",
  lastName: "Chowdhury",
  email: "randomuser@pimjo.com",
  phone: "+09 363 398 46",
  bio: "Team Manager",
};

const SAMPLE_SOCIAL: UserProfileSocialLinks = {
  facebook: "https://www.facebook.com/PimjoHQ",
  x: "https://x.com/PimjoHQ",
  linkedin: "https://www.linkedin.com/company/pimjo",
  instagram: "https://instagram.com/PimjoHQ",
};

/**
 * `UserProfileInfoCard`
 * ---------------------
 * Tarjeta de información personal del perfil del usuario. Renderiza
 * un grid de label/value (First Name, Last Name, Email, Phone, Bio)
 * y un botón "Edit" que abre un modal con el formulario de edición
 * (incluye los social links y los campos personales).
 *
 * Construida sobre primitives del design system (`UiCard`, `UiFlex`,
 * `UiHeader`, `UiLabel`, `UiButton`, `UiModal`).
 */
@Component({
  selector: "UserProfileInfoCard",
  standalone: true,
  imports: [
    UiButtonComponent,
    UiCardComponent,
    UiFlexComponent,
    UiGridComponent,
    UiHeaderComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiCard variant="default" padding="md">
      <UiFlex
        direction="column"
        alignItems="stretch"
        gap="1.5rem"
        className="lg:flex-row! lg:items-start! lg:justify-between!"
      >
        <div class="min-w-0">
          <UiHeader
            [level]="4"
            text="Personal Information"
            className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6"
          />

          <UiGrid [columns]="2" breakpoint="lg" gap="gap-4 lg:gap-7 2xl:gap-x-32" ariaLabel="Personal information fields">
            <UiFlex direction="column" gap="0.5rem">
              <UiLabel
                as="p"
                type="bodyXs"
                color="textWeak"
                text="First Name"
                [wrapText]="true"
              />
              <UiLabel
                as="p"
                type="bodyS"
                color="textStrong"
                [wrapText]="true"
              >{{ info().firstName }}</UiLabel>
            </UiFlex>
            <UiFlex direction="column" gap="0.5rem">
              <UiLabel
                as="p"
                type="bodyXs"
                color="textWeak"
                text="Last Name"
                [wrapText]="true"
              />
              <UiLabel
                as="p"
                type="bodyS"
                color="textStrong"
                [wrapText]="true"
              >{{ info().lastName }}</UiLabel>
            </UiFlex>
            <UiFlex direction="column" gap="0.5rem">
              <UiLabel
                as="p"
                type="bodyXs"
                color="textWeak"
                text="Email address"
                [wrapText]="true"
              />
              <UiLabel
                as="p"
                type="bodyS"
                color="textStrong"
                [wrapText]="true"
              >{{ info().email }}</UiLabel>
            </UiFlex>
            <UiFlex direction="column" gap="0.5rem">
              <UiLabel
                as="p"
                type="bodyXs"
                color="textWeak"
                text="Phone"
                [wrapText]="true"
              />
              <UiLabel
                as="p"
                type="bodyS"
                color="textStrong"
                [wrapText]="true"
              >{{ info().phone }}</UiLabel>
            </UiFlex>
            <UiFlex direction="column" gap="0.5rem">
              <UiLabel
                as="p"
                type="bodyXs"
                color="textWeak"
                text="Bio"
                [wrapText]="true"
              />
              <UiLabel
                as="p"
                type="bodyS"
                color="textStrong"
                [wrapText]="true"
              >{{ info().bio }}</UiLabel>
            </UiFlex>
          </UiGrid>
        </div>

        <UiButton
          variant="secondary"
          [LeftIcon]="editIcon"
          [iconProps]="{ size: 18 }"
          className="w-full lg:w-auto!"
          (click)="openModal()"
        >
          Edit
        </UiButton>
      </UiFlex>
    </UiCard>

    <UiModal
      [isOpen]="isOpen()"
      (close)="closeModal()"
      className="max-w-175 m-4"
    >
      <div class="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div class="px-2 pr-14">
          <UiHeader
            [level]="4"
            text="Edit Personal Information"
            className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90"
          />
          <UiLabel
            as="p"
            type="bodyS"
            color="textWeak"
            text="Update your details to keep your profile up-to-date."
            [wrapText]="true"
            className="mb-6 lg:mb-7"
          />
        </div>
        <form class="flex flex-col" (submit)="$event.preventDefault(); handleSave()">
          <div class="custom-scrollbar h-112.5 overflow-y-auto px-2 pb-3">
            <div>
              <UiHeader
                [level]="5"
                text="Social Links"
                className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6"
              />
              <UiGrid [columns]="2" breakpoint="lg" gap="gap-x-6 gap-y-5" ariaLabel="Social links form fields">
                <UiInput labelText="Facebook" type="text" [value]="social().facebook" />
                <UiInput labelText="X.com" type="text" [value]="social().x" />
                <UiInput labelText="Linkedin" type="text" [value]="social().linkedin" />
                <UiInput labelText="Instagram" type="text" [value]="social().instagram" />
              </UiGrid>
            </div>
            <div class="mt-7">
              <UiHeader
                [level]="5"
                text="Personal Information"
                className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6"
              />
              <UiGrid [columns]="2" breakpoint="lg" gap="gap-x-6 gap-y-5" ariaLabel="Personal information form fields">
                <UiInput className="col-span-2 lg:col-span-1" labelText="First Name" type="text" [value]="info().firstName" />
                <UiInput className="col-span-2 lg:col-span-1" labelText="Last Name" type="text" [value]="info().lastName" />
                <UiInput className="col-span-2 lg:col-span-1" labelText="Email Address" type="text" [value]="info().email" />
                <UiInput className="col-span-2 lg:col-span-1" labelText="Phone" type="text" [value]="info().phone" />
                <UiInput className="col-span-2" labelText="Bio" type="text" [value]="info().bio" />
              </UiGrid>
            </div>
          </div>
          <UiFlex
            direction="row"
            alignItems="center"
            gap="0.75rem"
            className="px-2 mt-6 lg:justify-end"
          >
            <UiButton variant="secondary" [compact]="true" (click)="closeModal()">
              Close
            </UiButton>
            <UiButton [compact]="true" (click)="handleSave()">
              Save Changes
            </UiButton>
          </UiFlex>
        </form>
      </div>
    </UiModal>
  `,
})
export class UserProfileInfoCardComponent {
  protected readonly info = signal<UserProfilePersonalInfo>(SAMPLE_INFO);
  protected readonly social = signal<UserProfileSocialLinks>(SAMPLE_SOCIAL);
  protected readonly isOpen = signal(false);
  readonly editIcon = IconEditPencilComponent;

  protected openModal(): void {
    this.isOpen.set(true);
  }

  protected closeModal(): void {
    this.isOpen.set(false);
  }

  protected handleSave(): void {
    this.closeModal();
  }
}
