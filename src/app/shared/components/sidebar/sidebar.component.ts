import {Component, input, OnInit, output} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MenuItems} from '../../../core/constants/menu-items';
import {PanelModule} from 'primeng/panel';
import {PanelMenu, PanelMenuModule} from 'primeng/panelmenu';
import {Ripple, RippleModule} from 'primeng/ripple';
import {DrawerModule} from 'primeng/drawer';
import {ButtonModule} from 'primeng/button';
import {AvatarModule} from 'primeng/avatar';
import {StyleClass} from 'primeng/styleclass';
import {NgClass} from '@angular/common';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

@Component({
    selector: 'app-sidebar',
    imports: [
        PanelMenuModule,
        RippleModule,
        RouterLink,
        RouterLinkActive,
        DrawerModule,
        ButtonModule,
        AvatarModule,
        MenuModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
    public isOpen = input<boolean>(false);
    public closeSidebar = output<void>();

    public menuItems: any;
    public menu: any;

    public profile: any;

    public activeItem: any;
    public manualesItems: MenuItem[] | undefined;
    public showManualesMenu = false;

    // Estructura escalable para manuales
    private manuales = [
        {
            nombre: 'Boveda de Documentos',
            archivo: 'Boveda de Documentos .pdf',
            icono: 'pi pi-file-pdf'
        }
        // Aquí se pueden agregar más manuales en el futuro
    ];

    ngOnInit() {

        this.menuItems = MenuItems.filter(menuItem => menuItem);

        const groups = new Set(this.menuItems.map((item: any) => item.group));

        this.menu = [];
        groups.forEach(g =>
            this.menu.push({
                    name: g,
                    values: this.menuItems.filter((i: any) => i.group === g),
                    module: ''
                }
            ));

        for (let i = 0; i < this.menu.length; i++) {
            for (let j = 0; j < this.menu[i].values.length; j++) {
                this.menu[i].module = this.menu[i].values[j].module;
            }
        }

        // Generar dinámicamente el menú de manuales
        this.manualesItems = this.manuales.map(manual => ({
            label: manual.nombre,
            icon: manual.icono,
            command: () => this.descargarManual(manual.archivo)
        }));
    }

    toggle(itemName: string) {
        console.log(itemName);
        this.activeItem = this.activeItem === itemName ? null : itemName;
    }

    toggleManuales(event: Event, value: any) {
        if (value.isDropdown) {
            event.preventDefault();
            this.showManualesMenu = !this.showManualesMenu;
        }
    }

    descargarManual(nombreArchivo: string): void {
        const link = document.createElement('a');
        link.href = `pdfs/${nombreArchivo}`;
        link.download = nombreArchivo;
        link.click();
        this.showManualesMenu = false;
    }
}
