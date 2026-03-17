import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CompanyDocumentsResponse} from '../interfaces/company-document.interface';

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

    getCompaniesDocuments(companyUuid: string, currentYear: string): Observable<CompanyDocumentsResponse> {
        return this.httpClient.get<CompanyDocumentsResponse>(`${this.url}/company-documents/${companyUuid}/${currentYear}`);
    }

    uploadCompanyDocument(companyUuid: string, typeDocumentUuid: string, year: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type_document_uuid', typeDocumentUuid);
        formData.append('year', year);
        formData.append('company_uuid', companyUuid);

        return this.httpClient.post(`${this.url}/company-documents`, formData);
    }

    replaceCompanyDocument(documentUuid: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient.post(`${this.url}/company-documents/replace/${documentUuid}`, formData);
    }

    getDocumentFile(fileName: string, documentType: string): Observable<Blob> {
        return this.httpClient.get(`${this.url}/company-documents/file/${fileName}/${documentType}`, {
            responseType: 'blob'
        });
    }

}
