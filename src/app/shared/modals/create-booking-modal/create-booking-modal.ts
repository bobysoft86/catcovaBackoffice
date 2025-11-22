import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { UsersService } from '../../../core/services/user-service';
import { UserModel } from '../../../core/interfaces/user-model';
import { GamesService } from '../../../core/services/game.service';
import { GameModel } from '../../../core/interfaces/game-model';

export interface CreateBookingModalData {
  userId?: number;
  articleId?: number;
}

@Component({
  selector: 'app-create-booking-modal',
  standalone: true,
 imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],  templateUrl: './create-booking-modal.html',
  styleUrl: './create-booking-modal.scss',
})
export class CreateBookingModal {
  form: FormGroup;

  users: UserModel[] = [];
  articles: GameModel[] = [];

  loadingUsers = false;
  loadingArticles = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateBookingModal>,
    @Inject(MAT_DIALOG_DATA) public data: CreateBookingModalData,
    private usersService: UsersService,
    private gamesService: GamesService
  ) {
    this.form = this.fb.group({
      userId: [data?.userId ?? null, [Validators.required]],
      articleId: [data?.articleId ?? null, [Validators.required]],
      rentDate: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadArticles();
  }

  loadUsers() {
    this.loadingUsers = true;
    this.usersService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
      },
    });
  }

  loadArticles() {
    this.loadingArticles = true;
    this.gamesService.getGames().subscribe({
      next: (res) => {
        // adapta según tu API: aquí supongo res: GameModel[]
        this.articles = Array.isArray(res) ? res : res ?? [];
        this.loadingArticles = false;
      },
      error: () => {
        this.loadingArticles = false;
      },
    });
  }

  close() {
    this.dialogRef.close(null);
  }

  save() {
    console.log(this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    // rentDate → formatear a ISO date (solo día) si tu backend lo quiere así
    const rentDate: string = value.rentDate instanceof Date
      ? value.rentDate.toISOString().split('T')[0]
      : value.rentDate;

    this.dialogRef.close({
      userId: value.userId,
      articleId: value.articleId,
      rentDate,
    });
  }
}