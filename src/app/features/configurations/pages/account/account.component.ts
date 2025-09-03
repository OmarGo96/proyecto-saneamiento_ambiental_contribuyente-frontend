import {Component, inject, OnInit} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {UsersService} from '../../../../core/services/users.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {ConfirmationService} from 'primeng/api';

@Component({
    selector: 'app-account',
    imports: [
        InputTextModule,
        PasswordModule,
        ButtonModule,
        ReactiveFormsModule,
    ],
    providers: [AlertsService, ConfirmationService],
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

    private usersService = inject(UsersService);
    private alertsService = inject(AlertsService);
    private formBuilder = inject(FormBuilder);

    public accountForm: FormGroup;

    public user: any;
    public isUpdating = false;
    ngOnInit() {
        forkJoin({
            user: this.usersService.getUser()
        }).subscribe({
            next: ({user}) => {
                this.user = user.user;
                this.initAccountForm();
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    initAccountForm() {
        this.accountForm = this.formBuilder.group({
            nombre: [this.user.nombre, Validators.required],
            email: [this.user.email, [Validators.required, Validators.email]],
            telefono: [this.user.telefono, Validators.required],
            password: [''],
        });
    }

    updateUser() {
        this.isUpdating = true;
        const data = this.accountForm.value;
        this.usersService.updateUser(data).subscribe({
            next: data => {
                this.isUpdating = false;
                this.alertsService.successAlert(data.message);
            },
            error: err => {
                this.isUpdating = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }
}
