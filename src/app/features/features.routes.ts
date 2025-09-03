import { Routes } from '@angular/router';
import {UsersComponent} from './users/pages/users/users.component';
import {DeclarationsComponent} from './declarations/components/declarations/declarations.component';
import {RequestsComponent} from './requests/components/requests/requests.component';
import {CompaniesComponent} from './companies/components/companies/companies.component';
import {ConfigurationsComponent} from './configurations/components/configurations/configurations.component';
import {DashboardComponent} from './dashboard/pages/dashboard/dashboard.component';


export default [
    {
        path: 'declaraciones',
        component: DeclarationsComponent,
        children: [
            {
                path: '', loadChildren: () => import('./declarations/declarations.routes')
            },
        ],
    },
    {
        path: 'empresas',
        component: CompaniesComponent,
        children: [
            {
                path: '', loadChildren: () => import('./companies/companies.routes')
            },
        ],
    },
    {
        path: 'usuarios',
        component: UsersComponent,
    },
    {
        path: 'configuracion',
        component: ConfigurationsComponent,
        children: [
            {
                path: '', loadChildren: () => import('./configurations/configurations.routes')
            },
        ],
    }
] as Routes;
