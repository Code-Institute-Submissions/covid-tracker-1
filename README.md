## MS 2 Project

## Purpose of Project

Create a website that compares EU countries statistics in relation to covid 19

## User Stories

As a European user, I can see how my country compares to all other countries in the EU in relation to covid 19 cases and deaths

## Skeleton

Wireframe is available [here](./docs/wireframe.png)

## Testing

API CALLS:

Free version of the api only allows data for one country to be received per call. I did a promise all to get all 27 countries at once. I received an error after data for the first ten countries were received. This seems to be the limit using promise all. I am now going to get the data for all 27 countries in three batches of 9. This still requires an artificial delay using settimeout.

## Credits

https://stackoverflow.com/questions/313893/how-to-measure-time-taken-by-a-function-to-execute

https://documenter.getpostman.com/view/10808728/SzS8rjbc#4b88f773-be9b-484f-b521-bb58dda0315c

https://stackoverflow.com/questions/54896470/how-to-return-the-promise-all-fetch-api-json-data

https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all

https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript

https://ipinfo.io/pricing

