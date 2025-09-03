import {Routes} from '@angular/router';
import {CompaniesListComponent} from './pages/companies-list/companies-list.component';
import {CompaniesDetailComponent} from './pages/companies-detail/companies-detail.component';

export default [
    {
        path: '',
        component: CompaniesListComponent
    },
    {
        path: 'detalle',
        component: CompaniesDetailComponent
    }
] as Routes;
