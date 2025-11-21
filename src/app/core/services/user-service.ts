import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserModel } from '../interfaces/user-model';


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers() {

    return this.http.get<  UserModel[]>(this.base, {});
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  createUser(data: { name: string; email: string; password: string; role: string }) {
    return this.http.post(this.base, data);
  }

  updateUser( data: { id: number; name?: string; email?: string; password?: string; role?: string }) {
    return this.http.put(`${this.base}/${data.id}`, data);
  }

  searchUsers(query: string) {
    return this.http.get<UserModel[]>(`${this.base}/search`, {
      params: { q: query },
    });
  }
}