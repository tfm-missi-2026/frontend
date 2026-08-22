import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { jwtInterceptor } from '@core/auth/jwt.interceptor';
import { errorInterceptor } from '@core/http/error.interceptor';
import { retryInterceptor } from '@core/http/retry.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, retryInterceptor, errorInterceptor])),
    provideToastr({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      maxOpened: 5,
      autoDismiss: true,
    }),
  ],
};
