import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export interface CreateUserModalData {
  title?: string;
  user?: any; // si hay user -> EDIT, si no -> CREATE
}

@Component({
  selector: 'app-create-user-modal',
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
  templateUrl: './create-user-modal.html',
  styleUrl: './create-user-modal.scss',
})
export class CreateUserModalComponent {
  fb = new FormBuilder();

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateUserModalData
  ) {
    // 1) Creamos el form con valores por defecto
    this.form = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['CUSTOMER', [Validators.required]], // por defecto CUSTOMER
      phone: ['', [Validators.required]],
      password: [''],
    });

    // 2) Si viene user => modo EDIT
    if (this.data?.user) {
      this.form.patchValue({
        id: this.data.user.id,
        name: this.data.user.name,
        email: this.data.user.email,
        role: this.data.user.role,
        phone: this.data.user.phone,
      });

      // En editar, password NO es obligatorio
      this.form.get('password')!.clearValidators();
      this.form.get('password')!.updateValueAndValidity({ emitEvent: false });
    } else {
      // 3) Si no hay user => modo CREATE, password obligatorio
      this.form.get('password')!.setValidators([
        Validators.required,
        Validators.minLength(6),
      ]);
      this.form.get('password')!.updateValueAndValidity({ emitEvent: false });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData: any = this.form.value;

    // Si estamos editando y el password está vacío -> no lo enviamos
    if (this.data?.user && !formData.password) {
      delete formData.password;
    }

    this.dialogRef.close(formData);
  }

  close() {
    this.dialogRef.close(null);
  }
}