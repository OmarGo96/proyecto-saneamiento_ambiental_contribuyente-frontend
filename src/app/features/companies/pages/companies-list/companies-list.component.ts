import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CurrencyPipe} from '@angular/common';
import {PopoverModule} from 'primeng/popover';
import {TableModule} from 'primeng/table';
import {TableSkeletonComponent} from '../../../../shared/components/skeleton/table-skeleton/table-skeleton.component';
import {CompaniesStatus} from '../../constants/companies-status';
import {CompaniesService} from '../../services/companies.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {
    CompaniesRegistrationDialogComponent
} from '../../dialogs/companies-registration-dialog/companies-registration-dialog.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
    selector: 'app-companies-list',
    imports: [
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        TableModule,
        PopoverModule,
        ButtonModule,
        TableSkeletonComponent
    ],
    providers: [AlertsService, ConfirmationService, DialogService],
    templateUrl: './companies-list.component.html',
    styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent implements OnInit {

    @ViewChild('table') table: any | undefined;

    private companiesService = inject(CompaniesService);
    private alertsService = inject(AlertsService);
    private dialogRef: DynamicDialogRef | undefined;
    private dialogService = inject(DialogService);
    private router = inject(Router);

    public companies: any;
    public isLoading: boolean = false;

    public companiesStatus = CompaniesStatus;

    ngOnInit() {
        this.getCompanies()
    }

    public getCompanies(){
        this.isLoading = true;
        this.companiesService.getAllCompaniesByUser().subscribe({
            next: res => {
                this.isLoading = false;
                this.companies = res.companies;
            },
            error: err => {
                this.isLoading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    public viewCompanyDetails(company: any) {
        localStorage.setItem(this.companiesService.companyToken, btoa(JSON.stringify(company)));
        this.router.navigate(['/empresas/detalle']);
    }

    public openCompaniesRegistrationDialog(){
        this.dialogRef = this.dialogService.open(CompaniesRegistrationDialogComponent, {
            header: 'Adjuntar nueva empresa',
            width: '40vw',
            closeOnEscape: false,
            modal: true,
            closable: true,
            baseZIndex: 1,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
        });

        this.dialogRef.onClose.subscribe((result) => {
            if (result) {
                this.getCompanies();
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.table?.filterGlobal(filterValue, 'contains');
    }

}
