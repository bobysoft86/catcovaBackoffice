import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RentalsService } from '../../../core/services/rentals.service';
import { RentalModel } from '../../../core/interfaces/rental-model';
import { BookingService } from '../../../core/services/bookingsService';
import { CreateBookingModal } from '../../../shared/modals/create-booking-modal/create-booking-modal';


@Component({
  selector: 'app-bookings-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],  templateUrl: './bookings-list-page.html',
  styleUrl: './bookings-list-page.scss',
})
export class BookingsListPage {
private rentalService = inject(BookingService);
  private dialog = inject(MatDialog);

  displayedColumns = ['articleTitle', 'userName', 'date', 'status', 'actions'];

  fullBookings = signal<RentalModel[]>([]);
  bookings = signal<RentalModel[]>([]);
  totalBookings = 0;

  pageIndex = 0;
  pageSize = 10;

  searchControl = new FormControl('', { nonNullable: true });

  ngOnInit() {
    this.loadBookings();

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const query = value?.trim() || '';
      this.pageIndex = 0;

      if (!query) {
        this.loadBookings();
        return;
      }

      this.rentalService.searchBookings(query).subscribe((res: RentalModel[]) => {
        this.fullBookings.set(res);
        this.updatePagedBookings();
      });
    });
  }

  loadBookings() {
    this.rentalService.getBookings().subscribe((res: RentalModel[]) => {
      this.fullBookings.set(res);
      this.updatePagedBookings();
    });
  }

  updatePagedBookings() {
    const all = this.fullBookings();
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.bookings.set(all.slice(start, end));
    this.totalBookings = all.length;
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedBookings();
  }

 createBooking() {
    const dialogRef = this.dialog.open(CreateBookingModal, {
      width: '480px',
      data: {}, // aquí podrías pasar userId o articleId preseleccionado si quisieras
    });

    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;

      this.rentalService.createBooking(payload).subscribe(() => {
        this.loadBookings();
      });
    });
  }

  goToBooking(b: RentalModel) {
    alert('Ver booking: ' + b.id);
  }

  deleteBooking(id: number) {
    if (confirm('¿Eliminar booking?')) {
      this.rentalService.deleteBooking(id).subscribe(() => {
        this.loadBookings();
      });
    }
  }
}