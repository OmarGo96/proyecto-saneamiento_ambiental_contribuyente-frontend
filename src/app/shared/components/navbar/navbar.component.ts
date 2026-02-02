import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { WelcomePopupService } from '../../services/welcome-popup.service';

@Component({
    selector: 'app-navbar',
    imports: [
        ButtonModule,
        MenuModule,
        TooltipModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
    private router = inject(Router);
    private welcomePopupService = inject(WelcomePopupService);
    private viewContainerRef = inject(ViewContainerRef);
    public items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Menu',
                items: [
                    {
                        label: 'Cerrar sesión',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            sessionStorage.clear();
                            this.router.navigate(['auth/login']);
                        }
                    }
                ]
            }
        ];
    }

    mostrarAvisos(): void {
        this.welcomePopupService.mostrarPopup(this.viewContainerRef);
    }
}
