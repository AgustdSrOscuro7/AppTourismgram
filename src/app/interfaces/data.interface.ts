export interface Country {
  _id: string;
  name: string;
  continent: string;
  population: string;
  img: string;
}

export interface City {
  _id: string;
  name: string;
  img: string;
  latitude: string;
  longitude: string;
  country_id: string;
}

export interface Celebrity {
  _id: string;
  name: string;
  img: string;
  profession: string;
  city_id: string;
}

export interface Place {
  _id: string;
  name: string;
  img: string;
  type: string;
  city_id: string;
}

export interface Dish {
  _id: string;
  name: string;
  img: string;
  description: string;
  city_id: string;
}
