import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";

import { UiAvatarComponent } from "@shared/ui/avatar";
import { UiButtonComponent } from "@shared/ui/button";
import { UiCardComponent } from "@shared/ui/card";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import {
  IconEditPencilComponent,
  IconFacebookComponent,
  IconInstagramComponent,
  IconLinkedinComponent,
  IconXComponent,
} from "@shared/icons";

import { ButtonLinkProps } from "@shared/ui/button/types";

import { UserProfileSocialLinks, UserProfileUser } from "./user-profile.types";

const SAMPLE_USER: UserProfileUser = {
  firstName: "Musharof",
  lastName: "Chowdhury",
  role: "Team Manager",
  location: "Arizona, United States",
  avatar: "/images/user/owner.jpg",
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

const SOCIAL_LINK_CLASS = "rounded-full! shadow-xs! shadow-theme-xs";

/**
 * `UserProfileMetaCard`
 * ---------------------
 * Tarjeta de la zona superior del perfil del usuario: avatar, nombre,
 * rol, ubicación y enlaces sociales. Botón "Edit" que abre un modal
 * con el formulario de edición.
 *
 * Construida sobre primitives del design system (`UiCard`, `UiAvatar`,
 * `UiFlex`, `UiHeader`, `UiLabel`, `UiButton`, `UiIconButton`,
 * `UiModal`) e iconos del namespace `@shared/icons` (`IconFacebook`,
 * `IconX`, `IconLinkedin`, `IconInstagram`).
 */
@Component({
  selector: "UserProfileMetaCard",
  standalone: true,
  imports: [
    UiAvatarComponent,
    UiButtonComponent,
    UiCardComponent,
    UiFlexComponent,
    UiGridComponent,
    UiHeaderComponent,
    UiIconButtonComponent,
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
        gap="1.25rem"
        className="xl:flex-row! xl:items-center! xl:justify-between!"
      >
        <UiFlex
          direction="column"
          alignItems="center"
          gap="1.5rem"
          className="xl:flex-row!"
        >
          <UiAvatar
            [src]="user().avatar"
            alt="user"
            size="xxlarge"
            className="border border-gray-200 dark:border-gray-800"
          />

          <UiFlex
            direction="column"
            alignItems="center"
            gap="0.25rem"
            className="order-3 xl:order-2 xl:items-start!"
          >
            <UiHeader
              [level]="4"
              [text]="fullName()"
              className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left"
            />
            <UiFlex
              direction="column"
              alignItems="center"
              gap="0.25rem"
              className="xl:flex-row! xl:gap-3!"
            >
              <UiLabel
                as="p"
                type="bodyS"
                color="textWeak"
                [wrapText]="true"
              >{{ user().role }}</UiLabel>
              <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <UiLabel
                as="p"
                type="bodyS"
                color="textWeak"
                [wrapText]="true"
              >{{ user().location }}</UiLabel>
            </UiFlex>
          </UiFlex>

          <UiFlex
            direction="row"
            alignItems="center"
            gap="0.5rem"
            className="order-2 grow xl:order-3 xl:justify-end"
          >
            <UiIconButton
              variant="secondary"
              styleType="monochrome"
              [asLink]="true"
              [linkProps]="facebookLink()"
              [Icon]="iconFacebook"
              [iconProps]="{ size: 20 }"
              labelText="Facebook"
              width="2.75rem"
              [className]="socialClass"
            />
            <UiIconButton
              variant="secondary"
              styleType="monochrome"
              [asLink]="true"
              [linkProps]="xLink()"
              [Icon]="iconX"
              [iconProps]="{ size: 20 }"
              labelText="X (Twitter)"
              width="2.75rem"
              [className]="socialClass"
            />
            <UiIconButton
              variant="secondary"
              styleType="monochrome"
              [asLink]="true"
              [linkProps]="linkedinLink()"
              [Icon]="iconLinkedin"
              [iconProps]="{ size: 20 }"
              labelText="LinkedIn"
              width="2.75rem"
              [className]="socialClass"
            />
            <UiIconButton
              variant="secondary"
              styleType="monochrome"
              [asLink]="true"
              [linkProps]="instagramLink()"
              [Icon]="iconInstagram"
              [iconProps]="{ size: 20 }"
              labelText="Instagram"
              width="2.75rem"
              [className]="socialClass"
            />
          </UiFlex>
        </UiFlex>

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
                <UiInput className="col-span-2 lg:col-span-1" labelText="First Name" type="text" [value]="user().firstName" />
                <UiInput className="col-span-2 lg:col-span-1" labelText="Last Name" type="text" [value]="user().lastName" />
                <UiInput className="col-span-2 lg:col-span-1" labelText="Email Address" type="text" [value]="user().email" />
                <UiInput className="col-span-2 lg:col-span-1" labelText="Phone" type="text" [value]="user().phone" />
                <UiInput className="col-span-2" labelText="Bio" type="text" [value]="user().bio" />
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
export class UserProfileMetaCardComponent {
  protected readonly user = signal<UserProfileUser>(SAMPLE_USER);
  protected readonly social = signal<UserProfileSocialLinks>(SAMPLE_SOCIAL);

  readonly editIcon = IconEditPencilComponent;
  readonly iconFacebook = IconFacebookComponent;
  readonly iconX = IconXComponent;
  readonly iconLinkedin = IconLinkedinComponent;
  readonly iconInstagram = IconInstagramComponent;

  protected readonly socialClass = SOCIAL_LINK_CLASS;

  protected readonly isOpen = signal(false);

  protected readonly fullName = computed<string>(
    () => `${this.user().firstName} ${this.user().lastName}`,
  );

  protected readonly facebookLink = computed<ButtonLinkProps>(() =>
    this.socialLink(this.social().facebook),
  );
  protected readonly xLink = computed<ButtonLinkProps>(() =>
    this.socialLink(this.social().x),
  );
  protected readonly linkedinLink = computed<ButtonLinkProps>(() =>
    this.socialLink(this.social().linkedin),
  );
  protected readonly instagramLink = computed<ButtonLinkProps>(() =>
    this.socialLink(this.social().instagram),
  );

  protected openModal(): void {
    this.isOpen.set(true);
  }

  protected closeModal(): void {
    this.isOpen.set(false);
  }

  protected handleSave(): void {
    this.closeModal();
  }

  private socialLink(href: string): ButtonLinkProps {
    return { href, target: "_blank", rel: "noopener" };
  }
}
