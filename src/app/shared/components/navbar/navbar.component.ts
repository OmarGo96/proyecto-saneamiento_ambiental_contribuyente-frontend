import {Component, inject, OnInit, output, ViewContainerRef} from '@angular/core';
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
    public manualesItems: MenuItem[] | undefined;

    // Estructura escalable para manuales
    private manuales = [
        {
            nombre: 'Boveda de Documentos',
            archivo: 'Boveda de Documentos .pdf',
            icono: 'pi pi-file-pdf'
        }
        // Aquí se pueden agregar más manuales en el futuro:
        // {
        //     nombre: 'Manual de Usuario',
        //     archivo: 'Manual de Usuario.pdf',
        //     icono: 'pi pi-file-pdf'
        // }
    ];

    public toggleSidebar = output<void>();

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

        // Generar dinámicamente el menú de manuales
        this.manualesItems = [
            {
                label: 'Manuales',
                items: this.manuales.map(manual => ({
                    label: manual.nombre,
                    icon: manual.icono,
                    command: () => this.descargarManual(manual.archivo)
                }))
            }
        ];
    }

    mostrarAvisos(): void {
        this.welcomePopupService.mostrarPopup(this.viewContainerRef);
    }

    onToggleSidebar() {
        this.toggleSidebar.emit();
    }

    descargarManual(nombreArchivo: string): void {
        const link = document.createElement('a');
        link.href = `pdfs/${nombreArchivo}`;
        link.download = nombreArchivo;
        link.click();
    }
}
