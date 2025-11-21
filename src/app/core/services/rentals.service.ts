import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RentalModel } from '../interfaces/rental-model';

@Injectable({
  providedIn: 'root',
})
export class RentalsService {
  private base = `${environment.apiUrl}/rental`;

  constructor(private http: HttpClient) {}

  getRentals() {
    return this.http.get<RentalModel[]>(this.base,{
    });
  }
  // Más adelante:
  // createRental(payload: CreateRentalDto) { ... }
}