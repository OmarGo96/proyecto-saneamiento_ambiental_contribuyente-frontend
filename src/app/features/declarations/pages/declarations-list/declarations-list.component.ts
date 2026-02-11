import {
    Component,
    inject,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { DeclarationsService } from '../../services/declarations.service';
import { AlertsService } from '../../../../core/services/alerts.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { DeclarationsStatus } from '../../constants/declarations-status';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TableSkeletonComponent } from '../../../../shared/components/skeleton/table-skeleton/table-skeleton.component';
import { CreateDeclarationsDialogComponent } from '../../dialogs/create-declarations-dialog/create-declarations-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DomSanitizer } from '@angular/platform-browser';
import { WelcomePopupService } from '../../../../shared/services/welcome-popup.service';

@Component({
    selector: 'app-declarations-list',
    imports: [
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        TableModule,
        PopoverModule,
        ButtonModule,
        TableSkeletonComponent,
        CurrencyPipe,
        DatePipe,
        ConfirmDialog,
    ],
    providers: [AlertsService, ConfirmationService, DialogService],
    templateUrl: './declarations-list.component.html',
    styleUrl: './declarations-list.component.scss',
})
export class DeclarationsListComponent implements OnInit, OnDestroy {
    @ViewChild('table') table: any | undefined;

    private declarationsService = inject(DeclarationsService);
    private welcomePopupService = inject(WelcomePopupService);
    private alertsService = inject(AlertsService);
    private dialogService = inject(DialogService);
    private spinner = inject(NgxSpinnerService);
    private dialogRef: DynamicDialogRef | undefined;
    private viewContainerRef = inject(ViewContainerRef);
    private router = inject(Router);
    public sanitizer = inject(DomSanitizer);

    public declarations: any;
    public declarationsStatus = DeclarationsStatus;
    public isLoading: boolean = false;
    public isDeleting: boolean = false;

    public pdfUrl: any;

    ngOnInit() {
        this.mostrarPopupBienvenida();
        this.getDeclarations();
    }

    ngOnDestroy() {
        // Cerrar y limpiar el popup al destruir el componente
        this.welcomePopupService.cerrarPopup();
    }

    public getDeclarations() {
        this.isLoading = true;
        this.declarationsService.getDeclarations().subscribe({
            next: (res) => {
                this.isLoading = false;
                this.declarations = res.statements;
            },
            error: (err) => {
                this.isLoading = false;
                this.alertsService.errorAlert(err.error.errors);
            },
        });
    }

    createDeclaration() {
        this.dialogRef = this.dialogService.open(
            CreateDeclarationsDialogComponent,
            {
                header: 'Crear declaración',
                width: '40vw',
                closeOnEscape: false,
                modal: true,
                closable: true,
                baseZIndex: 1,
                breakpoints: {
                    '960px': '75vw',
                    '640px': '90vw',
                },
            },
        );

        this.dialogRef.onClose.subscribe((result) => {
            if (result) {
                this.getDeclarations();
            }
        });
    }

    sendToVerifyDeclaration(declaration: any) {
        this.alertsService
            .confirmRequest('¿Estás seguro de enviar a verificación de pago?')
            .subscribe({
                next: (res) => {
                    this.spinner.show();
                    this.declarationsService
                        .verifyDeclaration(declaration.uuid)
                        .subscribe({
                            next: (res: any) => {
                                this.spinner.hide();
                                this.alertsService
                                    .successAlert(res.message)
                                    .then((res) => {
                                        if (res.isConfirmed) {
                                            this.getDeclarations();
                                        }
                                    });
                            },
                            error: (err) => {
                                this.spinner.hide();
                                this.alertsService.errorAlert(err.error.errors);
                            },
                        });
                },
            });
    }

    public viewDeclarationDetails(declaration: any) {
        // Codificar a UTF-8 antes de usar btoa para soportar caracteres especiales
        const jsonString = JSON.stringify(declaration);
        const utf8Bytes = new TextEncoder().encode(jsonString);
        const base64String = btoa(String.fromCharCode(...utf8Bytes));
        
        localStorage.setItem(
            this.declarationsService.declarationToken,
            base64String,
        );
        this.router.navigate(['/declaraciones/detalle']);
    }

    public getDeclarationReceipt(fileName: string) {
        this.spinner.show();
        this.declarationsService.getDeclarationReceipt(fileName).subscribe({
            next: (res) => {
                this.spinner.hide();
                this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                    URL.createObjectURL(res),
                );
                window.open(
                    this.pdfUrl.changingThisBreaksApplicationSecurity,
                    '_blank',
                );
            },
            error: (err) => {
                console.log(err);
                this.spinner.hide();
                this.alertsService.errorAlert([
                    {
                        message:
                            'Ocurrio un error al obtener el documento. Intente de nuevo más tarde.',
                    },
                ]);
            },
        });
    }

    public getStatementFormat(declaration: any) {
        this.spinner.show();
        this.declarationsService
            .getStatementFormat(declaration.uuid)
            .subscribe({
                next: (res) => {
                    this.spinner.hide();
                    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                        URL.createObjectURL(res),
                    );
                    window.open(
                        this.pdfUrl.changingThisBreaksApplicationSecurity,
                        '_blank',
                    );
                },
                error: (err) => {
                    this.spinner.hide();
                    this.alertsService.errorAlert([
                        {
                            message:
                                'Ocurrio un error al obtener el documento. Intente de nuevo más tarde.',
                        },
                    ]);
                },
            });
    }

    public billingDeclaration() {
        window.open(
            'https://facturacion.gobiernodesolidaridad.gob.mx/facturacontribuyente/',
            '_blank',
        );
    }

    public deleteDeclaration(declaration: any) {
        this.alertsService
            .confirmRequest('¿Estás seguro de eliminar esta declaración?')
            .subscribe({
                next: (res) => {
                    this.spinner.show();
                    this.declarationsService
                        .deleteDeclaration(declaration.uuid)
                        .subscribe({
                            next: (res: any) => {
                                this.spinner.hide();
                                this.alertsService
                                    .successAlert(res.message)
                                    .then((res) => {
                                        if (res.isConfirmed) {
                                            this.getDeclarations();
                                        }
                                    });
                            },
                            error: (err) => {
                                this.spinner.hide();
                                this.alertsService.errorAlert(err.error.errors);
                            },
                        });
                },
            });
    }

    private mostrarPopupBienvenida(): void {
        // Verificar si debe mostrarse el popup después del login
        const shouldShow = sessionStorage.getItem('showWelcomePopup');

        if (shouldShow === 'true') {
            this.welcomePopupService.mostrarPopup(this.viewContainerRef);
            // Eliminar la flag para que no se vuelva a mostrar hasta el próximo login
            sessionStorage.removeItem('showWelcomePopup');
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.table?.filterGlobal(filterValue, 'contains');
    }
}
