import { Place } from './data.interface';
import { User } from '../services/auth.service';

export interface VisitPlace {
  _id: string;
  user_id: User;
  place_id: Place;
  date_visit: string;
}

/*
export interface VisitPlace {
  _id: string;
  user_id: string;
  place_id: string;
  date_visit: string;
}
*/
