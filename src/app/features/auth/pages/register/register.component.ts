import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {Password, PasswordModule} from 'primeng/password';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UsersService} from '../../../../core/services/users.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {ConfirmationService} from 'primeng/api';

@Component({
    selector: 'app-register',
    imports: [
        InputTextModule,
        PasswordModule,
        ButtonModule,
        ReactiveFormsModule,
    ],
    providers: [AlertsService, ConfirmationService],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

    private usersService = inject(UsersService);
    private alertsService = inject(AlertsService);
    private formBuilder = inject(FormBuilder);

    public accountForm: FormGroup;

    public user: any;
    public isUpdating = false;

    ngOnInit() {
        this.initAccountForm();
    }

    initAccountForm() {
        this.accountForm = this.formBuilder.group({
            nombre: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            telefono: ['', Validators.required],
            password: [''],
        });
    }
}
