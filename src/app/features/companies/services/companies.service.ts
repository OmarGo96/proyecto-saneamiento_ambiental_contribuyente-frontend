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

    updateBedrooms(companyUuid: any, data: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/updateBedrooms/${companyUuid}`, data);
    }

    unlinkCompany(data: any, companyUuid: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/unlink/${companyUuid}`, data);
    }

    releaseCompany(companyUuid: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/release/${companyUuid}`, {});
    }

    disableCompany(companyUuid: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/disable/${companyUuid}`, {});
    }

    enableCompany(companyUuid: any): Observable<any> {
        return this.httpClient.put(`${this.url}/companies/enable/${companyUuid}`, {});
    }

}
