import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    private url = environment.urlApi;
    private httpClient = inject(HttpClient);


    getUser(): Observable<any>{
        return this.httpClient.get(`${this.url}/users/show`);
    }

    registerUser(data: any): Observable<any>{
        return this.httpClient.post(`${this.url}/registration/store`, data);
    }

    updateUser(data: any): Observable<any> {
        return this.httpClient.put(`${this.url}/users/update`, data);
    }

    recoveryAccount(data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/users/recovery-account`, data);
    }
}
