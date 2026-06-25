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

import { UserProfileAddress } from "./user-profile.types";

const SAMPLE_ADDRESS: UserProfileAddress = {
  country: "United States.",
  cityState: "Phoenix, Arizona, United States.",
  postalCode: "ERT 2489",
  taxId: "AS4568384",
};

/**
 * `UserProfileAddressCard`
 * ------------------------
 * Tarjeta de dirección del perfil del usuario. Renderiza un grid de
 * label/value (Country, City/State, Postal Code, TAX ID) y un botón
 * "Edit" que abre un modal con el formulario de edición.
 *
 * Construida sobre primitives del design system (`UiCard`, `UiFlex`,
 * `UiHeader`, `UiLabel`, `UiButton`, `UiModal`).
 */
@Component({
  selector: "UserProfileAddressCard",
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
            text="Address"
            className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6"
          />

          <UiGrid [columns]="2" breakpoint="lg" gap="gap-4 lg:gap-7 2xl:gap-x-32" ariaLabel="Address fields">
            <UiFlex direction="column" gap="0.5rem">
              <UiLabel
                as="p"
                type="bodyXs"
                color="textWeak"
                text="Country"
                [wrapText]="true"
              />
              <UiLabel
                as="p"
                type="bodyS"
                color="textStrong"
                [wrapText]="true"
              >{{ address().country }}</UiLabel>
            </UiFlex>
            <UiFlex direction="column" gap="0.5rem">
              <UiLabel
                as="p"
                type="bodyXs"
                color="textWeak"
                text="City/State"
                [wrapText]="true"
              />
              <UiLabel
                as="p"
                type="bodyS"
                color="textStrong"
                [wrapText]="true"
              >{{ address().cityState }}</UiLabel>
            </UiFlex>
            <UiFlex direction="column" gap="0.5rem">
              <UiLabel
                as="p"
                type="bodyXs"
                color="textWeak"
                text="Postal Code"
                [wrapText]="true"
              />
              <UiLabel
                as="p"
                type="bodyS"
                color="textStrong"
                [wrapText]="true"
              >{{ address().postalCode }}</UiLabel>
            </UiFlex>
            <UiFlex direction="column" gap="0.5rem">
              <UiLabel
                as="p"
                type="bodyXs"
                color="textWeak"
                text="TAX ID"
                [wrapText]="true"
              />
              <UiLabel
                as="p"
                type="bodyS"
                color="textStrong"
                [wrapText]="true"
              >{{ address().taxId }}</UiLabel>
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
            text="Edit Address"
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
          <div class="px-2 overflow-y-auto custom-scrollbar">
            <UiGrid [columns]="2" breakpoint="lg" gap="gap-x-6 gap-y-5" ariaLabel="Address form fields">
              <UiInput labelText="Country" type="text" [value]="address().country" />
              <UiInput labelText="City/State" type="text" [value]="address().cityState" />
              <UiInput labelText="Postal Code" type="text" [value]="address().postalCode" />
              <UiInput labelText="TAX ID" type="text" [value]="address().taxId" />
            </UiGrid>
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
export class UserProfileAddressCardComponent {
  protected readonly address = signal<UserProfileAddress>(SAMPLE_ADDRESS);
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
