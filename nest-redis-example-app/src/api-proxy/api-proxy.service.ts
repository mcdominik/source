import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ApiProxyService {
  constructor() {}

  async getFilms(page: number, search: string): Promise<Film[]> {
    const response = await axios.get(
      `${process.env.API_URL}/films/?search=${search}&page=${page}`,
    );
    return response.data;
  }

  async getFilmById(id: number): Promise<Film> {
    const response = await axios.get(`${process.env.API_URL}/films/${id}`);
    return response.data;
  }

  async getSpecies(page: number, search: string): Promise<Species[]> {
    const response = await axios.get(
      `${process.env.API_URL}/species/?search=${search}&page=${page}`,
    );
    return response.data;
  }

  async getSpeciesById(id: number): Promise<Species> {
    const response = await axios.get(`${process.env.API_URL}/species/${id}`);
    return response.data;
  }

  async getVehicles(page: number, search: string): Promise<Vehicle[]> {
    const response = await axios.get(
      `${process.env.API_URL}/vehicles/?search=${search}&page=${page}`,
    );
    return response.data;
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    const response = await axios.get(`${process.env.API_URL}/vehicles/${id}`);
    return response.data;
  }

  async getStarships(page: number, search: string): Promise<Starship[]> {
    const response = await axios.get(
      `${process.env.API_URL}/starships/?search=${search}&page=${page}`,
    );
    return response.data;
  }

  async getStarshipById(id: number): Promise<Starship> {
    const response = await axios.get(`${process.env.API_URL}/starships/${id}`);
    return response.data;
  }

  async getPlanets(page: number, search: string): Promise<Planet[]> {
    const response = await axios.get(
      `${process.env.API_URL}/planets/?search=${search}&page=${page}`,
    );
    return response.data;
  }

  async getPlanetById(id: number): Promise<Planet> {
    const response = await axios.get(`${process.env.API_URL}/planets/${id}`);
    return response.data;
  }

  getById(id: number) {
    const response = axios.get(`${process.env.API_URL}/${id}`);
    return response;
  }
}
