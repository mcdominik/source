# Star Wars API Proxy (Nest.js + Redis)

Simple NestJS API proxy provides a simplified interface for retrieving information from the Star Wars API (SWAPI) with caching enabled powered by Redis (every resource pulled from the Star Wars API is cached
for 24 hours). It leverages https://swapi.dev/

## Table of Contents

- [How to run](#how-to-run)
- [Endpoints](#endpoints)
  - getFilmById
  - getFilms
  - getSpeciesById
  - getSpecies
  - getVehicleById
  - getVehicles
  - getStarshipById
  - getStarships
  - getPlanetById
  - getPlanets
- [Testing](#testing)
- [Possible Improvements](#possible-improvements)

## How to run

First run official container from redis:

```bash
docker run --name my-redis redis
```

Then clone and run main app;

```bash
git clone https://github.com/mcdominik/swapi-nest.git
```

```bash
cd swapi-nest
```

```bash
npm i && npm run start:dev
```

now main app should run on port 3001 and redis on port 6379.

## Endpoints

Use it with page, search (or both) as follows:
localhost:3001/api-proxy/DESIRED-OBJECT?page=PAGE-NUMBERsearch=YOUR-SEARCH-TERM

for example:

- localhost:3001/api-proxy/species?search=&page=1
- localhost:3001/api-proxy/species?search=human&page=
- localhost:3001/api-proxy/species?search=a&page=2

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

## Testing

Second db (index 1) was created only for testing purposes (db with index 1)
Iimplemented with jest, only caching mechanism is tested
run in root of this repository:

```bash
npm run test:e2e -- --runInBand --forceExit
```

## Possible Improvements

- finish testing (with mocked swapi)
- add better documentation (for example with Swagger)
