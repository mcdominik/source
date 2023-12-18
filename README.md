# Star Wars API Proxy

This NestJS API proxy provides a simplified interface for retrieving information from the Star Wars API (SWAPI) with caching enabled.
Created for recruiting purposes. 


## Table of Contents
- [Description](#description)
- [Methods](#endpoints)
  - [getFilmById](#get-film-by-id)
  - [getFilms](#get-films)
  - [getSpeciesById](#get-species-by-id)
  - [getSpecies](#get-species)
  - [getVehicleById](#get-vehicle-by-id)
  - [getVehicles](#get-vehicles)
  - [getStarshipById](#get-starship-by-id)
  - [getStarships](#get-starships)
  - [getPlanetById](#get-planet-by-id)
  - [getPlanets](#get-planets)
  - [getUniquePairsWithCountFromFilmsOpeningCrawl](#get-unique-pairs-with-count-from-films-opening-crawl)
  - [getMostFrequentNameFromFilmsOpeningCrawl](#get-most-frequent-name-from-films-opening-crawl)

## Description

## Endpoints

Use use it with page, search (or both) as follows:
/api-proxy/films?page=<number-of-page>search=<your-search-term>

### getFilmById

- **Endpoint:** `/api-proxy/films/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (number): The ID of the film.
- **Returns**
  - Film object
    
### getFilms

- **Endpoint:** `/api-proxy/films`
- **Method:** `GET`
- **Parameters:**
  - `page` (number)[optional]: The page number.
  - `search` (string)[optional]: Search term.
- **Returns**
  - List of Film objects
    
### getSpeciesById

- **Endpoint:** `/api-proxy/species/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (number): The ID of the species.
- **Returns**
  - Species object

### getSpecies

- **Endpoint:** `/api-proxy/species`
- **Method:** `GET`
- **Parameters:**
  - `page` (number)[optional]: The page number.
  - `search` (string)[optional]: Search term.
- **Returns**
  - List of Species objects

...analogically for Vehicles, Starships and Planets.

be aware that page size is fixed (10 objects)

### getUniquePairsWithCountFromFilmsOpeningCrawl
- **Endpoint:** `/api-proxy/films/crawls-with-unique-pairs`
- **Method:** `GET`
- **Returns**
  - uniqe pairs (word with count) from all opening crawls from the films

### getMostFrequentNameFromFilmsOpeningCrawl
counts most frequent name (word with count) from all opening crawls from the films
- **Endpoint:** `/api-proxy/people/most-frequent-name-from-crawl`
- **Method:** `GET`
- **Returns**
  - name string or array of string (in case of multiple names with equal frequency)





