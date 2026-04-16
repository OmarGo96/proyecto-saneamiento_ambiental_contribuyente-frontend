import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import {UsersService} from '../../../../core/services/users.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {ConfirmationService} from 'primeng/api';

@Component({
    selector: 'app-recovery',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        PasswordModule,
        RouterLink
    ],
    providers: [AlertsService, ConfirmationService],
    templateUrl: './recovery.component.html',
    styleUrl: './recovery.component.scss'
})
export class RecoveryComponent implements OnInit {

    private usersService = inject(UsersService);
    private alertsService = inject(AlertsService);
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    public recoveryForm: FormGroup;
    public token: string | null = null;
    public isLoading = false;

    ngOnInit() {
        this.token = this.route.snapshot.paramMap.get('token');

        this.recoveryForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            passwordConfirm: ['', [Validators.required]]
        }, { validators: this.passwordsMatchValidator });
    }

    private passwordsMatchValidator(group: FormGroup) {
        const password = group.get('password')?.value;
        const confirm = group.get('passwordConfirm')?.value;
        return password === confirm ? null : { passwordsMismatch: true };
    }

    onSubmit() {
        if (this.recoveryForm.invalid) {
            this.recoveryForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const payload = {
            token: this.token,
            password: this.recoveryForm.value.password
        };

        this.usersService.restoreAccount(payload).subscribe({
            next: data => {
                this.alertsService.successAlert(data.message).then(() => {
                    this.router.navigate(['/auth/login']);
                });
            },
            error: err => {
                this.isLoading = false;
                if (err.status === 500) {
                    this.alertsService.errorAlert([{ message: `${err.statusText}: ${err.error.exception}` }]);
                } else {
                    this.alertsService.errorAlert([{ message: err.error.errors }]);
                }
            }
        });
    }
}
