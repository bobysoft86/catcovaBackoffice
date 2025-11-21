import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  hidePassword = true;

  form;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

   login() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const { email, password } = this.form.value;

  this.auth.login({ email: email!, password: password! }).subscribe({
    next: (user) => {
      this.auth.setSession(user);

      const redirectTo =
        this.route.snapshot.queryParamMap.get('redirectTo') || '/dashboard';

      this.router.navigateByUrl(redirectTo);
    },
    error: () => {
      alert('Credenciales inválidas');
    }
  });
}
}