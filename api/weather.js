import {apiKey} from '../constants';
import axios from 'axios';

const locationsEndpoint = params =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const foreCastEndpoint = params =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.numOfDays}&aqi=no&alerts=no`;

const apiCall = async endpoint => {
  const option = {
    method: 'GET',
    url: endpoint,
  };
  try {
    const response = await axios.request(option);
    return response.data;
  } catch (error) {
    console.log(`Error: ${error}`);
    return null;
  }
};

export const fetchLocations = params => apiCall(locationsEndpoint(params));

export const fetchForeCast = params => apiCall(foreCastEndpoint(params));
