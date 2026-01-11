import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class OpeningService {
    private url = environment.urlApi;
    private httpClient = inject(HttpClient);

    getListByYear(year: any): Observable<any> {
        return this.httpClient.get(`${this.url}/opening/by-year/${year}`);
    }

    opening(data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/opening/store`, data);
    }

    getOpeningByCompany(companyUuid: any): Observable<any> {
        return this.httpClient.get(`${this.url}/exceptions/show-by-company/${companyUuid}`);
    }
}
