export interface RentalModel {
  id: number;
  articleId: number;
  userId: number;
  rentDate: string; // o Date
  returnDate: string;   // o Date
    status: boolean;
}