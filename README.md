## MS 2 Project

## Purpose of Project

Create a website that compares EU countries statistics in relation to covid 19

## User Stories

As a European user, I can see how my country compares to all other countries in the EU in relation to covid 19 cases and deaths

## Skeleton

Wireframe is available [here](./docs/wireframe.png)

## Testing

API CALLS:

Free version of the api only allows data for one country to be received per call. I did a promise all to get all 27 countries at once. I received an error after data for the first ten countries were received. This seems to be the limit using promise all. I am now going to get the data for all 27 countries in three batches of 9. This still requires an artificial delay using settimeout. There are 28 countries in EU!

COLONIES:

Denmark, Netherlands, France and the UK include former colonies from different parts of the world in their data. I used `.filter` to remove this data.

FAILED API CALLS


PROMISE ALL AND FETCHES

## Credits

https://stackoverflow.com/questions/313893/how-to-measure-time-taken-by-a-function-to-execute

https://documenter.getpostman.com/view/10808728/SzS8rjbc#4b88f773-be9b-484f-b521-bb58dda0315c

https://stackoverflow.com/questions/54896470/how-to-return-the-promise-all-fetch-api-json-data

https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all

https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript

https://ipinfo.io/pricing

https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/

https://www.youtube.com/watch?v=4A1cUp2wK2c

https://stackoverflow.com/questions/9422974/createelement-with-id

  // set attribute from Here; https://stackoverflow.com/questions/9422974/createelement-with-id
    //rest from: https://www.w3schools.com/jsref/met_node_appendchild.asp

    https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array

    https://ec.europa.eu/eurostat/documents/2995521/11081093/3-10072020-AP-EN.pdf/d2f799bf-4412-05cc-a357-7b49b93615f1
