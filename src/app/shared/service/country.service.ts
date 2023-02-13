import { Injectable } from '@angular/core';

const fetch = require('node-fetch');

const url = 'https://rest-country-api.p.rapidapi.com/';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '68d2855624msh2af7aed9cd9a3a8p1cf485jsn059ff3f7fb92',
    'X-RapidAPI-Host': 'rest-country-api.p.rapidapi.com',
  },
};

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor() {}

  getAllCounties() {
    return fetch(url, options)
      .then((res) => res.json())
      .catch((err) => console.error('error:' + err));
  }
}
