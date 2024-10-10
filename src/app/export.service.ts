import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private apiUrl = 'https://localhost:7168/api/Export';

 constructor(private http: HttpClient) { }

  //  downloadExcel(data: any): Observable<Blob> {
  //   return this.http.post(this.apiUrl, data, {
  //     responseType: 'blob'  // Set response type to blob for file download
  
    
  downloadExcel(formData: FormData): Observable<Blob> {
    return this.http.post<Blob>(`${this.apiUrl}/DownloadExcel`, formData, {
       responseType: 'blob' as 'json'
     });
   }
 }
