# Corona API

This is a small API that fetches the corona case informations from [Worldometers](https://www.worldometers.info/coronavirus/). The Informations can be accessed through the endpoints.

## Usage

To start the app use the command `npm start`.

It is also possible to run the app as an docker container.
Simply build the image using the following command.

```
$ docker build -t coronaapi .
$ docker container run --name coronaapi -p 80:80 -d coronapi
```

Or just us the published version.

```
$ docker container run --name coronaapi -p 80:80 -d thedarkmen3000/coronaapi:latest
```

or use the published image with the command.

## Endpoints

### List all countries

To list the case figures of all countries use the entpoint `/api/cases`.

A list with all country in the following format will be returned.

```json
[
    {
        "isoCode": "US",
        "country": "USA",
        "totalCases": 6007873,
        "currentCases": 2508945,
        "recovered": 3315079,
        "deaths": 183849
    },
    {
        "isoCode": "DE",
        "country": "Germany",
        ...
    }
]
```

### Get information of spezific country

To get the information of a specific country the entrypoit `/api/cases/:country` can be used. `:country` must be the ISO-Code of the requested country.

Information will be returned in a similar facion to the `/api/cases` endpoint.