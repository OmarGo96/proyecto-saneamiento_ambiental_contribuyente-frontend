import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {SessionService} from '../../../../core/services/session.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {Router, RouterLink} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import moment from 'moment';
import {ConfirmationService} from 'primeng/api';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        RouterLink
    ],
    providers: [AlertsService, ConfirmationService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    public loginForm: any;

    private sessionService = inject(SessionService);
    private alertsService = inject(AlertsService);
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);

    public currentYear = moment().format('YYYY');


    public logo = '/logo.png';
    public projectName = 'Declaración de Saneamiento Ambiental';
    public isLoading = false;

    ngOnInit() {
        this.initLoginForm();
    }

    initLoginForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    onLogin() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const data = this.loginForm.value;

        this.sessionService.login(data).subscribe({
            next: res => {
                const token = res.token;

                sessionStorage.setItem(this.sessionService.jwtToken, token);
                // Flag para mostrar el popup de bienvenida después del login
                sessionStorage.setItem('showWelcomePopup', 'true');

                this.router.navigate(['/declaraciones']);

                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                const errorMessage = err?.error?.errors || 'Error al iniciar sesión';
                this.alertsService.errorAlert(errorMessage);
            }
        })
    }
}
