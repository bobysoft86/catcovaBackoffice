import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RentalModel } from '../interfaces/rental-model';


@Injectable({
  providedIn: 'root',
})

export class BookingService {
  private base = `${environment.apiUrl}/booking`;

  constructor(private http: HttpClient) {}

  getRentals() {
    return this.http.get<RentalModel[]>(this.base,{
    });
  }

searchBookings(query: string) {
    return this.http.get<RentalModel[]>(`${this.base}/search`, {
      params: { q: query },
    });
  }
getBookings() {
    return this.http.get<RentalModel[]>(`${this.base}`, {
    });
  }

  getBookingByID(id: number) {
    return this.http.get<RentalModel>(`${this.base}/getByid/${id}`, {
    });
  }

deleteBooking(id: number) {
    return this.http.put(`${this.base}/cancel/${id}`, {});
  }

createBooking(data: { userId: number; articleId: number; rentDate: string }) {
  return this.http.post(`${this.base}`, data);
}

  updateBooking(id: number, data: {
    articleId?: number;
    userId?: number;
    startDate?: string;
    statusId?: number;
  }) {
    return this.http.put(`${this.base}/${id}`, data);
  }
}