import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {RecoveryComponent} from './pages/recovery/recovery.component';

export default [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registro',
        component: RegisterComponent
    },
    {
        path: 'restaurar',
        component: RecoveryComponent
    },
] as Routes;
