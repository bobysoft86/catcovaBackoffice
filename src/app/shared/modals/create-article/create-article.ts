import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

interface ArticleModalData {
  title?: string;
  article?: any;             // 👈 si llega -> modo EDIT
  categories: any[];         // [{id,name}]
  statuses: any[];           // [{id,name}]
  users: any[];              // [{id,name}]
}

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './create-article.html',
  styleUrl: './create-article.scss',
})
export class CreateArticlModalComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateArticlModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArticleModalData
  ) {

    // 1️⃣ Form base
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      ownerId: [null, Validators.required],
      categoryId: [null, Validators.required],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      minPlayers: [1, Validators.min(1)],
      maxPlayers: [4, Validators.min(1)],
      statusId: [null, Validators.required],
      value: [0, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    // 2️⃣ Si hay artículo → MODO EDIT
    if (this.data.article) {
      const a = this.data.article;

      this.form.patchValue({
        title: a.title,
        ownerId: a.ownerId,
        categoryId: a.categoryId,
        code: a.code,
        minPlayers: a.minPlayers,
        maxPlayers: a.maxPlayers,
        statusId: a.statusId,
        value: a.value,
        description: a.description,
      });
    }
    // 3️⃣ Si no hay → MODO CREATE
    else {
      // Si solo hay 1 user en meta → set automático
      if (this.data.users.length === 1) {
        this.form.patchValue({ ownerId: this.data.users[0].id });
      }
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Eliminamos datos no válidos para backend
    const payload = { ...this.form.value };

    // IMPORTANTE: Nunca enviar objetos completos
    delete (payload as any).owner;
    delete (payload as any).status;
    delete (payload as any).category;

    // Si estamos editando, devolvemos también el id del artículo
    if (this.data.article) {
      payload.id = this.data.article.id;
    }

    this.dialogRef.close(payload);
  }
}