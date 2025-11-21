import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from "./layout/layout/layout";
import { Dashboard } from "./pages/dashboard/dashboard";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout, Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('catcova-backoffice');
}
