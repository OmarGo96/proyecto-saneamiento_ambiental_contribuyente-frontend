import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CompaniesService} from '../../services/companies.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService} from 'primeng/api';
import {InputNumberModule} from 'primeng/inputnumber';
import {FileUploadModule} from 'primeng/fileupload';

@Component({
    selector: 'app-companies-registration-dialog',
    imports: [
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        ReactiveFormsModule,
        FileUploadModule,
        InputNumberModule,
        ButtonModule
    ],
    providers: [AlertsService, ConfirmationService, DialogService],
    templateUrl: './companies-registration-dialog.component.html',
    styleUrl: './companies-registration-dialog.component.scss'
})
export class CompaniesRegistrationDialogComponent implements OnInit {

    private companiesService = inject(CompaniesService);
    private formBuilder = inject(FormBuilder);
    private alertsService = inject(AlertsService);
    private dialogRef = inject(DynamicDialogRef);

    public requestForm: FormGroup;

    public isSearching: boolean = false;
    public isUploading: boolean = false;

    public selectedFiles: any[] = [];

    ngOnInit() {
        this.initSearchForm();
    }

    initSearchForm() {
        this.requestForm = this.formBuilder.group({
            licencia_funcionamiento: ['', Validators.required],
            nombre_establecimiento: ['', [Validators.required, Validators.minLength(4)]]
        });
    }

    requestCompanyRegistration(event: any){
        if(event.files.length === 0){
            this.alertsService.errorAlert([{message: 'Favor de proporcionar el archivo PDF'}]);
        } else {
            this.alertsService.confirmRequest('¿Estás seguro de que la información proporcionada es correcta?').subscribe({
                next: res => {
                    this.isUploading = true;
                    this.selectedFiles = event.files;
                    let formData = new FormData();

                    for (const file of this.selectedFiles) {
                        formData.append('file', file)
                        formData.append('licencia_funcionamiento', this.requestForm.value.licencia_funcionamiento)
                        formData.append('nombre_establecimiento', this.requestForm.value.nombre_establecimiento)
                    }
                    this.companiesService.requestCompanyRegistration(formData).subscribe({
                        next: data => {
                            this.isUploading = false;
                            this.alertsService.successAlert(data.message).then(res => {
                                if (res.isConfirmed){
                                    this.dialogRef.close(true);
                                }
                            })
                        },
                        error: err => {
                            this.isUploading = false;
                            this.alertsService.errorAlert(err.error.errors);
                        }
                    })
                }
            });
        }
    }
}
