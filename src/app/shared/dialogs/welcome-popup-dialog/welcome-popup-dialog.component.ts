import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';

interface Anuncio {
    id: number;
    imagen: string;
    titulo: string;
    descripcion?: string;
}

@Component({
    selector: 'app-welcome-popup-dialog',
    imports: [DialogModule, CarouselModule, ButtonModule, CommonModule],
    templateUrl: './welcome-popup-dialog.component.html',
    styleUrl: './welcome-popup-dialog.component.scss',
})
export class WelcomePopupDialogComponent {
    visible = false;
    currentIndex = 0;

    // Configura aquí tus anuncios/imágenes
    anuncios: Anuncio[] = [
        {
            id: 1,
            imagen: 'images/actualizacion-documentos.jpeg',
            titulo: 'Recuerda actualizar tus documentos',
            descripcion:
                'Recuerda actualizar tus documentos correspondientes al año actual.',
        }/* ,
        {
            id: 2,
            imagen: 'actualizacion-uma-2026.jpg',
            titulo: 'Actualización del valor UMA',
            descripcion:
                'Actualización del valor UMA a partir del 1° Febrero 2026',
        } */
    ];

    ngOnInit(): void {}

    mostrar(): void {
        this.visible = true;
    }

    cerrar(): void {
        this.visible = false;
    }

    onClose(): void {
    }

    onPageChange(event: any): void {
        this.currentIndex = event.page;
    }

    goToSlide(index: number): void {
        this.currentIndex = index;
    }
}
