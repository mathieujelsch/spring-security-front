import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const BASE_URL = ["http://localhost:8080/"]

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private http: HttpClient) { }

  register (signRequest:any): Observable<any>{
    return this.http.post(BASE_URL + 'signup', signRequest);
  }

  login (loginRequest:any): Observable<any>{
    return this.http.post(BASE_URL + 'login', loginRequest);
  }

  hello(): Observable<any> {
    return this.http.get(BASE_URL + 'api/hello', {
      headers: this.createAuhtorizationHeader()
    })
  }

  displayPublications(): Observable<any>{
    return this.http.get(BASE_URL + 'publications', {
      headers: this.createAuhtorizationHeader()
    })
  }

  getComments(publicationId: number): Observable<any> {
    return this.http.get(BASE_URL + `publications/${publicationId}/comments`, {
      headers: this.createAuhtorizationHeader()
    });
  }

  displayMessages(): Observable<any>{
    return this.http.get(BASE_URL + 'publications/messages', {
      headers: this.createAuhtorizationHeader()
    })
  }

  getCustomerIdFromToken(): string | null {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      const jwtPayload = jwtToken.split('.')[1]; // Récupère la partie du payload du JWT
      const decodedPayload = atob(jwtPayload); // Décodage du base64
      const payloadObj = JSON.parse(decodedPayload); // Conversion en objet JSON

      return payloadObj.customerId; // Renvoie customerId du payload
    }
    return null;
  }

  deletePublication(publicationId: number): Observable<void> {
    return this.http.delete<void>(BASE_URL + `publications/${publicationId}`, {
      headers: this.createAuhtorizationHeader()
    });
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(BASE_URL + `comments/${commentId}`, {
      headers: this.createAuhtorizationHeader()
    });
  }

  toggleLikeComment(commentId: number): Observable<any> {
    const customerId = this.getCustomerIdFromToken();
    if (customerId) {
      const params = new HttpParams()
        .set('customerId', customerId);

      return this.http.post(BASE_URL + `comments/${commentId}/like`, null, {
        params,
        headers: this.createAuhtorizationHeader()
      });
    } else {
      console.error('User is not logged in or customerId is missing in JWT');
      return new Observable(); // Gérer le cas où l'utilisateur n'est pas connecté
    }
  }

  toggleLike(publicationId: number): Observable<any> {
    const customerId = this.getCustomerIdFromToken();
    if (customerId) {
      const params = new HttpParams()
        .set('customerId', customerId);

      return this.http.post(BASE_URL + `publications/${publicationId}/like`, null, {
        params,
        headers: this.createAuhtorizationHeader()
      });
    } else {
      console.error('User is not logged in or customerId is missing in JWT');
      return new Observable(); // Gérer le cas où l'utilisateur n'est pas connecté
    }
  }

  toggleDislike(publicationId: number): Observable<any> {
    const customerId = this.getCustomerIdFromToken();
    if (customerId) {
      const params = new HttpParams()
        .set('customerId', customerId);

      return this.http.post(BASE_URL + `publications/${publicationId}/dislike`, null, {
        params,
        headers: this.createAuhtorizationHeader()
      });
    } else {
      console.error('User is not logged in or customerId is missing in JWT');
      return new Observable(); // Gérer le cas où l'utilisateur n'est pas connecté
    }
  }


  createPublications(publicationRequest:any): Observable<any>{
    return this.http.post(BASE_URL + 'publications', publicationRequest, {
      headers: this.createAuhtorizationHeader()
    })
  }

  updatePublication(publicationId: number, publicationRequest:any): Observable<any> {
    return this.http.put(BASE_URL + `publications/${publicationId}`, publicationRequest, {
      headers: this.createAuhtorizationHeader()
    });
  }

  updateComment(commentId: number, publicationRequest:any): Observable<any> {
    return this.http.put(BASE_URL + `comments/${commentId}`, publicationRequest, {
      headers: this.createAuhtorizationHeader()
    });
  }

  commentPub(publicationId: number, publicationRequest:any): Observable<any> {
    const customerId = this.getCustomerIdFromToken();
    if (customerId) {
      const params = new HttpParams()
        .set('customerId', customerId);

      return this.http.post(BASE_URL + `publications/${publicationId}/comment`, publicationRequest, {
        params,
        headers: this.createAuhtorizationHeader()
      });
    } else {
      console.error('User is not logged in or customerId is missing in JWT');
      return new Observable(); // Gérer le cas où l'utilisateur n'est pas connecté
    }
  }

  private createAuhtorizationHeader() {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      console.log("JWT token found in local storage", jwtToken);
      return new HttpHeaders().set(
        "Authorization", "Bearer " + jwtToken
      )
    } else {
      console.log("JWT token not found in local storage");
      return new HttpHeaders();
    }
  }
}
