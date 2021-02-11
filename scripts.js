
//https://www.w3schools.com/jsref/prop_win_innerheight.asp
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
let expanded = false;
let allCountriesDownloaded = false;
let apiFailedCalls = 0;
//https://stackoverflow.com/questions/17714705/how-to-use-checkbox-inside-select-option
let tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");
let highlightedCountries = ["eu"];
const EUDATASET = [
    { country: "austria", countryCode: "at", population: 88.588 },
    { country: "belgium", countryCode: "be", population: 89.011 },
    { country: "bulgaria", countryCode: "bg", population: 69.515 },
    { country: "croatia", countryCode: "hr", population: 40.582 },
    { country: "cyprus", countryCode: "cy", population: 08.88 },
    { country: "czechia", countryCode: "cz", population: 106.939 },
    { country: "denmark", countryCode: "dk", population: 58.228 },
    { country: "estonia", countryCode: "ee", population: 13.29 },
    { country: "finland", countryCode: "fi", population: 55.253 },
    { country: "france", countryCode: "fr", population: 670.988 },
    { country: "germany", countryCode: "de", population: 831.667 },
    { country: "greece", countryCode: "gr", population: 107.097 },
    { country: "hungary", countryCode: "hu", population: 97.695 },
    { country: "ireland", countryCode: "ie", population: 49.638 },
    { country: "italy", countryCode: "it", population: 602.446 },
    { country: "latvia", countryCode: "lv", population: 19.077 },
    { country: "lithuania", countryCode: "lt", population: 27.941 },
    { country: "luxembourg", countryCode: "lu", population: 6.261 },
    { country: "malta", countryCode: "mt", population: 5.146 },
    { country: "netherlands", countryCode: "nl", population: 174.076 },
    { country: "poland", countryCode: "pl", population: 379.581 },
    { country: "portugal", countryCode: "pt", population: 102.959 },
    { country: "romania", countryCode: "ro", population: 193.18 },
    { country: "slovakia", countryCode: "sk", population: 54.579 },
    { country: "slovenia", countryCode: "si", population: 20.959 },
    { country: "spain", countryCode: "es", population: 473.3 },
    { country: "sweden", countryCode: "se", population: 103.276 },

];
let eu = EUDATASET.map((e) => e.country);
let countriesDownloaded = 0;
let barChartAxisRendered = { casesPerCapita: false, deathsPerCapita: false }
let latestCommonDate = new Date();
let verticalBarChart = false;
let measurements = {};
let timer = null;

/**
* copens dropbown
* @param {string} checkboxType name of check box type
**/
function showCheckboxes(checkboxType) {

    if (checkboxType === "highlight-country-checkboxes") {
        let highlightCountry = document.getElementById("highlight-country-checkboxes")
        let highlightCountryLabels = [...highlightCountry.getElementsByTagName("label")]
        highlightCountryLabels.forEach(e => { e.style.display = "block" })
        removeDeletedCountriesFromHighlights()
    }

    let checkboxes = document.getElementById(checkboxType);
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
        let width = document.getElementById(`overSelect-${checkboxType}`).clientWidth;
        let checkboxHTML = [...document.getElementsByClassName("checkboxes")];
        checkboxHTML.forEach(e => e.style.width = `${width}px`);
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

/**
* closes dropbown
* @param {string} checkboxType name of check box type
**/
function collapseCheckboxes(checkboxType) {
    let checkboxes = document.getElementById(checkboxType);
    checkboxes.style.display = "none";
    expanded = false;
}

/**
* return list of countries that should not be displayed
** @returns {array} list of countries that should not be displayed
**/

function getUncheckedCountries() {
    // https://stackoverflow.com/questions/3871547/js-iterating-over-result-of-getelementsbyclassname-using-array-foreach
    let unCheckedCountries = [...document.getElementsByClassName("select-country")].filter(e => !e.checked).map(e => e.dataset.countryCode);
    return unCheckedCountries;
}

/**
* sets list of countries to highlight
**/

function setHighlightedCountries() {
    highlightedCountries = [...document.getElementsByClassName("highlight-country")].filter(e => e.checked).map(e => e.dataset.countryCode);
}

/**
* displays Nav
**/

function displayNav() {
    document.getElementById("nav").style.display = "flex";
}

/**
* sets default date values
**/

function setDefaultDates() {
    if (countriesDownloaded < 27) { return; }
    document.getElementById("end-date").value = convertDateFormat(latestCommonDate).toString();
    document.getElementById("end-date").max = convertDateFormat(latestCommonDate).toString();
    document.getElementById("start-date").max = convertDateFormat(latestCommonDate).toString();
}

/**
* converts date into format for use in html
* @param {number} date date in the format of a number that is the number of seconds between the 1 Jan 1970 and the date.
* @returns {string} date in a format for use in the html
**/

function convertDateFormat(date) {
    //https://dzone.com/articles/javascript-convert-date
    let month = new Date(date).getMonth() + 1;
    let day = new Date(date).getDate();
    let year = new Date(date).getFullYear();
    if (month < 10) {
        month = `0${month.toString()}`;
    }
    if (day < 10) {
        day = `0${day.toString()}`;
    }
    return `${year}-${month}-${day}`;
}

/**
* converts date into format for display on user interface
* @param {number} date date in the format of a number that is the number of seconds between the 1 Jan 1970 and the date.
* @returns {string} date in a format for display on user interface that user will understand
**/

function convertDateFormatForDisplay(date) {
    //https://dzone.com/articles/javascript-convert-date
    let month = new Date(date).getMonth() + 1;
    let day = new Date(date).getDate();
    let year = new Date(date).getFullYear();
    if (month < 10) {
        month = `0${month.toString()}`;
    }
    if (day < 10) {
        day = `0${day.toString()}`;
    }
    return `${day}-${month}-${year}`;
}

/**
* checks for errors in the dates user submitted
* @param {number} startDate the start date in the format of a number that is the number of seconds between the 1 Jan 1970 and the start date.
* @param {number} endDate the end date in the format of a number that is the number of seconds between the 1 Jan 1970 and the start date.
* @returns {string} error message to display on user interface
**/

function isValidDate(d) {
    //https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript?page=1&tab=votes#tab-top
    return d instanceof Date && !isNaN(d);
}

function checkDateErrors(startDate, endDate) {
    let error = "";

    let isStartDateValid = isValidDate(startDate)
    let isEndDateValid = isValidDate(endDate)


    if (!isStartDateValid) {
        error = "Start date is not valid"
    }
    else if (!isEndDateValid) {
        error = "End date is not valid"
    }
    else if (endDate < startDate) {
        error = "Start date must be before end date";
    } else if (startDate > latestCommonDate || endDate > latestCommonDate) {
        error = `No data is available after ${convertDateFormatForDisplay(latestCommonDate)}`
    } else if (endDate < new Date("2020-01-24") || startDate < new Date("2020-01-24")) {
        error = `There were no covid cases in EU before 24th January 2020`
    }
    else {
        document.getElementById("users-countries").style.display = "flex";
    }
    if (error !== "") { document.getElementById("users-countries").style.display = "none"; }
    document.getElementById("nav-error").innerHTML = error;
    return error;
}

function waitForTypingToFinish(changeHighlightedCountry) {
    //https://stackoverflow.com/questions/5946707/run-function-after-user-has-stopped-typing
    clearTimeout(timer);
    timer = setTimeout(() => {
        changeRequestedData(changeHighlightedCountry)
    }, 1000);
}

/**
* filters data based on user input
* @param {boolean} changeHighlightedCountry has the user changed the list of countries that should be highlighted?
**/

function changeRequestedData(changeHighlightedCountry) {

    if (changeHighlightedCountry !== true) {
        d3.selectAll(".casesPerCapita-values-in-bar").style("opacity", "0");
        d3.selectAll(".deathsPerCapita-values-in-bar").style("opacity", "0");
    }

    let startDate = new Date(document.getElementById("start-date").value);
    let endDate = new Date(document.getElementById("end-date").value);
    const DATEERROR = checkDateErrors(startDate, endDate);

    if (DATEERROR !== "") { return; }
    //https://stackoverflow.com/questions/25136760/from-date-i-just-want-to-subtract-1-day-in-javascript-angularjs
    //I want the date before the start date selected so that I get correct values when I subtract cases, deaths etc.
    startDate = new Date(startDate.setDate(startDate.getDate() - 1)).setHours(0, 0, 0, 0);
    endDate = endDate.setHours(0, 0, 0, 0);
    let countryData = EUDATASET.map((country) =>
        JSON.parse(localStorage.getItem(country.countryCode))
    );
    //don"t filter out nulls here. You use the index in next function to assign the correct data to the correct country
    Promise.all(countryData).then(allData => {
        dataForGraphs(startDate, endDate, allData)
    }).catch(err => { })
}

/**
* decides whether to display vertical or horizontal bar charts
**/

function setBarChartType() {
    if (windowWidth >= 1000) { verticalBarChart = true; }
}

/**
* returns data sorted by highest value
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
** @returns {array} data sorted by highest value
**/

function sortByHighestValues(data, metric) {
    return data.sort((a, b) => b[metric] - a[metric]);
}

/**
* makes tooltip visible. This is used to display data on screen
* @param {object} barData data for a specific country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function displayToolTip(barData, metric) {
    if (countriesDownloaded < 27) { return; }
    let value = ""
    if (barData.comparison !== undefined) { value = barData.comparison }
    else { value = barData[metric] }
    tooltip.text(`${barData.country}: ${value}`);
    tooltip.style("visibility", "visible");
    if (!verticalBarChart) {
        tooltip.style("font-size", "12px")
        tooltip.style("padding", "1px")
    }

}

/**
* gets the width of text before it is rendered
* @param {string} text the text to get the width of
* @param {number} fontSize the font size of the text
* @param {string} fontFace the name of the font
** @returns {number} width of text when rendered
**/

function getTextWidth(text, fontSize, fontFace) {
    //https://stackoverflow.com/questions/29031659/calculate-width-of-text-before-drawing-the-text
    var canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    context.font = fontSize + "px " + fontFace;
    return context.measureText(text).width;
}


/**
* gets the width of a bar
* @param {object} countryData data for a specific country
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
** @returns {number} width of bar
**/

function getBarWidth(countryData, data, metric) {
    const xScale = setXScale(data, metric);
    if (verticalBarChart) { return xScale.bandwidth(); }
    return xScale(countryData[metric]);
}


/**
* sets maximum width for bar
* @param {array} data data to display for each country
* @param {object} countryData data for a specific country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
** @return {number} the bar's width
**/

function setBarMaxWidth(data, metric, countryData) {
    let barWidth = getBarWidth(countryData, data, metric);
    if (barWidth > 200) { barWidth = 200; }
    return barWidth;
}

/**
* returns country data
* @param {string} countryCode data for a specific country
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
** @returns {array} data for country
**/

function getCountryData(countryCode, data, metric) {
    return data.filter(e => e.countryCode === countryCode)[0]
}

/**
* calculates font size so text fits within bar
* @param {object} countryData data for a specific country
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
** @returns {number} the font size
**/

function calculateFontSize(countryData, data, metric) {

    let text = decideTextToReturn(countryData, metric, data);
    let textWidth = 0;
    let barWidth = getBarWidth(countryData, data, metric);
    let fontSize = 0;

    if (verticalBarChart) {
        //https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions/8876069#8876069
        fontSize = ((0.25 / data.length) * Math.max(windowWidth || 0, window.innerWidth || 0)).toString();
        textWidth = getTextWidth(text, fontSize, "sans-serif");
        barWidth = setBarMaxWidth(data, metric);
    } else {
        fontSize = 12;
        textWidth = getTextWidth(text, fontSize, "sans-serif");
    }
    while (textWidth > 0.95 * barWidth) {
        fontSize = fontSize - 1;
        textWidth = getTextWidth(text, fontSize, "sans-serif");
    }
    return Math.min(fontSize, 90);
}

/**
* sets the position on the x axis for the values within the bar
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
* @param {object} countryData data for a specific country
** @returns {number} x axis position
**/

function setXPositionValueInBars(data, metric, countryData) {
    let xScale = setXScale(data, metric);
    if (verticalBarChart) {
        let adjustment = 0;
        let width = getBarWidth(countryData, data, metric);
        if (width > 200) { adjustment = (width - 200) / 2; }
        return xScale(countryData.countryCode) + (setBarMaxWidth(data, metric) / 2) + adjustment;
    } else {
        let fontSize = calculateFontSize(countryData, data, metric);
        let text = decideTextToReturn(countryData, metric);
        let textWidth = getTextWidth(text, fontSize, "sans-serif");
        let reduction = 0;
        reduction = textWidth - Math.log(10000);
        return (xScale(countryData[metric]) + 20 - reduction);
    }
}

/**
* decides y value for displaying on screen
* @param {array} data data to display for each country
* @param {object} countryData data for a specific country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
** @return {number} value or comparison to display within bar
**/

function setYPositionValueInBars(data, countryData, metric) {

    let yScale = setYScale(metric, data)
    if (verticalBarChart) {
        return yScale(countryData[metric]) + measurements.margin.top + setBarMaxWidth(data, metric) / 3;
    } else {
        return (yScale(countryData.countryCode) + yScale.bandwidth() / 2 + measurements.margin.top);
    }
}

/**
* decides whether to display value or comparison within bar
* @param {object} countryData data for a specific country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
** @return {string or number} value or comparison to display within bar
**/

function decideTextToReturn(countryData, metric) {
    let text = "";
    if (countryData.comparison !== undefined) { text = countryData.comparison; }
    else if (countryData[metric] < 0.001) { text = ""; }
    else { text = countryData[metric]; }
    return text;
}

/**
* decides positioning of text within bar
* * @returns {string} to set positioning of text
**/

function setTextAnchor() {
    if (verticalBarChart) { return "middle"; }
    else { return "start"; }
}

/**
* decides positioning of text within bar
* * @returns {string} to set positioning of text
**/

function setAlignmentBaseline() {
    if (verticalBarChart) { return "auto"; }
    else { return "central"; }
}

/**
* adds hover effect from bar when user moves mouse out of value within bar
* @param {object} event the event data
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function applyHoverEffectsToBar(event, metric) {
    let selectedChart = document.getElementById(metric);
    let allBars = [...selectedChart.getElementsByTagName("rect")];
    let allBarData = allBars.map(e => e.__data__);
    let countryCodes = allBars.map(e => e.dataset.countryCode);
    let index = countryCodes.indexOf(event.target.dataset.countryCode);
    selectedChart.getElementsByTagName("rect")[index].style.opacity = "0.5";
    displayToolTip(allBarData[index], metric);
    tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
}

/**
* removes hover effect from bar when user moves mouse out of value within bar
* @param {object} event the event data
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function removeHoverEffectsFromBar(event, metric) {
    tooltip.style("visibility", "hidden");
    let selectedChart = document.getElementById(metric);
    let allBars = [...selectedChart.getElementsByTagName("rect")];
    let countryCodes = allBars.map(e => e.dataset.countryCode);
    let index = countryCodes.indexOf(event.target.dataset.countryCode);
    selectedChart.getElementsByTagName("rect")[index].style.opacity = "1";
}

/**
* renders the values within the bars
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
* @param {object} barData data for a specific country
* @param {number} countriesDownloaded number of countries for which data has been downloaded from the api
* @param {number} barWidth width of each bar
**/

function renderValuesInBars(data, metric, barData, countriesDownloaded, barWidth) {
    if (countriesDownloaded < 27) { return; }

    let values = d3.select(`#${metric}`)
        .selectAll(`.${metric}-values-in-bar`)
        .data(data, d => d.countryCode);

    values
        .enter()
        .append("text")
        .merge(values)
        .attr("class", `${metric}-values-in-bar`)
        .attr("text-anchor", setTextAnchor())
        .attr("alignment-baseline", setAlignmentBaseline())
        .attr("data-countryCode", d => d.countryCode)
        .attr("x", countryData => setXPositionValueInBars(data, metric, countryData))
        .attr("y", countryData => setYPositionValueInBars(data, countryData, metric))
        .style("fill", "#f7f7f7")
        .style("font-size", countryData => calculateFontSize(countryData, data, metric))
        .style("opacity", "1")
        .text(countryData => decideTextToReturn(countryData, metric, data))
        .on("mouseover", (event, barData) => { applyHoverEffectsToBar(event, metric); displayComparisons(event, barData, data, metric); })
        .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
        .on("mouseout", (event) => { removeHoverEffectsFromBar(event, metric); removeComparisons(data, metric); });

    values.exit().remove();
}

/**
* removes comparisons from bars and replaces them with original values
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function removeComparisons(data, metric) {
    if (!allCountriesDownloaded) { return }
    let dataWithOutComparisons = data.map(countryData => {
        delete countryData.comparison;
        return countryData;
    });
    renderValuesInBars(dataWithOutComparisons, metric);
}

/**
* sets the speed for the chart animations
**/

function setSpeed() {
    if (!allCountriesDownloaded) {
        return 4500;
    }
    else {
        return 1000;
    }
}

/**
* sets the charts margins
**/

function setMargins() {
    let margin = { top: 50, right: 0, bottom: 30, left: 30 };
    if (verticalBarChart) { margin.left = 0; }
    measurements.margin = margin;
}

/**
* sets the x scale
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function setXScale(data, metric) {
    if (verticalBarChart) {
        return d3
            .scaleBand()
            .domain(data.map((d) => d.countryCode))
            .range([measurements.margin.left, measurements.width])
            .padding(0.2);
    } else {
        return d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d[metric])])
            .range([0, measurements.innerWidth]);
    }
}

/**
* sets the y scale
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function setYScale(metric, data) {
    if (verticalBarChart) {
        return d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d[metric])])
            .range([measurements.innerHeight, 0]);
    } else {
        return d3
            .scaleBand()
            .domain(data.map((d) => d.countryCode))
            .range([0, measurements.innerHeight])
            .padding(0.2);
    }
}

/**
* renders x axis for the first time
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function renderXAxis(data, metric) {
    if (!verticalBarChart) { return; }
    let xScale = setXScale(data, metric);
    const xAxis = d3.axisBottom(xScale).ticks(0);
    d3.select(`#${metric}`).attr("width", measurements.width).attr("height", measurements.height)
        .append("g")
        .attr("transform", `translate(${measurements.margin.left}, ${measurements.margin.top})`)
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${measurements.innerHeight + measurements.margin.top})`)
        .call(xAxis)
        .selectAll(".tick line").remove();
}

/**
* renders y axis for the first time.
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function renderYAxis(data, metric) {
    if (verticalBarChart) { return; }
    let yScale = setYScale(metric, data);
    const yAxis = d3.axisLeft(yScale);
    d3.select(`#${metric}`).attr("width", measurements.width).attr("height", measurements.height)
        .append("g")
        .attr("transform", `translate(${measurements.margin.left}, ${measurements.margin.top})`)
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll(".tick line").remove();
}

/**
* decides what the chart title should be
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
** @returns {string} the chart title
**/

function decideChartTitleText(metric) {

    if (metric === "casesPerCapita") {
        return "Cases Per 100,000 People"
    } else if (metric === "deathsPerCapita") {
        return "Deaths Per Million People"
    } else { return "title error" }

}

/**
* renders chart title
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function renderChartTitle(data, metric) {

    d3.select(`#${metric}`)
        .append("text")
        .attr("fill", "black")
        .attr("y", 45)
        .attr("x", measurements.width / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16")
        .text(decideChartTitleText(metric));
}


/**
* updates already rendered y axis
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/
function updateYAxis(data, metric) {
    if (verticalBarChart) { return; }
    let yScale = setYScale(metric, data);
    const yAxis = d3.axisLeft(yScale);

    d3.select(`#${metric}`)
        .selectAll("g.y.axis")
        .transition().delay(setSpeed() / 2)
        .call(yAxis)
        .selectAll(".tick line").remove();

    d3.selectAll(`#${metric} .y.axis .tick`)
        .on("mouseover", (event, countryCode) => displayToolTip(getCountryData(countryCode, data, metric), metric))
        .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
}

/**
* updates already rendered x axis.
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function updateXAxis(data, metric) {
    if (!verticalBarChart) { return; }
    let xScale = setXScale(data, metric);
    const xAxis = d3.axisBottom(xScale).ticks(0);
    d3.select(`#${metric}`)
        .attr("width", measurements.width)
        .attr("height", measurements.height)
        .selectAll("g.x.axis")
        .transition().delay(500)
        .call(xAxis)
        .selectAll(".tick line").remove();

    d3.selectAll(`#${metric} .x.axis .tick`)
        .on("mouseover", (event, countryCode) => displayToolTip(getCountryData(countryCode, data, metric), metric))
        .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
}

/**
* determines the y position for the bar
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
* @param {number} countriesDownloaded the number of countries for which data has been downloaded by the api
** @returns {number} the y position for the bar
**/

function setYPositionOfBar(data, metric, countryData) {
    const yScale = setYScale(metric, data);
    let height = yScale.bandwidth();
    let adjustment = 0
    if (height > 100) { adjustment = (height - 100) / 2 }
    if (!verticalBarChart) {
        return yScale(countryData.countryCode) + adjustment
    }
}

/**
* renders horizontal bars.
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
* @param {number} countriesDownloaded the number of countries for which data has been downloaded by the api
**/

function renderHorizontalBars(data, metric, countriesDownloaded) {
    let yScale = setYScale(metric, data);
    let xScale = setXScale(data, metric);
    let selectDataForBarCharts = d3.select(`#${metric}`)
        .selectAll("rect")
        .data(data, d => d.countryCode);

    selectDataForBarCharts
        .enter()
        .append("rect")
        .attr("width", 0)
        .attr("data-countryCode", d => d.countryCode)
        .merge(selectDataForBarCharts)
        .attr("fill", d => setBarColor(d))
        .on("mouseover", (event, barData) => { displayComparisons(event, barData, data, metric); displayToolTip(barData, metric); })
        .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
        .on("mouseout", () => { removeComparisons(data, metric); tooltip.style("visibility", "hidden"); })
        .transition().delay(setSpeed() / 2)
        .attr("height", Math.min(yScale.bandwidth(), 100))
        .attr("transform", `translate(${measurements.margin.left}, ${measurements.margin.top})`)
        .attr("y", (countryData) => setYPositionOfBar(data, metric, countryData))
        .transition().duration(setSpeed() / 2)
        .attr("width", d => {
            if (xScale.domain()[0] === 0 && xScale.domain()[1] === 0) {
                return 0
            } else {
                return xScale(d[metric])
            }
        })
        .ease(d3.easeBounce)
        //https://gist.github.com/miguelmota/3faa2a2954f5249f61d9
        .end()
        .then(() => {
            renderValuesInBars(data, metric, [], countriesDownloaded);
        });

    selectDataForBarCharts.exit()
        .transition().duration(500).attr("width", 0)
        .transition().duration(500).delay(500).remove();
}


/**
* determines the x position for the bar
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
* @param {number} countriesDownloaded the number of countries for which data has been downloaded by the api
** @returns {number} the x position for the bar
**/

function setXPositionOfBar(data, metric, countryData) {

    let width = getBarWidth(countryData, data, metric)
    let xScale = setXScale(data, metric)
    let adjustment = 0
    if (width > 200) { adjustment = (width - 200) / 2 }
    if (verticalBarChart) {
        return xScale(countryData.countryCode) + adjustment
    }
}

/**
* renders vertical bars.
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
* @param {number} countriesDownloaded the number of countries for which data has been downloaded by the api
**/

function renderVerticalBars(data, metric, countriesDownloaded) {
    let yScale = setYScale(metric, data);
    let selectDataForBarCharts = d3.select(`#${metric}`)
        .selectAll("rect")
        .data(data, d => d.countryCode);

    selectDataForBarCharts
        .enter()
        .append("rect")
        .attr("width", setBarMaxWidth(data, metric))
        .attr("height", 0)
        .attr("y", d => yScale(0))
        .attr("data-countryCode", d => d.countryCode)
        .merge(selectDataForBarCharts)
        .attr("fill", d => setBarColor(d))
        .on("mouseover", (event, barData) => { displayComparisons(event, barData, data, metric); displayToolTip(barData, metric); })
        .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
        .on("mouseout", () => { removeComparisons(data, metric); tooltip.style("visibility", "hidden"); })
        .transition().delay(500)
        .attr("transform", `translate(0, ${measurements.margin.top})`)
        .attr("width", setBarMaxWidth(data, metric))
        .attr("x", countryData => setXPositionOfBar(data, metric, countryData))
        .transition()
        .ease(d3.easeBounce)
        .duration(setSpeed())
        .attr("height", d => {
            if (yScale.domain()[0] === 0 && yScale.domain()[1] === 0) { return 0 }
            else { return measurements.innerHeight - yScale((d[metric])) }
        })
        .attr("y", d => {
            if (yScale.domain()[0] === 0 && yScale.domain()[1] === 0) { return measurements.innerHeight }
            else { return yScale(d[metric]) }
        })

        //https://gist.github.com/miguelmota/3faa2a2954f5249f61d9
        .end()
        .then(() => {
            renderValuesInBars(data, metric, [], countriesDownloaded);
        }).catch(err => { });

    selectDataForBarCharts.exit()
        .transition().duration(500).attr("height", 0).attr("y", d => yScale(0)).remove();
}

/**
* decides what color each bar should be.
* @param {array} data data to display for each country
**/

function setBarColor(data) {
    if (highlightedCountries.includes(data.countryCode)) { return "orange"; }
    else { return "steelBlue"; }
}

/**
* renders the axis on the screen
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function renderAxis(data, metric) {
    data = sortByHighestValues(data, metric);
    if (!barChartAxisRendered[metric]) {
        document.getElementById(metric).style.display = "block"
        setMargins();
        measurements.width = 0.95 * windowWidth;
        measurements.height = 0.8 * windowHeight;
        measurements.innerHeight = measurements.height - measurements.margin.top - measurements.margin.bottom;
        measurements.innerWidth = measurements.width - measurements.margin.left - measurements.margin.right;
        renderYAxis(data, metric);
        renderXAxis(data, metric);
        renderChartTitle(data, metric);
        barChartAxisRendered[metric] = true;
    } else {
        updateYAxis(data, metric);
        updateXAxis(data, metric);
    }
}

/**
* decides whether to render vertical or horizontal bars.
* @param {array} data data to display for each country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
* @param {number} countriesDownloaded the number of countries for which data has been downloaded by the api
**/

function renderBarChart(data, metric, countriesDownloaded) {
    const graphData = sortByHighestValues(JSON.parse(JSON.stringify(data)), metric);
    if (verticalBarChart) {
        renderVerticalBars(graphData, metric, countriesDownloaded);
    } else {
        renderHorizontalBars(graphData, metric, countriesDownloaded);
    }
}

/**
* compares a country's data to all other countries.
* @param {object} event the event data
* @param {array} data data to display for each country
* @param {object} barData data for a specific country
* @param {string} metric what is being measured (cases per capita, deaths per capita etc)
**/

function displayComparisons(event, barData, data, metric) {
    if (!allCountriesDownloaded) { return }
    let comparisons = calculateComparisons(data, barData, metric);
    renderValuesInBars(comparisons, metric, barData);
}

/**
* compares a country's data to all other countries.
* @param {array} data data to display for each country
* @param {object} barData data for a specific country
* * @returns {object} compares a country's data to all other countries.
**/


function calculateComparisons(data, barData, metric) {
    const selectedCountry = barData.countryCode;
    let comparisons = data.map(country => {
        let difference = (country[metric] - barData[metric]);
        if (country.countryCode === selectedCountry) {
            country.comparison = barData[metric];
        }
        else if (difference === 0 || Math.round(100 * difference / barData[metric]) === 0) {
            country.comparison = "=";
        }
        else if (difference > 0) {
            //https://www.w3schools.com/jsref/jsref_round.asp
            country.comparison = `+${Math.round(100 * difference / barData[metric])}%`;
        } else {
            difference = barData[metric] - country[metric];
            country.comparison = `-${Math.round(100 * difference / barData[metric])}%`;
            if (Math.round(100 * difference / barData[metric]) === 0) { country.comparison = "="; }

        }
        return country;
    });
    return comparisons;
}

/**
* checks that the most recent downloaded date for each country is the same
* @param {array} allData data from the api for each country that is cleaned and formatted
* * @returns {boolean} is the most recent downloaded date for each country the same?
**/

function isLatestDateTheSame(allData) {
    let dataWithOutNulls = allData.filter(country => country !== null);
    let latestDays = dataWithOutNulls.map(country => country[country.length - 1].date);
    let latestDaysIgnoringTime = latestDays.map(date => new Date(date).setHours(0, 0, 0, 0));
    //https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal
    let sameLatestDateForAll = latestDaysIgnoringTime.every((val, i, arr) => val === arr[0]);
    return sameLatestDateForAll;
}

/**
* calculates the most recent date for which data is available for all countries
* @param {array} allData data from the api for each country that is cleaned and formatted
* * @returns {number} the most recent date for which data is available for all countries in the format of a number that is the number of seconds between the 1 Jan 1970 and the relevant date.
**/

function calculateCommonLatestDate(allData) {
    let dataWithOutNulls = allData.filter(country => country !== null);
    let latestDays = dataWithOutNulls.map(country => country[country.length - 1].date);
    let latestDaysIgnoringTime = latestDays.map(date => new Date(date).setHours(0, 0, 0, 0));
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
    latestCommonDate = Math.min(...latestDaysIgnoringTime);
    return latestCommonDate;
}


/**
* filters data by the dates the user selects
* @param {array} allData data from the api for each country that is cleaned and formatted
* @param {number} startDate the start date in the format of a number that is the number of seconds between the 1 Jan 1970 and the start date.
* @param {number} endDate the end date in the format of a number that is the number of seconds between the 1 Jan 1970 and the start date.
* * @returns {array} array containing data for each country for the dates that the user selected
**/


function filterDataByDates(allData, startDate, endDate) {
    let dataToReturn = allData.map(country => {
        if (country === null) { return null; }
        let filteredData = country.filter(dailyData => {
            let jsDate = new Date(dailyData.date).setHours(0, 0, 0, 0);
            if (jsDate >= startDate && jsDate <= endDate) { return dailyData; }
        });
        return filteredData;
    });
    return dataToReturn;
}

/**
 * calculates cases per capita and deaths per capita for countries
 * @param {array} allData data from the api for each country that is cleaned and formatted
 * * @returns {array} contains cases per capita and deaths per capita for countries
 **/

function calculatePerCapitaData(allData) {

    let casesPerCapita = allData
        .map((country, index) => {
            //prevent countries that haven't been downloaded yet from causing errors
            if (country === null) { return null; }
            let firstDateData = {};
            let latestDateData = {};
            if (country.length === 0) {
                firstDateData = { casesPerCapita: 0, deathsPerCapita: 0 };
                latestDateData = { casesPerCapita: 0, deathsPerCapita: 0 };
            } else if (country[0].firstDayOfData) {
                firstDateData = { casesPerCapita: 0, deathsPerCapita: 0 };
                latestDateData = { casesPerCapita: country[country.length - 1].casesToDate, deathsPerCapita: country[country.length - 1].deathsToDate };
            } else if (country.length === 1) {
                firstDateData = { casesPerCapita: 0, deathsPerCapita: 0 };
                latestDateData = { casesPerCapita: country[country.length - 1].casesToDate, deathsPerCapita: [country.length - 1].deathsToDate };
            } else {
                firstDateData = { casesPerCapita: country[0].casesToDate, deathsPerCapita: country[0].deathsToDate };
                latestDateData = { casesPerCapita: country[country.length - 1].casesToDate, deathsPerCapita: country[country.length - 1].deathsToDate };
            }
            let casesPerCapita = ((latestDateData.casesPerCapita - firstDateData.casesPerCapita) / EUDATASET[index].population).toFixed(3);
            if (casesPerCapita > 0.49) { casesPerCapita = Math.round(casesPerCapita); }

            let deathsPerCapita = ((latestDateData.deathsPerCapita - firstDateData.deathsPerCapita) / (EUDATASET[index].population / 10)).toFixed(3);
            if (deathsPerCapita > 0.49) { deathsPerCapita = Math.round(deathsPerCapita); }

            // if (EUDATASET[index].countryCode === 'es' || EUDATASET[index].countryCode === 'se') {
            //     console.log(EUDATASET[index].countryCode)
            //     console.log('country', country)
            //     console.log('firstDateData', firstDateData)
            //     console.log('latestDateData', latestDateData)
            //     console.log('casesPerCapita', casesPerCapita)
            //     console.log('deathsPerCapita', deathsPerCapita)
            //     console.log('--------')
            // }
            return {
                ["country"]: EUDATASET[index].country,
                ["countryCode"]: EUDATASET[index].countryCode,
                ["casesPerCapita"]: casesPerCapita,
                ["deathsPerCapita"]: deathsPerCapita,
            };
        })
        .filter(country => country !== undefined && country !== null);

    return casesPerCapita;
}

/**
 * calculates cases per capita and deaths per capita for countries
 * @param {array} requestedData data for each country that user has requested
 * @param {number} startDate the start date in the format of a number that is the number of seconds between the 1 Jan 1970 and the start date.
 * @param {number} endDate the end date in the format of a number that is the number of seconds between the 1 Jan 1970 and the start date.
 * * @returns {array} contains cases per capita and deaths per capita for countries
 **/

function getPerCapitaData(requestedData, startDate, endDate) {
    let casesPerCapita = calculatePerCapitaData(requestedData, startDate, endDate);
    if (countriesDownloaded < 27) {
        return casesPerCapita;
    }
    else {
        return includeEUInCasesPerCapita(requestedData, casesPerCapita);
    }
}

/**
 * calculates total EU population
 * * @returns {number} total EU population
 **/

function calculateEUPopulation() {
    return EUDATASET.map((country) => country.population).reduce((a, b) => a + b);
}


/**
 * calculates total EU cases and total EU deaths
 * @param {array} allData data from the api for each country that is cleaned and formatted
 * * @returns {object} contains total EU cases and total EU deaths
 **/

function calculateEUTotals(allData) {
    let totalCases = [];
    let totalDeaths = []
    allData
        .forEach((country) => {
            let firstDateData = {};
            let latestDateData = {};
            if (country.length === 0) {
                firstDateData = { casesPerCapita: 0, deathsPerCapita: 0 };
                latestDateData = { casesPerCapita: 0, deathsPerCapita: 0 };
            } else if (country.length === 1) {
                firstDateData = { casesPerCapita: 0, deathsPerCapita: 0 };
                latestDateData = { casesPerCapita: country[country.length - 1].casesToDate, deathsPerCapita: country[country.length - 1].deathsToDate };
            }
            else if (country[0].firstDayOfData) {
                firstDateData = { casesPerCapita: 0, deathsPerCapita: 0 };
                latestDateData = { casesPerCapita: country[country.length - 1].casesToDate, deathsPerCapita: country[country.length - 1].deathsToDate };
            }
            else {
                firstDateData = { casesPerCapita: country[0].casesToDate, deathsPerCapita: country[0].deathsToDate };
                latestDateData = { casesPerCapita: country[country.length - 1].casesToDate, deathsPerCapita: country[country.length - 1].deathsToDate };
            }
            totalCases.push(latestDateData.casesPerCapita - firstDateData.casesPerCapita);
            totalDeaths.push(latestDateData.deathsPerCapita - firstDateData.deathsPerCapita);
        });
    totalCases = totalCases.reduce((a, b) => a + b);
    totalDeaths = totalDeaths.reduce((a, b) => a + b);
    return { totalCases, totalDeaths };
}

/**
 * includes per capita data for EU along with per capita data for country data
 * @param {array} allData data from the api for each country that is cleaned and formatted
 * @param {array} countryPerCapitaData data from each country containing perCapita data
 * * @returns {array} includes per capita data for EU along with per capita data for country data
 **/

function includeEUInCasesPerCapita(allData, countryPerCapitaData) {
    let totalEuCases = calculateEUTotals(allData).totalCases;
    let totalEuDeaths = calculateEUTotals(allData).totalDeaths;
    let euPopulation = calculateEUPopulation();
    let euCasesPerCapita = (totalEuCases / euPopulation).toFixed(4);
    let euDeathsPerCapita = (totalEuDeaths / (euPopulation / 10)).toFixed(4);
    if ((totalEuCases / euPopulation).toFixed(3) > 0.000) {
        euCasesPerCapita = (totalEuCases / euPopulation).toFixed(3);
    }
    if (euCasesPerCapita === 0.000) { euCasesPerCapita = totalEuCases / euPopulation; }
    if (euCasesPerCapita > 1) { euCasesPerCapita = Math.round(euCasesPerCapita); }


    if ((totalEuDeaths / (euPopulation / 10)).toFixed(3) > 0.000) {
        euDeathsPerCapita = (totalEuDeaths / (euPopulation / 10)).toFixed(3);
    }
    if (euDeathsPerCapita === 0.000) { euDeathsPerCapita = totalEuDeaths / (euPopulation / 10); }
    if (euCasesPerCapita > 1) { euDeathsPerCapita = Math.round(euDeathsPerCapita); }

    countryPerCapitaData.push({
        country: "European Union",
        countryCode: "eu",
        casesPerCapita: euCasesPerCapita,
        deathsPerCapita: euDeathsPerCapita
    });
    return countryPerCapitaData;
}

/**
 * removes countries that user has unselected from data
 * @param {array} allData data from the api for each country that is cleaned and formatted
 * * @returns {array} data without countries that user has unselected from data
 **/

function filterDataByCountry(data) {
    let countriesToDelete = getUncheckedCountries();
    let countryCodes = data.map(country => country.countryCode);
    let indexesToDelete = countriesToDelete.map(country => countryCodes.indexOf(country)).sort((a, b) => b - a);
    indexesToDelete.forEach(index => {
        data.splice(index, 1);
    });
    return data;
}


/**
 * removes unselected countries from the list of countries that can be highlighted
 **/

function removeDeletedCountriesFromHighlights() {
    let countriesToDelete = getUncheckedCountries();
    let countryCodes = EUDATASET.map(e => e.countryCode)
    let countryNames = eu
    countriesToDelete = countriesToDelete.map(e => countryCodes.indexOf(e)).map(e => countryNames[e])
    let highlightCountry = document.getElementById("highlight-country-checkboxes")
    let highlightCountryLabels = [...highlightCountry.getElementsByTagName("label")]

    highlightCountryLabels.forEach(e => {
        if (countriesToDelete.includes(e.htmlFor)) {
            e.style.display = "none"
        }
    })
}


/**
 * makes final computations to data to display on screen
 * @param {number} startDate the start date in the format of a number that is the number of seconds between the 1 Jan 1970 and the start date.
 * @param {number} endDate the end date in the format of a number that is the number of seconds between the 1 Jan 1970 and the start date.
 * @param {array} allData data from the api for each country that is cleaned and formatted
 **/
function dataForGraphs(startDate, endDate, allData, countriesDownloaded) {
    if (countriesDownloaded === 0) { return; }
    let filteredDataByDate = filterDataByDates(allData, startDate, endDate);
    let casesPerCapita = getPerCapitaData(filteredDataByDate, startDate, endDate);
    let filteredDataByCountry = filterDataByCountry(casesPerCapita);
    setHighlightedCountries();
    renderAxis(filteredDataByCountry, "casesPerCapita");
    renderBarChart(filteredDataByCountry, "casesPerCapita", countriesDownloaded);
    renderAxis(filteredDataByCountry, "deathsPerCapita");
    renderBarChart(filteredDataByCountry, "deathsPerCapita", countriesDownloaded);
}

/**
 * Formats data so that countries with overseas territories have that data removed
 * @param {array} jsonData Lists the data returned from API in json format
 * * @returns {array} returns array of data for each country with overseas territories removed
 **/

function removeColonies(jsonData) {
    return jsonData.map(country => country.filter(dailyData => dailyData.Province === ""));
}

/**
 * returns data in format required to display on screen
 * @param {array} countriesOnly Lists the data from the api calls with colonies removed.
 * * @returns {array} returns data in format required to display on screen
 **/

function formatAPIData(countriesOnly) {

    //countriesOnly is an array of arrays.
    //each internal array is a country's data.
    //it is an array of objects
    //each object is the data for a specific day

    //this function cleans the data so that it returns an array of objects
    //each object contains 3 elements - country name (string), country code (string) and summarised daily data (array of objects - each object is a day's data)

    let cleanedData = countriesOnly.map((country) => {

        //map each internal array so that only the data we are interested in is kept (as an object)

        let dailySummaries = country.map((dailyData, index) => {
            let objectToReturn = {
                casesToDate: dailyData.Confirmed,
                deathsToDate: dailyData.Deaths,
                date: dailyData.Date,
            };
            if (index === 0) { objectToReturn.firstDayOfData = true; }
            return objectToReturn;
        });
        //return an array of objects

        return {
            country: country[0].Country.toLowerCase(),
            countryCode: country[0].CountryCode.toLowerCase(),
            data: dailySummaries
        };
    });
    return cleanedData;
}

/**
 * cleans data
 * @param {array} jsonData Lists the data returned from API in json format
 * * @returns {array} returns array of data in format required for display on screen
 **/

function cleanData(jsonData) {
    let countriesOnly = removeColonies(jsonData);
    let cleanedData = formatAPIData(countriesOnly);
    return cleanedData;
}

/**
 * records failed api calls
 * @param {array} rawData Lists the data returned from API
 * @param {array} failedCalls List of countries for which api calls that have been made and have failed
 * * @returns {array} Updated list of countries for which api calls that have been made and have failed
 **/

function recordFailedAPICalls(rawData, failedCalls) {
    rawData
        .filter((apiCall) => apiCall.status !== 200)
        .forEach((apiCall) => {
            // I based this on similar code that I found here: https://stackoverflow.com/questions/3568921/how-to-remove-part-of-a-string
            let countryName = apiCall.url.split("country/").pop();
            failedCalls.push(countryName);
        });
    return failedCalls;
}

/**
 * displays number of countries downloaded
 **/
function displayNumberCountriesDownloaded() {
    let countryCodes = EUDATASET.map(countryEntry => countryEntry.countryCode);
    let CountriesDownloaded = countryCodes.map(countryCode => { return localStorage.getItem(countryCode); });
    Promise.all(CountriesDownloaded).then(countries => {
        let countriesDownloaded = countries.filter(country => country !== null).length;
        document.getElementById("downloads").innerHTML = countriesDownloaded;
    }).catch(err => { });

}

/**
 * compiles data for saving
 * @param {array} countryData Lists the data for eacn country
 * * @returns {array} returns array of promises
 **/

function compileDataForSaving(countryData) {
    let SaveData = countryData.map((country) => {
        return localStorage.setItem(country.countryCode, JSON.stringify(country.data));
    });
    return SaveData;
}

/**
 * reformats data from api call
 * @param {array} rawData Lists the data returned from API
 * @param {array} countries The countries for which api calls have yet to be successfully made
 * @param {array} failedCalls List of countries for which api calls that have been made and have failed
 **/

function processRawData(rawData, countries, failedCalls) {
    failedCalls = recordFailedAPICalls(rawData, failedCalls);
    let successfulCalls = rawData.filter((apiCall) => apiCall.status === 200);
    let JsonData = Promise.all(successfulCalls.map((res) => res.json()));
    JsonData.then(jsonData => {
        if (successfulCalls.length > 0) {
            let countryData = cleanData(jsonData);
            let SaveData = compileDataForSaving(countryData);
            Promise.all(SaveData).then(savedData => {
                let countryCodes = EUDATASET.map(countryEntry => countryEntry.countryCode);
                let CountriesDownloaded = Promise.all(countryCodes.map(countryCode => { return localStorage.getItem(countryCode); }));
                CountriesDownloaded.then(countriesDownloadedData => {
                    countriesDownloaded = countriesDownloadedData.filter(country => country !== null).length;
                    if (countriesDownloaded === 27) {
                        allCountriesDownloaded = true;
                        setDefaultDates();
                        displayNav();
                        setTimeout(() => {
                            document.getElementsByClassName("loading")[0].style.opacity = "0";
                            document.getElementsByClassName("loading")[0].style.maxHeight = "0";
                        }, 500);
                        setTimeout(() => {
                            document.getElementsByClassName("loading")[0].style.display = "none";
                        }, 1500);
                    }
                    displayNumberCountriesDownloaded();
                    let countryData = EUDATASET.map((country) =>
                        JSON.parse(localStorage.getItem(country.countryCode))
                    );
                    Promise.all(countryData).then(allData => {
                        let startDate = new Date("January 24, 2020 03:24:00").setHours(0, 0, 0, 0);
                        let endDate = calculateCommonLatestDate(allData);
                        dataForGraphs(startDate, endDate, allData, countriesDownloaded);
                    }).catch(err => { });
                }).catch(err => { });
            }).catch(err => { });

        }
        getData(countries, false, failedCalls);
    }).catch(err => { });
}

/**
 * Makes API calls
 * @param {array} countries The countries for which api calls have yet to be successfully made
 * @param {array} failedCalls List of countries for which api calls that have been made and have failed
 **/

function makeAPICalls(countries, failedCalls) {
    Promise.all(
        countries
            //the api won't allow more than 10 calls from my ip within 5 seconds
            .splice(0, 10)
            .map((country) => fetch(`https://api.covid19api.com/dayone/country/${country}`))
    )
        .then((rawData) => {
            processRawData(rawData, countries, failedCalls);
        })
        .catch((err) => {
            apiFailedCalls++;
            if (apiFailedCalls >= 4) {
                document.getElementsByClassName("loader")[0].style.display = "none";
                document.getElementsByClassName("statistic-details")[0].style.display = "none";
                document.getElementById("casesPerCapita").style.display = "none"
                document.getElementById("deathsPerCapita").style.display = "none"
                document.getElementById("download-summary").style.display = "none"
                document.getElementsByClassName("loading-message")[0].innerHTML = "Sorry. We can't load the data right now. Please try again later.";
                return;
            } else {
                document.getElementsByClassName("loading-message")[0].innerHTML = "There is a delay loading the data. This may take 30 seconds. Please be patient";
                setTimeout(() => getData([...eu], true, []), 10000);
            }
        });
}

/**
 * Decides whether and how to make api call
 * @param {array} countries The countries for which api calls have yet to be successfully made
 * @param {boolean} firstCall Whether or not this is the first call to the api
 * @param {array} failedCalls List of countries for which api calls that have been made and have failed
 **/

function getData(countries, firstCall, failedCalls) {
    if (countries.length === 0 && failedCalls.length === 0) { return; }
    if (countries.length === 0 && failedCalls.length > 0) { countries = failedCalls.splice(0, 10); }
    if (firstCall) {
        localStorage.clear();
        makeAPICalls(countries, failedCalls);
    } else {
        //the api won't allow more than 10 calls from my ip within 5 seconds
        setTimeout(() => makeAPICalls(countries, failedCalls), 5000);
    }
}

/**
 * adds event listeners to enable highlighting of countries and adding/removing countries
 **/

function addEventListeners() {
    //https://stackoverflow.com/questions/27609360/how-to-set-onclick-functions-to-multiple-elements
    let selectCountry = document.getElementById("select-country-checkboxes")
    let selectCountryCheckboxes = [...selectCountry.getElementsByClassName("select-country")]
    let highlightCountry = document.getElementById("highlight-country-checkboxes")
    let highlightCountryCheckboxes = [...highlightCountry.getElementsByClassName("highlight-country")]

    selectCountryCheckboxes.forEach((element) => {
        element.addEventListener("click", () => changeRequestedData())
    })

    highlightCountryCheckboxes.forEach((element) => {
        element.addEventListener("click", () => changeRequestedData(true))
    })
}



addEventListeners()
setBarChartType();
getData([...eu], true, []);




