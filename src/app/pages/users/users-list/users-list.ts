import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UsersService } from '../../../core/services/user-service';
import { UserModel } from '../../../core/interfaces/user-model';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserModalComponent } from '../../../shared/modals/create-user-modal/create-user-modal';

@Component({
  selector: 'app-users-list',
  standalone: true,
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class UsersListPage implements OnInit {
  private usersService = inject(UsersService);
  private dialog = inject(MatDialog);

  displayedColumns = ['name', 'email', 'role','credit', 'actions'];

  // Todos los usuarios (resultado completo)
  fullUsers = signal<UserModel[]>([]);

  // Solo los de la página actual
  users = signal<UserModel[]>([]);

  totalUsers = 0;

  pageIndex = 0;
  pageSize = 10;

  searchControl = new FormControl('', { nonNullable: true });

  ngOnInit() {
    this.loadUsers();

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.pageIndex = 0;

      const q = value?.trim() || '';

      if (!q) {
        // Sin búsqueda -> cargamos todos de nuevo
        this.loadUsers();
        return;
      }

      // Si quieres que la búsqueda sea en el backend:
      this.usersService.searchUsers(q).subscribe((res: UserModel[]) => {
        this.fullUsers.set(res);
        this.updatePagedUsers();
      });
    });
  }

  // Carga todos los usuarios (sin paginación backend)
  loadUsers() {
    this.usersService.getUsers().subscribe((res: UserModel[]) => {
      this.fullUsers.set(res);
      this.updatePagedUsers();
    });
  }

  // Aplica el slice según pageIndex y pageSize
  private updatePagedUsers() {
    const all = this.fullUsers();
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.users.set(all.slice(start, end));
    this.totalUsers = all.length;
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedUsers();
  }

  createUser() {
    const dialogRef = this.dialog.open(CreateUserModalComponent, {
      width: '450px',
      data: { title: 'Crear nuevo usuario' },
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (!formData) return;

      this.usersService.createUser(formData).subscribe(() => {
        this.loadUsers();
      });
    });
  }



  deleteUser(id: number) {
    
    if (confirm('¿Eliminar usuario?')) {
      this.usersService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  goToEditUser(user: UserModel) {
  const dialogRef = this.dialog.open(CreateUserModalComponent, {
      width: '450px',
      data: { title: 'Editar Usuario', user: user },
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (!formData) return;

      this.usersService.updateUser(formData).subscribe(() => {
        this.loadUsers();
      });
    });

  }
}