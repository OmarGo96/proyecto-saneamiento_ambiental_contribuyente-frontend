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

    getUsers(): Observable<any> {
        return this.httpClient.get(`${this.url}/administrators/index/all`);
    }

    createUser(data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/administrators/store`, data);
    }

    updateUser(data: any): Observable<any> {
        return this.httpClient.put(`${this.url}/users/update`, data);
    }

    deleteUser(userId: any): Observable<any> {
        return this.httpClient.delete(`${this.url}/administrators/delete/${userId}`);
    }

    reactiveUser(userId: any): Observable<any> {
        return this.httpClient.put(`${this.url}/administrators/reactive/${userId}`, {});
    }
}
