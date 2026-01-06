import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DeclarationsService} from '../../services/declarations.service';
import {forkJoin} from 'rxjs';
import {CompaniesService} from '../../../companies/services/companies.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {OpeningService} from '../../../../core/services/opening.service';
import {InputNumberModule} from 'primeng/inputnumber';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
    selector: 'app-create-declarations-dialog',
    imports: [
        SelectModule,
        ButtonModule,
        ReactiveFormsModule,
        InputNumberModule
    ],
    templateUrl: './create-declarations-dialog.component.html',
    styleUrl: './create-declarations-dialog.component.scss'
})
export class CreateDeclarationsDialogComponent implements OnInit {

    private declarationsService = inject(DeclarationsService);
    private companiesService = inject(CompaniesService);
    private openingService = inject(OpeningService);
    private formBuilder = inject(FormBuilder);
    private alertsService = inject(AlertsService);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);

    public createStatementForm: FormGroup;

    public companies: any;
    public openings: any;
    public companyId: any;
    public isLoading: any;

    public declarationsType = [
        { type: 'Normal', value: '1'},
        { type: 'Complementaria', value: '2'}
    ]

    ngOnInit(): void {
        forkJoin({
            companies: this.companiesService.getCompanies()
        }).subscribe({
            next: ({companies}) => {
                this.companies = companies.companies;
                this.initCreateStatementForm();
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    public initCreateStatementForm() {
        this.createStatementForm = this.formBuilder.group({
            opening_id: ['', Validators.required],
            tipo_declaracion: ['1', Validators.required],
            ocupacion1: ['0', Validators.required],
            ocupacion2: ['0', Validators.required],
            ocupacion3: [{value: '0', disabled: true}, Validators.required],
            ocupacion4: [{value: '0', disabled: true}, Validators.required]
        });
    }

    public createDeclaration() {
        this.isLoading = true;
        const data = this.createStatementForm.getRawValue();
        this.declarationsService.createDeclaration(this.companyId, data).subscribe({
            next: data => {
                this.isLoading = false;
                this.alertsService.successAlert(data.message).then(res => {
                    if (res.isConfirmed){
                        this.dialogRef.close(true);
                    }
                });
            },
            error: err => {
                this.isLoading = false;
                console.log(err);
                if (err.status == 0){
                    this.alertsService.errorAlert([{ message: `${err.statusText}: ${err.error.exception}` }]);
                } else {
                    this.alertsService.errorAlert([{ message: err.error.errors[0] }]);
                }
            }
        })
    }

    public getOpeningByCompany(event: any) {
        this.companyId = event.value;
        this.openingService.getOpeningByCompany(this.companyId).subscribe({
            next: data => {
                this.openings = data.openings;
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }
}
