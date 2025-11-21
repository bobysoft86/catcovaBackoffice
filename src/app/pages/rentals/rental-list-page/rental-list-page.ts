import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { RentalModel } from '../../../core/interfaces/rental-model';
import { RentalsService } from '../../../core/services/rentals.service';

@Component({
  selector: 'app-rental-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],  templateUrl: './rental-list-page.html',
  styleUrl: './rental-list-page.scss',
})
export class RentalListPage {
 private rentalsService = inject(RentalsService);

  displayedColumns = ['articleTitle', 'userName', 'startDate', 'endDate', 'status', 'actions'];
  rentals = signal<RentalModel[]>([]);
  totalRentals = 0;

  pageIndex = 0;
  pageSize = 10;

  searchControl = new FormControl('', { nonNullable: true });

  ngOnInit() {
    this.loadRentals();

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.loadRentals();
    });
  }

  loadRentals() {
    this.rentalsService
      .getRentals()
      .subscribe((res) => {
        this.rentals.set(res);
        this.totalRentals = res.length;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRentals();
  }

  createRental() {
    // Aquí abrirás modal o irás a una página de creación
    alert('Crear rental — luego conectamos el flujo real');
  }

  viewRental(id: number) {
    alert('Ver rental: ' + id);
    // this.router.navigate(['/rentals', id]); si quieres
  }
}