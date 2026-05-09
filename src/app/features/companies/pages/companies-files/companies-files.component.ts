import {Component, inject, Input, OnInit} from '@angular/core';
import {DatePipe, Location} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {FileUploadModule} from 'primeng/fileupload';
import {TooltipModule} from 'primeng/tooltip';
import {CompaniesService} from '../../services/companies.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {
    AddCompaniesFilesDialogComponent
} from '../../dialogs/add-companies-files-dialog/add-companies-files-dialog.component';
import {CompanyDocument} from '../../interfaces/company-document.interface';
import {AlertsService} from '../../../../core/services/alerts.service';
import {MessageModule} from 'primeng/message';

@Component({
    selector: 'app-companies-files',
    imports: [
        ButtonModule,
        FileUploadModule,
        DatePipe,
        TooltipModule,
        MessageModule
    ],
    templateUrl: './companies-files.component.html',
    styleUrl: './companies-files.component.scss'
})
export class CompaniesFilesComponent implements OnInit {

    @Input() companyUuid: any;

    private location = inject(Location);
    private companiesService = inject(CompaniesService);
    private spinner = inject(NgxSpinnerService);
    private dialogService = inject(DialogService);
    private alertsService = inject(AlertsService);
    private dialogRef: DynamicDialogRef | undefined;

    public documents: CompanyDocument[] = [];
    public selectedFiles = new Map<string, File>();
    public replacementFiles = new Map<string, File>();

    goBack() {
        this.location.back();
    }

    ngOnInit() {
        this.getCompaniesFiles();
    }

    getCompaniesFiles() {
        this.spinner.show();
        const currentYear = new Date().getFullYear().toString();
        this.companiesService.getCompaniesDocuments(this.companyUuid, currentYear).subscribe({
            next: (response) => {
                this.documents = response.documents || [];
                this.spinner.hide();
            },
            error: () => {
                this.spinner.hide();
                this.alertsService.errorAlert([{ message: 'Error al cargar los documentos, por favor intenta nuevamente'}]);
            }
        })
    }

    onFileSelect(event: any, document: CompanyDocument) {
        const file = event.files[0];
        if (file) {
            // Validar tipo de archivo
            if (file.type !== 'application/pdf') {
                this.alertsService.errorAlert([{message: 'Tipo de archivo no válido, solo se permiten PDF'}]);
                return;
            }

            // Validar tamaño (10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB en bytes
            if (file.size > maxSize) {
                this.alertsService.errorAlert([{message: 'Archivo muy grande, el tamaño máximo permitido es de 10MB'}]);
                return;
            }

            // Guardar el archivo seleccionado
            this.selectedFiles.set(document.type_document_uuid, file);
        }
    }

    uploadDocument(document: CompanyDocument, fileUploader: any) {
        const file = this.selectedFiles.get(document.type_document_uuid);

        if (!file) {
            this.alertsService.errorAlert([{message: 'No se ha seleccionado ningún archivo'}]);
            return;
        }

        this.spinner.show();
        const currentYear = new Date().getFullYear().toString();

        this.companiesService.uploadCompanyDocument(
            this.companyUuid,
            document.type_document_uuid,
            currentYear,
            file
        ).subscribe({
            next: (response) => {
                this.spinner.hide();
                this.alertsService.successAlert(response.message);
                // Limpiar el archivo seleccionado y el uploader
                this.selectedFiles.delete(document.type_document_uuid);
                fileUploader.clear();
                // Recargar la lista de documentos
                this.getCompaniesFiles();
            },
            error: (error) => {
                this.spinner.hide();
                const errorMessage = error?.error?.message || [{ message: 'Error al subir el documento, por favor intenta nuevamente' }];
                this.alertsService.errorAlert(errorMessage);
            }
        });
    }

    clearSelectedFile(typeDocumentUuid: string, fileUploader: any) {
        this.selectedFiles.delete(typeDocumentUuid);
        fileUploader.clear();
    }

    onReplaceFileSelect(event: any, document: CompanyDocument) {
        const file = event.files[0];
        if (file) {
            // Validar tipo de archivo
            if (file.type !== 'application/pdf') {
                this.alertsService.errorAlert([{message: 'Tipo de archivo no válido, solo se permiten PDF'}]);
                return;
            }

            // Validar tamaño (10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB en bytes
            if (file.size > maxSize) {
                this.alertsService.errorAlert([{message: 'Archivo muy grande, el tamaño máximo permitido es de 10MB'}]);
                return;
            }

            // Guardar el archivo de reemplazo seleccionado
            this.replacementFiles.set(document.uuid!, file);
        }
    }

    replaceDocument(document: CompanyDocument, fileUploader: any) {
        const file = this.replacementFiles.get(document.uuid!);

        if (!file) {
            this.alertsService.errorAlert([{message: 'No se ha seleccionado ningún archivo'}]);
            return;
        }

        if (!document.uuid) {
            this.alertsService.errorAlert([{message: 'Error: No se encuentra el identificador del documento'}]);
            return;
        }

        this.spinner.show();

        this.companiesService.replaceCompanyDocument(document.uuid, file).subscribe({
            next: (response) => {
                this.spinner.hide();
                this.alertsService.successAlert(response.message);
                // Limpiar el archivo seleccionado y el uploader
                this.replacementFiles.delete(document.uuid!);
                fileUploader.clear();
                // Recargar la lista de documentos
                this.getCompaniesFiles();
            },
            error: (error) => {
                this.spinner.hide();
                const errorMessage = error?.error?.message || [{ message: 'Error al reemplazar el documento, por favor intenta nuevamente' }];
                this.alertsService.errorAlert(errorMessage);
            }
        });
    }

    clearReplacementFile(documentUuid: string, fileUploader: any) {
        this.replacementFiles.delete(documentUuid);
        fileUploader.clear();
    }

    viewDocument(document: CompanyDocument) {
        if (!document.file) {
            this.alertsService.errorAlert([{message: 'No hay archivo disponible para visualizar'}]);
            return;
        }

        // Mapear el nombre del tipo de documento al valor esperado por el backend
        const documentTypeMap: Record<string, string> = {
            'acta constitutiva': 'actas',
            'poder notarial': 'notariales',
            'constancia de situacion fiscal': 'constancias',
            'licencia de funcionamiento': 'licencias_funcionamiento',
        };

        const normalizedName = document.type_document_name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[()]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        const documentType = Object.entries(documentTypeMap).find(([key]) =>
            normalizedName.includes(key)
        )?.[1] ?? (normalizedName.includes('identificac') ? 'identificaciones' : normalizedName);

        this.spinner.show();

        this.companiesService.getDocumentFile(document.file, documentType).subscribe({
            next: (blob: Blob) => {
                this.spinner.hide();

                // Crear una URL temporal del blob
                const fileURL = URL.createObjectURL(blob);

                // Abrir en nueva pestaña
                const newWindow = window.open(fileURL, '_blank');

                // Liberar la URL del blob después de un tiempo para liberar memoria
                // El timeout da tiempo para que el navegador cargue el archivo
                if (newWindow) {
                    newWindow.onload = () => {
                        setTimeout(() => URL.revokeObjectURL(fileURL), 100);
                    };
                } else {
                    // Si no se puede abrir ventana nueva, liberar después de 1 minuto
                    setTimeout(() => URL.revokeObjectURL(fileURL), 60000);
                }
            },
            error: (error) => {
                this.spinner.hide();
                const errorMessage = error?.error?.message || [{ message: 'Error al cargar el documento, por favor intenta nuevamente' }];
                this.alertsService.errorAlert(errorMessage);
            }
        });
    }

    canReplaceDocument(document: CompanyDocument): boolean {
        if (!document.uuid || !document.status) return false;
        const status = document.status.toLowerCase();
        return status === 'rechazado' || status === 'rejected' || status === 'pendiente' || status === 'pending';
    }

    public openAddCompaniesDocumentationDialog() {
        this.dialogRef = this.dialogService.open(AddCompaniesFilesDialogComponent, {
            header: 'Agregar documentación',
            width: '30vw',
            closeOnEscape: false,
            modal: true,
            closable: true,
            baseZIndex: 1,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                companyUuid: this.companyUuid
            }
        });

        this.dialogRef.onClose.subscribe((result: any) => {
            if (result) {
                this.getCompaniesFiles();
            }
        });
    }
}
