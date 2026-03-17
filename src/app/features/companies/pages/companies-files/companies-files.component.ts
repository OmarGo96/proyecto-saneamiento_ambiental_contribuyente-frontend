import {Component, inject, Input} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FileUploadModule} from 'primeng/fileupload';
import {DatePipe} from '@angular/common';
import {CompaniesService} from '../../services/companies.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {
    AddCompaniesFilesDialogComponent
} from '../../dialogs/add-companies-files-dialog/add-companies-files-dialog.component';

@Component({
    selector: 'app-companies-files',
    imports: [
        ButtonModule,
        FileUploadModule,
        DatePipe
    ],
    templateUrl: './companies-files.component.html',
    styleUrl: './companies-files.component.scss'
})
export class CompaniesFilesComponent {

    @Input() companyId: any;

    private companiesService = inject(CompaniesService);
    private alertsService = inject(AlertsService);
    private spinner = inject(NgxSpinnerService);
    private dialogService = inject(DialogService);
    private dialogRef: DynamicDialogRef | undefined;
    private location = inject(Location);

    public documentation: any;

    getCompaniesFiles() {
        this.spinner.show();
        this.companiesService.getCompaniesFiles(this.companyId).subscribe({
            next: data => {
                this.documentation = data.documentation;
                this.spinner.hide();
            },
            error: err => {
                this.spinner.hide();
            }
        })
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
                companyId: this.companyId
            }
        });

        this.dialogRef.onClose.subscribe((result: any) => {
            if (result) {
                this.getCompaniesFiles();
            }
        });
    }
}
