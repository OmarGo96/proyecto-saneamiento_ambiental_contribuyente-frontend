import { Routes } from '@angular/router';
import {DeclarationsComponent} from './declarations/components/declarations/declarations.component';
import {CompaniesComponent} from './companies/components/companies/companies.component';
import {ConfigurationsComponent} from './configurations/components/configurations/configurations.component';



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
        path: 'configuracion',
        component: ConfigurationsComponent,
        children: [
            {
                path: '', loadChildren: () => import('./configurations/configurations.routes')
            },
        ],
    }
] as Routes;
