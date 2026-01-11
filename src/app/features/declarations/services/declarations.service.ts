import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment.development';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DeclarationsService {

    private url = environment.urlApi;
    private httpClient = inject(HttpClient);

    public declarationToken = 'LJ5niqoEdiZ9DxskgY2wnlslY6EkxXiS';

    getDeclarations(): Observable<any> {
        return this.httpClient.get(`${this.url}/statement/show`);
    }

    createDeclaration(companyUuid: any, data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/statement/store/${companyUuid}`, data);
    }

    verifyDeclaration(declarationUuid: any): Observable<any> {
        return this.httpClient.put(`${this.url}/statement/send-to-verify/${declarationUuid}`, []);
    }

    getDeclarationReceipt(fileName: any): Observable<any> {
        return this.httpClient.get(`${this.url}/statement/file/${fileName}/receipts`, { responseType: 'blob' });
    }

    getStatementFormat(declarationUuid: any): Observable<any> {
        return this.httpClient.get(`${this.url}/statement/format/${declarationUuid}`, { responseType: 'blob' });
    }

    deleteDeclaration(declarationUuid: any) {
        return this.httpClient.delete(`${this.url}/statement/delete/${declarationUuid}`);
    }


}
