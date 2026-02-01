import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';

interface Anuncio {
    id: number;
    imagen: string;
    titulo: string;
    descripcion?: string;
}

@Component({
    selector: 'app-welcome-popup-dialog',
    imports: [DialogModule, CarouselModule, ButtonModule],
    templateUrl: './welcome-popup-dialog.component.html',
    styleUrl: './welcome-popup-dialog.component.scss',
})
export class WelcomePopupDialogComponent {
    visible = false;

    // Configura aquí tus anuncios/imágenes
    anuncios: Anuncio[] = [
        {
            id: 1,
            imagen: 'comunicado-mural-dsa.jpg',
            titulo: 'Recuerda presentar tu declaración',
            descripcion:
                'Recuerda presentar tu declaración correspondiente al mes de enero.',
        },
        {
            id: 2,
            imagen: 'actualizacion-uma-2026.jpg',
            titulo: 'Actualización del valor UMA',
            descripcion:
                'Actualización del valor UMA a partir del 1° Febrero 2026',
        }
    ];

    ngOnInit(): void {}

    mostrar(): void {
        this.visible = true;
    }

    cerrar(): void {
        this.visible = false;
    }

    onClose(): void {
        // Lógica adicional al cerrar si la necesitas
        console.log('Popup de bienvenida cerrado');
    }
}
