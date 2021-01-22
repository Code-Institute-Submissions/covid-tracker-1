//TO DO: find users country from their IP

//TO DO: Fix Bug. If screen size changes values/comparisons will change size even though bar size has not

const euDataSet = [
    { country: "austria", countryCode: "at", population: 88.588 },
    { country: "belgium", countryCode: "be", population: 89.011 },
    { country: "bulgaria", countryCode: "bg", population: 69.515 },
    { country: "croatia", countryCode: "hr", population: 40.582 },
    { country: "cyprus", countryCode: "cy", population: 08.88 },
    { country: "czech-republic", countryCode: "cz", population: 106.939 },
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
    //   { country: "united-kingdom", countryCode: "gb", population: 670.255 },
];

let countriesDownloaded = 0

let barChartAxisRendered = false

let latestCommonDate

let eu = euDataSet.map((e) => e.country);

const countryCodes = euDataSet.map((e) => e.countryCode)

let verticalBarChart = false

function displayNav() {
    if (countriesDownloaded < 27) { return }
    document.getElementById('nav').classList.remove("hide-element")
    document.getElementById('nav').classList.add("show-element")
}

function setDefaultDates() {

    if (countriesDownloaded < 27) { return }

    console.log('convertDateFormat(latestCommonDate)', convertDateFormat(latestCommonDate))

    document.getElementById("end-date").value = convertDateFormat(latestCommonDate).toString()
    document.getElementById("end-date").max = convertDateFormat(latestCommonDate).toString()
    document.getElementById("start-date").max = convertDateFormat(latestCommonDate).toString()

}

function convertDateFormat(date) {

    //https://dzone.com/articles/javascript-convert-date

    let month = new Date(date).getMonth() + 1

    if (month < 10) {
        month = `0${month.toString()}`
    }
    let day = new Date(date).getDate()
    let year = new Date(date).getFullYear()


    return `${year}-${month}-${day}`

}

async function changeDates() {


    let startDate = new Date (document.getElementById("start-date").value).setHours(0, 0, 0, 0)
    let endDate = new Date (document.getElementById("end-date").value).setHours(0, 0, 0, 0)

    console.log('startDate', startDate)

    console.log('endDate', endDate)

    let allData = await getDataFromStorage()

    dataForGraphs(startDate, endDate, allData)

}




function setBarChartType() {
    if (screen.width > screen.height) { verticalBarChart = true }
}


// This function is from https://www.youtube.com/watch?v=_8V5o2UHG0E&t=26788s

function sortByHighestValues(data, metric) {
    return data.sort((a, b) => b[metric] - a[metric])
}



function setSpeed() {

    if (countriesDownloaded !== 27) { return 4500 }
    else { return 0 }
}



function renderValuesInBars(data, metric, countryID, measurements, barData) {




    if (countriesDownloaded < 27) { return }

    function calculateFontSize(data) {


        if (verticalBarChart) {
            //https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions/8876069#8876069
            return ((.2 / data.length) * Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)).toString()
        } else {
            return 12

        }

    }

    function setXValue(countryData, measurements, countryID) {
        if (verticalBarChart) {
            return measurements.xScale(countryData[countryID]) + measurements.xScale.bandwidth() / 2
        } else {

            return (measurements.xScale(countryData[metric]) - 8)
        }
    }

    function setYValue(countryData, measurements, metric) {
        if (verticalBarChart) {

            return measurements.yScale(countryData[metric]) + measurements.margin.top - 2
        } else {
            return (measurements.yScale(countryData[countryID]) + measurements.yScale.bandwidth() / 2 + measurements.margin.top)
        }
    }


    function setColor(countryData, barData) {

        if (!verticalBarChart) { return "white" }


        let valueToReturn

        countryData.countryCode === 'eu' ? valueToReturn = 'orange' : valueToReturn = 'steelBlue'

        if (barData === undefined) { return valueToReturn }
        if (barData.countryCode === 'eu' && countryData.countryCode === 'eu') { return 'orange' }
        if (typeof (countryData.comparison) === 'number') { return "steelblue" }
        if (countryData.comparison.includes("+")) { return "tomato" }
        return "darkgreen"


    }

    function decideTextToReturn(countryData) {
        if (countryData.comparison !== undefined) { return countryData.comparison }
        else { return countryData[metric] }
    }

    function setTextAnchor() {
        if (verticalBarChart) { return 'middle' }
        else { return 'start' }
    }

    function setAlignmentBaseline() {
        if (verticalBarChart) { return 'auto' }
        else { return 'central' }
    }



    let values = d3.select("svg")
        .selectAll(".casesPerCapita")
        .data(data)

    values
        .enter()
        .append("text")

        .attr("y", 0)
        .style("opacity", "1")
        .merge(values)
        .attr("class", metric)
        .attr('text-anchor', setTextAnchor())
        .attr('alignment-baseline', setAlignmentBaseline())
        .attr("x", countryData => setXValue(countryData, measurements, countryID))
        .attr("y", countryData => setYValue(countryData, measurements, metric))
        .style("fill", countryData => setColor(countryData, barData))
        .style("font-size", calculateFontSize(data))
        .text(countryData => decideTextToReturn(countryData))


}



function renderBarChart(data, metric, countryID) {

    console.log('in render bar chart')

    function setMargins() {

        let margin = { top: 30, right: 0, bottom: 20, left: 30 }
        if (verticalBarChart) { margin.left = 0 }

        return margin
    }

    function setYScale(metric, innerHeight, data, countryID) {
        if (verticalBarChart) {
            return d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => d[metric])])
                .range([innerHeight, 0])
        } else {
            return d3
                .scaleBand()
                .domain(data.map((d) => d[countryID]))
                .range([0, innerHeight])
                .padding(0.2);
        }
    }

    function setXScale(data, countryID, margin, width, metric) {
        if (verticalBarChart) {
            return d3
                .scaleBand()
                .domain(data.map((d) => d[countryID]))
                .range([margin.left, width])
                .padding(0.2);
        } else {
            return d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => d[metric])])
                .range([margin.left, width]);
        }
    }

    function renderXAxis(width, height, margin, xAxis, innerHeight) {

        if (!verticalBarChart) { return }

        d3.select("svg").attr("width", width).attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${innerHeight + margin.top})`)
            .call(xAxis)

    }

    function renderYAxis(width, height, margin, yAxis) {

        if (verticalBarChart) { return }

        d3.select("svg").attr("width", width).attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll('.tick line').remove()



    }

    function renderChartTitle(xScale) {

        let xScaleMidPoint = (xScale.range()[1] + xScale.range()[0]) / 2

        d3.select("svg")
            .append("text")
            .attr("fill", "black")
            .attr("y", 15)
            .attr('x', xScaleMidPoint)
            .attr("text-anchor", "middle")
            .text('Cases Per 100,000 People By Country')

    }

    function updateXAxis(width, height, xAxis) {

        if (!verticalBarChart) { return }

        d3.select("svg").attr("width", width).attr("height", height).selectAll("g.x.axis").call(xAxis)



    }

    function updateYAxis(width, height, yAxis) {
        if (verticalBarChart) { return }

        d3.select("svg")
            .selectAll("g.y.axis")
            .call(yAxis)
            .selectAll('.tick line').remove()
    }

    function renderHorizontalBars(data, measurements, metric, countryID) {

        let selectDataForBarCharts = d3.select("svg")
            .selectAll("rect")
            .data(data, d => d[countryID])

        selectDataForBarCharts
            .enter()
            .append("rect")
            .attr("width", 0)
            .attr("height", measurements.yScale.bandwidth())
            .attr("y", (d) => measurements.yScale(d[countryID]))
            .merge(selectDataForBarCharts)
            // .attr("class", d => {return `${d[countryID]} ${metric}`})
            .attr("fill", d => setBarColor(d))
            .attr("height", measurements.yScale.bandwidth())
            .attr("transform", `translate(${measurements.margin.left}, ${measurements.margin.top})`)
            .on('mouseover', (event, barData) => { displayComparisons(event, barData, data, metric, countryID, measurements) })
            .on('mouseout', (event) => { renderValuesInBars(data, metric, countryID, measurements) })
            .transition().duration(500).attr("y", (d) => measurements.yScale(d[countryID]))
            .transition().duration(setSpeed() - 500).delay(500)
            .attr("width", (d) => measurements.xScale(d[metric]))

    }

    function renderVerticalBars(data, measurements, metric, countryID) {



        let selectDataForBarCharts = d3.select("svg")
            .selectAll("rect")
            .data(data, d => d[countryID])


        selectDataForBarCharts
            .enter()
            .append("rect")
            .attr('width', measurements.xScale.bandwidth())
            .attr("height", 0)
            .attr('y', d => measurements.yScale(0))
            .merge(selectDataForBarCharts)
            // .attr("class", d => {return `${d[countryID]} ${metric}`})
            .attr("fill", d => setBarColor(d))
            .attr("transform", `translate(0, ${measurements.margin.top})`)
            .attr('width', measurements.xScale.bandwidth())
            .attr('x', (d) => measurements.xScale(d[countryID]))
            .on('mouseover', (event, barData) => { displayComparisons(event, barData, data, metric, countryID, measurements) })
            .on('mouseout', (event) => { removeComparisons(data, metric, countryID, measurements) })
            .transition()
            .ease(d3.easeLinear)
            .duration(setSpeed())
            .attr("height", d => measurements.innerHeight - measurements.yScale(d[metric]))
            .attr("y", (d) => measurements.yScale(d[metric]))
        // .on('end',  d => renderValuesInBars(data, metric, countryID, measurements))  
    }

    function setBarColor(data) {

        if (data.countryCode === 'eu') {
            return "orange"
        } else {
            return "steelBlue"
        }
    }

    function removeComparisons(data, metric, countryID, measurements) {
        let dataWithOutComparisons = data.map(countryData => {
            delete countryData.comparison
            return countryData
        })
        renderValuesInBars(data, metric, countryID, measurements)
    }



    data = sortByHighestValues(data, metric)

    // https://www.w3schools.com/jsref/prop_screen_height.asp

    // https://www.w3schools.com/jsref/prop_screen_width.asp

    const width = 0.9 * screen.width
    const height = 0.8 * screen.height
    const margin = setMargins()
    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.left - margin.right

    const yScale = setYScale(metric, innerHeight, data, countryID)
    const xScale = setXScale(data, countryID, margin, innerWidth, metric)

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale).ticks(0);


    if (!barChartAxisRendered) {

        renderYAxis(width, height, margin, yAxis)
        renderXAxis(width, height, margin, xAxis, innerHeight)
        renderChartTitle(xScale)
    } else {

        updateYAxis(width, height, yAxis)
        updateXAxis(width, height, xAxis, innerHeight)
    }

    barChartAxisRendered = true

    let measurements = { yScale, xScale, margin, height, innerHeight }

    verticalBarChart ? renderVerticalBars(data, measurements, metric, countryID) : renderHorizontalBars(data, measurements, metric, countryID)

    setTimeout(renderValuesInBars, 1000, data, metric, countryID, measurements);

};


function displayComparisons(event, barData, data, metric, countryID, measurements) {


    let comparisons = calculateComparisons(data, barData)

    renderValuesInBars(comparisons, metric, countryID, measurements, barData)

}

function calculateComparisons(data, barData) {
    const selectedCountry = barData.countryCode

    let comparisons = data.map(country => {

        let difference = (country.casesPerCapita - barData.casesPerCapita)
        if (country.countryCode === selectedCountry) {
            country.comparison = barData.casesPerCapita
        }
        else if (difference === 0 || Math.round(100 * difference / barData.casesPerCapita) === 0) {
            country.comparison = '='
        }

        else if (difference > 0) {
            //https://www.w3schools.com/jsref/jsref_round.asp
            country.comparison = `+${Math.round(100 * difference / barData.casesPerCapita)}%`
        } else {
            difference = barData.casesPerCapita - country.casesPerCapita
            country.comparison = `-${Math.round(100 * difference / barData.casesPerCapita)}%`
            if (Math.round(100 * difference / barData.casesPerCapita) === 0) { country.comparison = '=' }

        }
        return country
    })

    return comparisons

}



function getNumberOfCountriesDownloaded() {

    let countryCodes = euDataSet.map(countryEntry => countryEntry.countryCode)

    let CountriesDownloaded = countryCodes.map(countryCode => { return localStorage.getItem(countryCode) })

    let promiseToReturn = Promise.allSettled(CountriesDownloaded).then(countries => {

        let countriesDownloaded = countries.filter(country => country.value !== null).length

        return countriesDownloaded

    })

    return promiseToReturn

}

function getDataFromStorage() {
    let countryData = euDataSet.map((country) =>
        JSON.parse(localStorage.getItem(country.countryCode))
    );

    //don't filter out nulls here. You use the index in next function to assign the correct data to the correct country

    return Promise.all(countryData)
}

function calculateTotalEUCases(allData) {

    let totalCases = [];

    allData
        .forEach((country) => {
            let latestDay = country[country.length - 1];
            totalCases.push(latestDay.casesToDate);
        })

    return totalCases.reduce((a, b) => a + b);
}

function calculateEUPopulation() {
    return euDataSet.map((country) => country.population).reduce((a, b) => a + b)
}

function calculateCasesPerCapita(allData) {

    let casesPerCapita = allData
        .map((country, index) => {

            //prevent countries that haven't been downloaded yet from causing errors

            if (country === null) { return }

            let latestDay = country[country.length - 1];

            return {
                ["countryCode"]: euDataSet[index].countryCode,
                ["casesPerCapita"]: Math.round(
                    latestDay.casesToDate / euDataSet[index].population
                ),
            };

        })
        //remove countries that haven't been downloaded yet
        .filter(country => country !== undefined)

    return casesPerCapita

}

function isLatestDateTheSame(allData) {

    let dataWithOutNulls = allData.filter(country => country !== null)

    let latestDays = dataWithOutNulls.map(country => country[country.length - 1].date)

    let latestDaysIgnoringTime = latestDays.map(date => new Date(date).setHours(0, 0, 0, 0))


    //https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal

    let sameLatestDateForAll = latestDaysIgnoringTime.every((val, i, arr) => val === arr[0])



    return sameLatestDateForAll

}

function calculateCommonLatestDate(allData) {

    let dataWithOutNulls = allData.filter(country => country !== null)

    let latestDays = dataWithOutNulls.map(country => country[country.length - 1].date)

    let latestDaysIgnoringTime = latestDays.map(date => new Date(date).setHours(0, 0, 0, 0))

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min

    latestCommonDate = Math.min(...latestDaysIgnoringTime)

    return latestCommonDate

}

function filterDataByDates(allData, startDate, endDate) {

    return allData.map(country => {
        if (country === null) { return null }
        let filteredData = country.filter(dailyData => {
            let jsDate = new Date(dailyData.date).setHours(0, 0, 0, 0)
            if (jsDate >= startDate && jsDate <= endDate) { return dailyData }
        })

        return filteredData
    })
}


function returnDataWithSameDates(allData) {

    const sameLatestDateForAll = isLatestDateTheSame(allData)

    if (sameLatestDateForAll) { return allData } else {

        const commonLatestDate = calculateCommonLatestDate(allData)

        let startDate = new Date('January 24, 2020 03:24:00').setHours(0, 0, 0, 0)

        let dataWithSameEndDate = filterDataByDates(allData, startDate, commonLatestDate)

        return dataWithSameEndDate
    }

}

function getCasesPerCapita(requestedData) {

    let casesPerCapita = calculateCasesPerCapita(requestedData)

    if (countriesDownloaded < 27) {

        return casesPerCapita
    }
    else {

        return includeEUInCasesPerCapita(requestedData, casesPerCapita)
    }


}

function includeEUInCasesPerCapita(allData, casesPerCapita) {

    console.log('casesPerCapita in includeEU func', casesPerCapita)

    let totalEuCases = calculateTotalEUCases(allData)

    let euPopulation = calculateEUPopulation()

    casesPerCapita.push({
        countryCode: "eu",
        casesPerCapita: Math.round(totalEuCases / euPopulation),
    });

    return casesPerCapita
}

async function dataForGraphs(startDate, endDate, allData) {

    console.log('in data for graphs func')

    

    if (countriesDownloaded === 0) { return }

    let requestedData = filterDataByDates(allData, startDate, endDate)

    casesPerCapita = await getCasesPerCapita(requestedData)

    

    renderBarChart(casesPerCapita, "casesPerCapita", "countryCode");
}

function removeColonies(jsonData) {
    return jsonData.map(country => country.filter(dailyData => dailyData.Province === ""))
}

function formatAPIData(countriesOnly) {

    //countriesOnly is an array of arrays.
    //each internal array is a country's data.
    //it is an array of objects
    //each object is the data for a specific day

    //this function cleans the data so that it returns an array of objects
    //each object contains 3 elements - country name (string), country code (string) and summarised daily data (array of objects - each object is a day's data)

    let cleanedData = countriesOnly.map((country) => {

        //map each internal array so that only the data we are interested in is kept (as an object)

        let dailySummaries = country.map(dailyData => {
            return {
                casesToDate: dailyData.Confirmed,
                deathsToDate: dailyData.Deaths,
                date: dailyData.Date,
            };
        })


        //return an array of objects

        return {
            country: country[0].Country.toLowerCase(),
            countryCode: country[0].CountryCode.toLowerCase(),
            data: dailySummaries
        }

    });

    return cleanedData
}


function cleanData(jsonData) {

    let countriesOnly = removeColonies(jsonData)

    let cleanedData = formatAPIData(countriesOnly)

    return cleanedData;
};


function recordFailedAPICalls(rawData, failedCalls) {
    rawData
        .filter((apiCall) => apiCall.status !== 200)
        .forEach((apiCall) => {
            // I based this on similar code that I found here: https://stackoverflow.com/questions/3568921/how-to-remove-part-of-a-string

            countryName = apiCall.url.split("country/").pop()

            failedCalls.push(countryName);
        })

    return failedCalls
}


async function displayNumberCountriesDownloaded() {

    let countriesDownloaded = await getNumberOfCountriesDownloaded()

    document.getElementById("downloads").innerHTML = countriesDownloaded

}

function compileDataForSaving(countryData) {

    let SaveData = countryData.map((country) => {
        return localStorage.setItem(country.countryCode, JSON.stringify(country.data));
    });

    return Promise.allSettled(SaveData).then()

}

function compileSuccessfulCalls(successfulCalls) {

    return Promise.all(
        successfulCalls.map((res) => res.json())
    )

}


async function processRawData(rawData, countries, failedCalls) {

    failedCalls = recordFailedAPICalls(rawData, failedCalls)

    let successfulCalls = rawData.filter((apiCall) => apiCall.status === 200)

    let jsonData = await compileSuccessfulCalls(successfulCalls)

    if (successfulCalls.length > 0) {

        let countryData = cleanData(jsonData)

        await compileDataForSaving(countryData)

        countriesDownloaded = await getNumberOfCountriesDownloaded()

        if (countriesDownloaded === 27){
            displayNav()
            setDefaultDates()
        }

        displayNumberCountriesDownloaded()

        let allData = await getDataFromStorage()

        let startDate = new Date('January 24, 2020 03:24:00').setHours(0, 0, 0, 0)

        let endDate = calculateCommonLatestDate(allData)

        dataForGraphs(startDate, endDate, allData)

    }
    getData(countries, false, failedCalls);
};

function makeAPICalls(countries, failedCalls) {
    Promise.all(
        countries
            //the api won't allow more than 10 calls from my ip within 5 seconds
            .splice(0, 10)
            .map((country) => fetch(`https://api.covid19api.com/dayone/country/${country}`))
    ).then((rawData) => {
        processRawData(rawData, countries, failedCalls);
    });
};


function getData(countries, firstCall, failedCalls) {
    if (countries.length === 0 && failedCalls.length === 0) { return }
    if (countries.length === 0 && failedCalls.length > 0) { countries = failedCalls.splice(0, 10); }

    if (firstCall) {
        localStorage.clear()

        makeAPICalls(countries, failedCalls);
    } else {
        //the api won't allow more than 10 calls from my ip within 5 seconds
        setTimeout(() => makeAPICalls(countries, failedCalls), 5000);
    }
};


setBarChartType()
getData([...eu], true, []);
