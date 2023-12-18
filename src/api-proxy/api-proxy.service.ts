import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ApiProxyService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private SWAPI_PAGE_SIZE = 10;

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

  async getUniquePairsWithCountFromFilmsOpeningCrawl() {
    const openingCrawlsJoined = await this.getJoinedOpeningCrawls();
    const wordFrequencyArray =
      this.generateWordFrequencyArray(openingCrawlsJoined);
    return wordFrequencyArray;
  }

  async getJoinedOpeningCrawls() {
    const response = await axios.get(`${process.env.API_URL}/films`);

    let openingCrawlsJoined = '';
    for (const film of response.data.results) {
      openingCrawlsJoined += film.opening_crawl;
    }
    return openingCrawlsJoined;
  }

  generateWordFrequencyArray(text: string) {
    const wordsArray = text.toLowerCase().match(/\b\w+\b/g);
    const wordCounts = {};

    wordsArray.forEach((word) => {
      if (wordCounts[word]) {
        wordCounts[word]++;
      } else {
        wordCounts[word] = 1;
      }
    });

    return Object.entries(wordCounts).map(([word, count]) => ({
      word,
      count,
    }));
  }

  async getAllPeopleNames() {
    let names = [];
    const response = await axios.get(`${process.env.API_URL}/people`);
    names = response.data.results.map((person: Person) => person.name);
    const numberOfPages = Math.ceil(response.data.count / this.SWAPI_PAGE_SIZE);

    const peoplePromises = Array.from({ length: numberOfPages - 1 }, (_, i) =>
      axios.get(`${process.env.API_URL}/people/?page=${i + 2}`),
    );

    await Promise.all(peoplePromises);
    for (const peoplePromise of peoplePromises) {
      const people: Person[] = (await peoplePromise).data.results;
      for (const person of people) {
        names.push(person.name);
      }
    }
    return names;
  }

  async getMostFrequentNameFromFilmsOpeningCrawl() {
    const joinedOpeningCrawls = await this.getJoinedOpeningCrawls();
    const allNames = await this.getAllPeopleNames();
    const namesInOpeningCrawls = this.nameFinder(allNames, joinedOpeningCrawls);
    return this.findMostFrequentNames(namesInOpeningCrawls);
  }

  findMostFrequentNames(names: string[]): string | string[] {
    const nameCountMap: Record<string, number> = names.reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const maxCount = Math.max(...Object.values(nameCountMap));
    const mostFrequentNames = Object.keys(nameCountMap).filter(
      (name) => nameCountMap[name] === maxCount,
    );

    return mostFrequentNames.length === 1
      ? mostFrequentNames[0]
      : mostFrequentNames;
  }

  nameFinder(namesToFind: string[], text: string) {
    const foundNames: string[] = [];

    namesToFind.forEach((name) => {
      // params 'gi' for global and case-insensitive
      const regex = new RegExp(name, 'gi');
      const matches = text.match(regex);

      if (matches) {
        foundNames.push(...matches);
      }
    });

    return foundNames;
  }

  getById(id: number) {
    const response = axios.get(`${process.env.API_URL}/${id}`);
    return response;
  }
}
