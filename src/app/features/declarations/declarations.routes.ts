import { Routes } from '@angular/router';
import {DeclarationsListComponent} from './pages/declarations-list/declarations-list.component';
import {DeclarationsDetailsComponent} from './pages/declarations-details/declarations-details.component';


export default [
    {
        path: '',
        component: DeclarationsListComponent
    },
    {
        path: 'detalle',
        component: DeclarationsDetailsComponent
    }
] as Routes;
