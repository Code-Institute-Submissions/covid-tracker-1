## MS 2 Project

## Purpose of Project

Create a website that compares EU countries statistics in relation to covid 19

## User Stories

As a user, I can see how all European countries compare in relation to covid 19 cases and deaths


## Features

# Home Page

The home page will display bar charts showing the number of cases and deaths in each EU country, adjusted for population.

# Bar charts

The bar charts will be horizontal on smaller screens and vertical on larger screens. The values for each country is shown within the bar. When user hovers on a specific bar, the values in the other bars change to display the percentage difference between the country the user hovered on and the value in each bar. 

The font size changes to ensure the value fits the bar.

Hover on the bar or on the axis label displays a tooltip which shows the name of the country. The location of the tooltip is dependent on the location of the mouse pointer.

# Header

The nav bar will be contained within the header. The user can change the dates and the data within the bar chart will update. An error will display if the user sets the end date to before the start date.

The user can also remove countries from the bar charts using the "select countries" dropdown and decide which countries are highlighted using the "highlight countries" dropdown.

# Loading

While fetching the data from the API, a spinning amination is displayed along with details of the number of countries for which data has been fetched. The bar chart data will update (with a transition of 5 seconds) when new data is received from the API but it is still awaiting further data.

If there is an unexpected error fetching the API data, a message will display telling the user to expect a delay and more attempts are made to fetch the data.

If there is an unexpected error fetching the data four times, a message will display telling the user that there is a problem and to try again later.

# Product Limitations

The API will only accept 10 calls from the same API address within a 5 second period. Therefore I must make multiple calls to fetch the data.

## Typography and Color Scheme

Background grey: #eeecec

Dark grey: #8f897c

White: #f7f7f7

Black: #000

Dark Blue: #293d6a

Lighter Blue (bar color): steel-blue

Orange (highlighted bar): orange

Fonts: Nunito and sans-serif

## Skeleton

Wireframe is available [here](./docs/wireframe.png)

## Technology

HTML5
CSS3
JS
Gitpod
d3 js

Browser prefixes from https://autoprefixer.github.io/ 

## Best Practices

Used kebab-case for class selectors.

Used camel-case for javascript

Validated CSS using https://jigsaw.w3.org/css-validator.

Validated HTML using https://validator.w3.org/.





## Testing

Tested website on chrome, firefox and safari on a desktop map and tested on chrome and firefox on an andriod mobile.

Used google chrome simulator to test for responsiveness for moto g4, galaxy s5, pixel 2, pixel 2xl, iphone5/se, iphone 6/7/8, iphone 6/7/8 plus, iphone x, ipad, ipad pro, surface duo, galaxy fold and desktop.

# Test cases:

1. Fetching data works perfectly

An element will display summarising the purpose of the website.

Below it is an animation and an element stating "loading" and an element telling the user how many countries data has been downloaded for.

Below this is the bar chart which slowly loads (over 5 seconds with a bounce animation) everytime new data is downloaded.

When all countries are downloaded, the loading elements disappear, the values appear in the bar and the nav element appears with options to change the data and to change which countries are selected and highlighted.

The value for the EU average is highlighted in orange.

Below the bar chart is an element giving details about the data with links that open in new windows.

Below this is the footer with the copyright symbol.

On hovering on a bar in the bar chart, the bar's opacity changes and the name of the country appears beside the mouse. The values in the other bars change to show the percentage difference compared with the country bar that the user has hovered over.

When selecting dates in the nav bar the data in the bar chart will change to reflect the user's selection.

When selecting countries in the "select country" dropdown, the bar chart will update to reflect the users choices.

When selecting countries in the "highlight country" dropdown, the bar chart will update to reflect the users choices.



2. Fetching data doesn't work because of too many calls to the server within a short time period.

To test for this, reload the page shortly after the first download of data appears.

The console will show a 409 error from the API.

The code will take care of this. The data that has been displayed will appear. The countries for which the calls failed will be re-fetched after all the data for all other countries has been downloaded.


3. Fetching data doesn't work because of unexpected errors.

During development, it became clear that the api sometimes throws errors. Usually the api works again within a few seconds, but on rare occassions it has gone down for hours.

The catch in the promise all codes for this. If there is an unexpected error, there is a time out for 10 seconds before restarting the download process. The user receives a message on screen telling them there is an issue and asking them to be patient.

If the error occurs four times, the site stops trying to fetch data from the api, the loading animation disappers and the user is told that there is a problem and is asked to try again later.

4. Invalid dates

If the user tries to select dates where:

* The end date is before the start date

* The start date is before the latest date for which there is data available

* The end date is before the first recorded case in the European Union

An error message will appear in the nav bar and the bar chart will not update.



# Fixed Issues


Api calls: Free version of the api only allows data for one country to be received per call. I did a promise all to get all 27 countries at once. I received an error after data for the first ten countries were received. I have now coded to get the data for all 27 countries in three batches of 9. This still requires an artificial delay using settimeout.

Remove colonies from data: Denmark, Netherlands, France and the UK include former colonies from different parts of the world in their data. This caused errors because the data for these countries was formated differently. It was an array of objects where each object was either the country itself or one of its former colonies. The geographic location of the former colonies was refrequently on the other side of the planet - making this data irrelevant. I used `.filter` to remove this data.

Failed Api Calls: Occasionally, the still throws an error as a result of too many calls or throws an error when it is temporarily down. I have coded for both of these. If the problem is too many calls, the countries for which the calls failed will be re-fetched after all the data for all other countries has been downloaded. If there is an unexpected error, there is a time out for 10 seconds before restarting the download process. The user receives a message on screen telling them there is an issue and asking them to be patient. If the error occurs four times, the site stops trying to fetch data from the api, the loading animation disappers and the user is told that there is a problem and is asked to try again later.

When there is an error fetching data because of too many calls, spurious data was displaying in the bar chart before the correct data displaying when data from all 27 countries was fetched. This is because I was calculating the per capita data by using the index of the fetched data but I had filtered out null data so the wrong population was being used on the wrong countries. I fixed this but if I was starting again I would ensure the country code was contained in every piece of data. 

Axis and bars rendering everytime data is updated: This was due to a lack of understanding about the d3 general update.

Wrong start date: Need to download the day before the start date that the user selected to do comparions between start date and end date. For example if there were 4 total cases on Monday, 6 total cases on Tuesday and 9 total cases on Wednesday. To get the cases between Tuesday and Wednesday I need to subtract Monday's total cases (4) from Wednesday's total cases (9). This then caused a bug for each country for the first date of recorded data for that country because no data existed for the previous day. I fixed this by placing a boolean in the first day of data for all countries.

When unselecting countries, I was getting spurious results. I had an array of index numbers to delete and I was looping doing a for each and splicing within the foreach. The problem was that the index number I wanted to delete changed as a result of the previous splice. I fixed this by sorting the array from biggest to smallest number (index) before doing the foreach with the splice.

Font too large for vertical bars: For large values, especially comparisons (eg. +1000%), the text was wider than the bar. I coded to calculate the width of the text before it is rendered and, if it is wider than the bar, to reduce the font size until it fits.

Font too large for horizontal bars: I changed the location of the value on the bar depending on the width of the text. This was challenging because it wouldn't work relative to a constant value so I set it relative to a logged value (because longer widths required less of an adjustment). If the width remained too large, I reduced the font size until it fits.

# Open Issues

Some values can't be seen in the bars because the font size is too small or because the height of the bar is too small.

TO DO: if height is too small, reduce font size until it fits.

TO DO: if can't be read, include it in tooltip on hover.

## Version Control

This project was developed using Gitpod, committed to git and pushed to GitHub using the built in function within Gidpod.

## Deployment:

To deploy this page to GitHub Pages from its GitHub repository, the following steps were taken:

Log into GitHub.
From the list of repositories on the screen, select colmfah/covid-tracker.
From the menu items near the top of the page, select Settings.
Scroll down to the GitHub Pages section.
Under Source click the drop-down menu labelled None and select Master Branch
On selecting Master Branch the page is automatically refreshed, the website is now deployed.
Scroll back down to the GitHub Pages section to retrieve the link to the deployed website.
To deploy locally:

Follow this link to the Project GitHub repository: https://github.com/colmfah/covid-tracker
Click the Code button.
Copy the HTTPs URL.
In your local IDE open Git Bash.
Change the current working directory to the location where you want the cloned directory to be made.
Type git clone, and then paste the HTTPs URL you copied.
Press Enter. Your local clone will be created.
Open the cloned folder and double click on index.html



## Credits

JavaScript to Convert Date to MM/DD/YYYY Format: https://dzone.com/articles/javascript-convert-date

Code for CSS loader animation: https://projects.lukehaas.me/css-loaders/

Code for using checkboxes within select option: https://stackoverflow.com/questions/17714705/how-to-use-checkbox-inside-select-option

Code to calculate width of text before rendering: https://stackoverflow.com/questions/29031659/calculate-width-of-text-before-drawing-the-text

Code to get height of window: https://www.w3schools.com/jsref/prop_win_innerheight.asp

Code to wait for d3 animation to end before executing next code: https://gist.github.com/miguelmota/3faa2a2954f5249f61d9

Data - attributes: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes

Using tooltips in d3: https://chartio.com/resources/tutorials/how-to-show-data-on-mouseover-in-d3js/

Code to turn html collections into array: https://stackoverflow.com/questions/3871547/js-iterating-over-result-of-getelementsbyclassname-using-array-foreach

Code to subtract one day from a date: https://stackoverflow.com/questions/25136760/from-date-i-just-want-to-subtract-1-day-in-javascript-angularjs

Change values on hover: https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/

Get browser dimensions: https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions/8876069#8876069

Make vertical bars shrink correctly: https://bl.ocks.org/guilhermesimoes/be6b8be8a3e8dc2b70e2

Make vertical bars grow: http://jsfiddle.net/maggiehu/e0r2pzc0/5/

Check if all values in an array are equal: https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal

Use Math.min: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min

Get the index of an array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

Round numbers: https://www.w3schools.com/jsref/jsref_round.asp

Prevent values from disappearing when new data is loaded: https://stackoverflow.com/questions/65657686/d3-cant-get-values-to-display-when-more-data-is-added-to-a-bar-chart/65669651#65669651

The General Update pattern of d3: https://www.youtube.com/watch?v=IyIAR65G-GQ&t=2273s

Used d3 tool tips: https://medium.com/@kj_schmidt/show-data-on-mouse-over-with-d3-js-3bf598ff8fc2

Write clean code: https://www.udemy.com/course/writing-clean-code/

Promises within functions: https://stackoverflow.com/questions/65636210/force-code-to-pause-executing-until-a-function-with-a-promise-in-it-has-conclude/65636329#65636329

Covid 19 API: https://documenter.getpostman.com/view/10808728/SzS8rjbc#4b88f773-be9b-484f-b521-bb58dda0315c

Returning promise all fetch with json data: https://stackoverflow.com/questions/54896470/how-to-return-the-promise-all-fetch-api-json-data

Fetching an array of urls: https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all

d3 set attribute: https://stackoverflow.com/questions/9422974/createelement-with-id

Return the index of the greatest value in an array: https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array

EU population by country: https://ec.europa.eu/eurostat/documents/2995521/11081093/3-10072020-AP-EN.pdf/d2f799bf-4412-05cc-a357-7b49b93615f1

13 hour tutorial on d3: https://www.youtube.com/watch?v=_8V5o2UHG0E&t=13053s

d3 update axis: https://stackoverflow.com/questions/16919280/how-to-update-axis-using-d3-js

d3 bar chart: https://observablehq.com/@d3/lets-make-a-bar-chart?collection=@d3/lets-make-a-bar-chart

d3 course: https://www.freecodecamp.org/learn/data-visualization/data-visualization-with-d3/

check if JavaScript date is valid: https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript?page=1&tab=votes#tab-top

add event listeners: https://stackoverflow.com/questions/27609360/how-to-set-onclick-functions-to-multiple-elements

prevent code from running until user has finished typing: https://stackoverflow.com/questions/5946707/run-function-after-user-has-stopped-typing

covid image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_rphuMpMgFVV0J-l4bs7W_009_EArenDDQg&usqp=CAU

favicon: https://favicon.io/favicon-converter/

## Acknowledgements:
My Code Institute Mentor, Rohit