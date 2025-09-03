import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {DeclarationsService} from '../../services/declarations.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Router} from '@angular/router';
import {DeclarationsStatus} from '../../constants/declarations-status';
import {Button, ButtonModule} from 'primeng/button';
import {CurrencyPipe} from '@angular/common';
import {IconField, IconFieldModule} from 'primeng/iconfield';
import {InputIcon, InputIconModule} from 'primeng/inputicon';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {Popover, PopoverModule} from 'primeng/popover';
import {ConfirmationService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {TableSkeletonComponent} from '../../../../shared/components/skeleton/table-skeleton/table-skeleton.component';

@Component({
    selector: 'app-declarations-list',
    imports: [
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        TableModule,
        PopoverModule,
        ButtonModule,
        TableSkeletonComponent,
        CurrencyPipe
    ],
    providers: [AlertsService, ConfirmationService, DialogService],
    templateUrl: './declarations-list.component.html',
    styleUrl: './declarations-list.component.scss'
})
export class DeclarationsListComponent implements OnInit {
    @ViewChild('table') table: any | undefined;

    private declarationsService = inject(DeclarationsService)
    private alertsService = inject(AlertsService);
    private dialogService = inject(DialogService);
    private dialogRef: DynamicDialogRef | undefined;
    private router = inject(Router);

    public declarations: any;
    public declarationsStatus = DeclarationsStatus;
    public isLoading: boolean = false;
    public isDeleting: boolean = false;

    ngOnInit() {
        this.getDeclarations()
    }

    public getDeclarations() {
        this.isLoading = true;
        this.declarationsService.getDeclarations().subscribe({
            next: res => {
                this.isLoading = false;
                this.declarations = res.statements;
            },
            error: err => {
                this.isLoading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    public viewDeclarationDetails(declaration: any) {
        localStorage.setItem(this.declarationsService.declarationToken, btoa(JSON.stringify(declaration)));
        this.router.navigate(['/declaraciones/detalle']);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.table?.filterGlobal(filterValue, 'contains');
    }
}
