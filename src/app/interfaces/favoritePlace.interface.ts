import { Place } from './data.interface'; // Asumiendo que ya tienes una interfaz Site

export interface FavoritePlace {
  _id: string;
  user_id: string; // ID del usuario que lo guardó como favorito
  site_id: Place; // Si la API devuelve el objeto Site completo
  // site_id: string; // Si la API solo devuelve el ID del sitio
  date_added: string;
}