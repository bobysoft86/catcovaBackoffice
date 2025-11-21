import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { GameModel } from '../../../core/interfaces/game-model';
import { GamesService } from '../../../core/services/game.service';
import { CreateArticlModalComponent } from '../../../shared/modals/create-article/create-article';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-articles-listpage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './articles-listpage.html',
  styleUrl: './articles-listpage.scss',
})
export class ArticlesListpage implements OnInit {
  
  private gamesService = inject(GamesService);
  private dialog = inject(MatDialog);

  displayedColumns = ['title', 'category', 'status', 'owner', 'actions'];

  // TODOS los juegos (resultado completo)
  fullGames = signal<GameModel[]>([]);

  // Solo la página actual
  games = signal<GameModel[]>([]);

  totalGames = 0;

  pageIndex = 0;
  pageSize = 10;

  searchControl = new FormControl('', { nonNullable: true });

  ngOnInit() {
    this.loadGames();

    // Búsqueda con debounce
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.pageIndex = 0;

      const q = value?.trim() || '';

      if (!q) {
        this.loadGames();
        return;
      }

      this.gamesService.searchGames(q).subscribe((res: GameModel[]) => {
        this.fullGames.set(res);
        this.updatePagedGames();
      });
    });
  }

  loadGames() {
    this.gamesService.getGames().subscribe((res: GameModel[]) => {
      this.fullGames.set(res);
      this.updatePagedGames();
    });
  }

  // 🔥 Aplica slice según pageIndex y pageSize
  private updatePagedGames() {
    const all = this.fullGames();
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.games.set(all.slice(start, end));
    this.totalGames = all.length;
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedGames();
  }

createArticle() {
  this.gamesService.getArticleMeta().subscribe(meta => {
    const dialog = this.dialog.open(CreateArticlModalComponent, {
      width: '550px',
      data: {
        title: 'Crear artículo',
        categories: meta.categories,
        statuses: meta.statuses,
        users: meta.users
      }
    });

    dialog.afterClosed().subscribe(data => {
      if (!data) return;
      this.gamesService.createGame(data).subscribe(() => this.loadGames());
    });
  });
}

editArticle(article: GameModel) {
  this.gamesService.getArticleMeta().subscribe(meta => {
    const dialog = this.dialog.open(CreateArticlModalComponent, {
      width: '550px',
      data: {
        title: 'Editar artículo',
        article,
        categories: meta.categories,
        statuses: meta.statuses,
        users: meta.users
      }
    });

    dialog.afterClosed().subscribe(data => {
      if (!data) return;
      const id = data.id;  // viene desde el modal
      delete data.id;
      this.gamesService.updateGame(id, data).subscribe(() => this.loadGames());
    });
  });
}

  deleteGame(id: number) {
    if (confirm('¿Eliminar juego?')) {
      this.gamesService.deleteGame(id).subscribe(() => {
        this.loadGames();
      });
    }
  }
}