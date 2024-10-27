import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private readonly apiUrl: string;
  private readonly addUrl: string;

  constructor(private http: HttpClient) { 
    this.apiUrl = environment.url + '/api/photo';
    this.addUrl = '/addPhoto';
  }

  addPhoto(photo: Photo): Observable<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', photo.photo);
    formData.append('top', photo.top.toString());
    formData.append('left', photo.left.toString());
    formData.append('width', photo.width.toString());
    formData.append('height', photo.height.toString());
    return this.http.post<{ photoUrl: string }>(this.apiUrl + this.addUrl, formData);
  }
}