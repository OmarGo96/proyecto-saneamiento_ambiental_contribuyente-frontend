import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {UsersService} from '../../../../core/services/users.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {ConfirmationService} from 'primeng/api';

@Component({
    selector: 'app-recovery',
    imports: [
        ButtonModule,
        InputTextModule,
        ReactiveFormsModule,
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

    public recoveryForm: FormGroup;
    public isLoading = false;

    ngOnInit() {
        this.recoveryForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    recoveryAccount(){
        this.isLoading = true;
        const data = this.recoveryForm.value;
        this.usersService.recoveryAccount(data).subscribe({
            next: data => {
                this.alertsService.successAlert(data.message).then(res => {
                    if (res.isConfirmed){
                        this.router.navigate(['/auth/login']);
                    }
                })
            },
            error: err => {
                console.log(err);
                this.isLoading = false;
                if (err.status === 500) {
                    this.alertsService.errorAlert([{ message: `${err.statusText}: ${err.error.exception}` }]);
                } else {
                    this.alertsService.errorAlert([{message: err.error.errors}]);
                }

            }
        })
    }
}
