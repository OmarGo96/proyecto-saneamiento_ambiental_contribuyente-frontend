import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import {provideRouter, withComponentInputBinding, withRouterConfig} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {jwtInterceptor} from './core/interceptors/jwt.interceptor';
import {DsaTheme} from './core/constants/theme-presets/dsa-theme';
import {AlertsService} from './core/services/alerts.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {Location} from '@angular/common';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: DsaTheme,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'light',
                    cssLayer: false
                }
            }
        }),
        provideRouter(
            routes,
            withComponentInputBinding(),
            withRouterConfig({ onSameUrlNavigation: 'reload' })
        ),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        AlertsService,
        ConfirmationService,
        MessageService,
        DialogService
    ]
};
