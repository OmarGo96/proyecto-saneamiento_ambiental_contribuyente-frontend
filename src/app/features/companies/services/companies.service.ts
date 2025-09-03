import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
    private url = environment.urlApi;
    private httpClient = inject(HttpClient);

    public companyToken = 'kLV3F5ZukcIQetF3cPT3HMAPw6uU0DsH';

    getCompanies(): Observable<any> {
        return this.httpClient.get(`${this.url}/companies/show`);
    }

    getAllCompaniesByUser(): Observable<any> {
        return this.httpClient.get(`${this.url}/companies/show/all`);
    }

    getCompaniesByStatus(status: any): Observable<any> {
        return this.httpClient.get(`${this.url}/companies/index/${status}`);
    }

    requestCompanyRegistration(data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/user-request/store`, data);
    }

    updateBedrooms(companyId: any, data: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/updateBedrooms/${companyId}`, data);
    }

    unlinkCompany(data: any, companyId: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/unlink/${companyId}`, data);
    }

    releaseCompany(companyId: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/release/${companyId}`, {});
    }

    disableCompany(companyId: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/disable/${companyId}`, {});
    }

    enableCompany(companyId: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/enable/${companyId}`, {});
    }

}
