import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GameModel } from '../interfaces/game-model';


@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private base = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) { }

  getGames() {
    return this.http.get<GameModel[]>(this.base, {
    });
  }

  searchGames(query: string) {
    return this.http.get<GameModel[]>(`${this.base}/search`, {
      params: { q: query },
    });
  }

  deleteGame(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getArticleMeta() {
    return this.http.get<{
      categories: { id: number; name: string }[];
      users: { id: number; name: string; email: string; role: string }[];
      statuses: { id: number; name: string }[];
    }>(`${this.base}/meta`);
  }

  createGame(data: {
    title: string;
    ownerId: number;
    categoryId: number;
    code: string;
    minPlayers: number;
    maxPlayers: number;
    value: number;
    description: string;
  }) {
    console.log('Creating game with data:', data);
    return this.http.post(this.base, data);
  }

  updateGame(id: number, data: {
    title?: string;
    ownerId?: number;
    typeId?: number;
    code?: string;
    minPlayers?: number;
    maxPlayers?: number;
    value?: number;
    description?: string;
  }) {
    return this.http.put(`${this.base}/${id}`, data);
  }
}