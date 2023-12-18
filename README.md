# Star Wars API Proxy (Nest.js + Redis)

Simple NestJS API proxy provides a simplified interface for retrieving information from the Star Wars API (SWAPI) with caching enabled powered by Redis (every resource pulled from the Star Wars API is cached
for 24 hours). It leverages https://swapi.dev/
Created for recruiting purposes. (.env file available on main branch)


## Table of Contents
- [How to run](#how-to-run)
- [Endpoints](#endpoints)
  - [getFilmById]
  - [getFilms]
  - [getSpeciesById]
  - [getSpecies]
  - [getVehicleById]
  - [getVehicles]
  - [getStarshipById]
  - [getStarships]
  - [getPlanetById]
  - [getPlanets]
  - [getUniquePairsWithCountFromFilmsOpeningCrawl]
  - [getMostFrequentNameFromFilmsOpeningCrawl]
Testing[#testing]
Possible Improvements[#possible-improvements]

## How to run

App consists of 2 microservices
1. main app
2. redis
Instruction:
```bash
git clone https://github.com/mcdominik/swapi-nest.git
```

```bash
docker-compose up
```
now main app should run on port 3001 and redis on port 6379.
   

## Endpoints

Use use it with page, search (or both) as follows:
localhost:3001/api-proxy/<desired-object>?page=<number-of-page>search=<your-search-term>

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

⚠️ be aware that page size is fixed (10 objects)

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
  - name (string) or array of string (in case of multiple names with equal frequency)

## Testing

Testing was implemented with jest, only caching mechanism is tested
run in root of the folder:
```bash
npm run test:e2e -- --runInBand --forceExit
```
## Possible Improvements
- full testing (with mocked swapi)
- full documentation (for example with Swagger)






