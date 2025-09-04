import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {Password, PasswordModule} from 'primeng/password';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UsersService} from '../../../../core/services/users.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {ConfirmationService} from 'primeng/api';
import {FileUpload} from 'primeng/fileupload';
import {Router, RouterLink} from '@angular/router';
import {CompaniesStatus} from '../../../companies/constants/companies-status';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
    selector: 'app-register',
    imports: [
        InputTextModule,
        PasswordModule,
        ButtonModule,
        ReactiveFormsModule,
        FileUpload,
        RouterLink,
        ConfirmDialog,
    ],
    providers: [AlertsService, ConfirmationService],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

    private usersService = inject(UsersService);
    private alertsService = inject(AlertsService);
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);

    public accountForm: FormGroup;

    public user: any;
    public isLoading = false;

    public selectedFiles: any[] = [];

    ngOnInit() {
        this.initAccountForm();
    }

    initAccountForm() {
        this.accountForm = this.formBuilder.group({
            representante: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            confirm_email: ['', [Validators.required, Validators.email]],
            telefono: ['', Validators.required],
            licencia_funcionamiento: ['', Validators.required],
            nombre_establecimiento: ['', Validators.required],
            pagadora: [0, Validators.required]
        });
    }

    register(event: any){
        if (this.accountForm.value.email != this.accountForm.value.confirm_email) {
            this.alertsService.errorAlert([{message: 'El correo electrónico no coinciden'}])
        } else if(event.files.length === 0) {
            this.alertsService.errorAlert([{message: 'Favor de proporcionar el archivo PDF'}]);
        } else {
            this.alertsService.confirmRequest('¿Estás seguro de que la información proporcionada es correcta?').subscribe({
                next: res => {
                    this.isLoading = true;
                    this.selectedFiles = event.files;
                    let pagadora: string = (this.accountForm.value.pagadora == true) ? '1' : '0'
                    let formData = new FormData();

                    for (const file of this.selectedFiles) {
                        formData.append('file', file)
                        formData.append('representante', this.accountForm.value.representante)
                        formData.append('email', this.accountForm.value.email)
                        formData.append('telefono', this.accountForm.value.telefono)
                        formData.append('licencia_funcionamiento', this.accountForm.value.licencia_funcionamiento)
                        formData.append('nombre_establecimiento', this.accountForm.value.nombre_establecimiento)
                        formData.append('pagadora', pagadora)
                    }
                    this.usersService.registerUser(formData).subscribe({
                        next: data => {
                            this.isLoading = false;
                            this.alertsService.successAlert(data.message).then(res => {
                                if (res.isConfirmed){
                                    this.router.navigate(['/auth/login']);
                                }
                            })
                        },
                        error: err => {
                            this.isLoading = false;
                            this.alertsService.errorAlert([{message: err.error.errors}]);
                        }
                    })
                }
            });
        }
    }

    protected readonly companiesStatus = CompaniesStatus;
}
