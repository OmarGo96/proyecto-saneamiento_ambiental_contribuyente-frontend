import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { WelcomePopupDialogComponent } from '../dialogs/welcome-popup-dialog/welcome-popup-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class WelcomePopupService {
    private popupRef: ComponentRef<WelcomePopupDialogComponent> | null = null;

    /**
     * Muestra el popup de bienvenida después del login
     * @param viewContainerRef - ViewContainerRef del componente padre
     */
    mostrarPopup(viewContainerRef: ViewContainerRef): void {
        // Evitar duplicados
        if (this.popupRef) {
            this.popupRef.instance.mostrar();
            return;
        }

        // Crear el componente dinámicamente
        this.popupRef = viewContainerRef.createComponent(WelcomePopupDialogComponent);

        // Mostrar el dialog
        setTimeout(() => {
            this.popupRef?.instance.mostrar();
        }, 300); // Pequeño delay para mejor UX después del login
    }

    /**
     * Cierra y destruye el popup
     */
    cerrarPopup(): void {
        if (this.popupRef) {
            this.popupRef.instance.cerrar();
            this.popupRef.destroy();
            this.popupRef = null;
        }
    }
}
