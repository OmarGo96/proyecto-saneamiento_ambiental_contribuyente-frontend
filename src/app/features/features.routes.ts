import { Routes } from '@angular/router';
import {UsersComponent} from './users/pages/users/users.component';
import {DeclarationsComponent} from './declarations/components/declarations/declarations.component';
import {CompaniesComponent} from './companies/components/companies/companies.component';



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
    }
] as Routes;
