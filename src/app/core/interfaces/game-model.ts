export interface GameModel {
  id: number;
  title: string;
  typeId: number; 
  code : string;
  minPlayers: number;
  maxPlayers: number;
  value: number;
  description?: string;
  status: 'available' | 'reserved' | 'damaged';
  category?:any
  owner?: string;
}