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

GETTING CHART TO UPDATE AS COUNTRY DATA IS DOWNLOADED

APPEND AXIS ONCE AND THEN UPDATE THEM. AXIS WERE BEING CREATED IN EVERY LOAD.

BAR CHARTS WERE PASTING OVER DATA ALREADY ON UI ON EVERY LOAD

d3 GENERAL UPDATE

USING DATA THAT RECORDS TOTAL CASES EVERY DAY. SO WHEN DOING COMPARISONS, THE START DATE SHOULD BE THE DAY BEFORE THE DATE USER SELECTED TO GET ACCURATE DATA. MONDAY TOTAL OF 4 CASES. TUESDAY TOTAL OF 6. WEDNESDAY TOTAL OF 9. TO GET THE CASES BETWEEN TUES AND WED, I SUBTRACT MONDAYS CASES (4) FROM WEDNESDAY'S CASES (9) AND GET 5 (2 RECORDED ON TUESDAY AND 3 RECORDED ON WED)

THIS CAUSED A BUG FOR EACH COUNTRY FOR THE FIRST DAY OF RECORDED DATA (BECAUSE IT COULDNT USE THE PREVIOUS DAY....IT WAS SUBTRACTING THE FIRST DAY). I FIXED THIS BY PLACING A BOOLEAN IN THE FIRST DAY OF DATA FOR ALL COUNTRIES AND CODING SO THAT ZER0 IS SUBTRACTED IF THIS IS THE START DATE THE USER SELECTED


PROMISE ALL AND FETCHES


When I get a 429 on initally loading data, the x axis goes mad and has a range of 10,000 even though the data doesn't contain such numbers. Fixes itself when more data loads: filter was removing values with null. I was then using population from [i] but this mapping was out because nulls had been removed

## Credits

https://dzone.com/articles/javascript-convert-date

<!-- https://stackoverflow.com/questions/17714705/how-to-use-checkbox-inside-select-option -->

https://stackoverflow.com/questions/3871547/js-iterating-over-result-of-getelementsbyclassname-using-array-foreach

https://stackoverflow.com/questions/25136760/from-date-i-just-want-to-subtract-1-day-in-javascript-angularjs

Check this out: https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/

https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions/8876069#8876069

https://bl.ocks.org/guilhermesimoes/be6b8be8a3e8dc2b70e2

http://jsfiddle.net/maggiehu/e0r2pzc0/5/

https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

//https://www.w3schools.com/jsref/jsref_round.asp

https://stackoverflow.com/questions/65657686/d3-cant-get-values-to-display-when-more-data-is-added-to-a-bar-chart/65669651#65669651

https://www.youtube.com/watch?v=IyIAR65G-GQ&t=2273s

https://medium.com/@kj_schmidt/show-data-on-mouse-over-with-d3-js-3bf598ff8fc2

https://www.udemy.com/course/writing-clean-code/

https://stackoverflow.com/questions/65636210/force-code-to-pause-executing-until-a-function-with-a-promise-in-it-has-conclude/65636329#65636329

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

https://www.youtube.com/watch?v=_8V5o2UHG0E&t=13053s

https://stackoverflow.com/questions/16919280/how-to-update-axis-using-d3-js

https://observablehq.com/@d3/lets-make-a-bar-chart?collection=@d3/lets-make-a-bar-chart

https://www.freecodecamp.org/learn/data-visualization/data-visualization-with-d3/

 https://www.w3schools.com/jsref/prop_screen_height.asp

 https://www.w3schools.com/jsref/prop_screen_width.asp