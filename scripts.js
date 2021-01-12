//find users country from their IP

//if EU make sure their country is called by the second call

//pull their country data and display while the rest is loading

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

let barChartAxisRendered = false

let eu = euDataSet.map((e) => e.country);

const countryCodes = euDataSet.map((e) => e.countryCode);

// This function is from https://www.youtube.com/watch?v=_8V5o2UHG0E&t=26788s

function sortByHighestValues(data, metric) {
    return data.sort((a, b) => b[metric] - a[metric])
}

function setBarColor(data) {

    if (data.countryCode === 'eu') {
        return "orange"
    } else {
        return "steelBlue"
    }
}

function renderYAxis(width, height, margin, yAxis) {

    d3.select("svg").attr("width", width).attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('.tick line').remove()



}

function renderXAxis(width, height, margin, xAxis, innerHeight) {

    d3.select("svg").attr("width", width).attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis)

}

function updateXAxis(width, height, xAxis) {

    d3.select("svg").attr("width", width).attr("height", height).selectAll("g.x.axis").call(xAxis)

}

function updateYAxis(width, height, yAxis) {
    d3.select("svg")
        .selectAll("g.y.axis")
        .call(yAxis)
        .selectAll('.tick line').remove()
}

function renderBars(data, measurements, metric, countryID) {

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
        .attr("fill", d => setBarColor(d))
        .attr("height", measurements.yScale.bandwidth())
        .attr("transform", `translate(${measurements.margin.left}, ${measurements.margin.top})`)
        .on('mouseover', (event, barData) => {

            console.log('event', event)
            console.log('barData', barData)

        // d3.select(this)
        //   .transition()
        //   .duration(300)
        //   .attr('opacity', 0.5)
            displayComparisons(event, barData, data, metric, countryID, measurements)})
        .on('mouseout', (event)=>{
        //             d3.select(this)
        //   .transition()
        //   .duration(300)
        //   .attr('opacity', 1)
            
            renderValuesInBars(data, metric, countryID, measurements)})

        .transition().duration(500).attr("y", (d) => measurements.yScale(d[countryID]))
        
        
        .transition().duration(500).delay(500)
            .attr("width", (d) => measurements.xScale(d[metric]))

}

function displayComparisons(event, barData, data, metric, countryID, measurements){
               
            let comparisons = calculateComparisons(data, barData)

            renderComparisonInBars(comparisons, metric, countryID, measurements)
}

function calculateComparisons(data, barData){
            const selectedCountry = barData.countryCode

              let comparisons =  data.map(country => {
               
              let difference = (country.casesPerCapita - barData.casesPerCapita)
                if(country.countryCode === selectedCountry){
                    country.comparison = barData.casesPerCapita
                }
                else if (difference === 0 || Math.round(100*difference/barData.casesPerCapita) === 0){
                    country.comparison = '='
                }
                
                else if (difference > 0){
                    //https://www.w3schools.com/jsref/jsref_round.asp
                    country.comparison = `+${Math.round(100*difference/barData.casesPerCapita)}%`
                }else{
                    difference = barData.casesPerCapita - country.casesPerCapita 
                    country.comparison = `-${Math.round(100*difference/barData.casesPerCapita)}%`
                    if(Math.round(100*difference/barData.casesPerCapita) === 0){country.comparison = '='}

                }
                return country
            })

            return comparisons

}

function renderComparisonInBars (comparisons, metric, countryID, measurements){

        let values = d3.select("svg")
        .selectAll(".casesPerCapita")
        .data(comparisons)

        values
        .enter()
        .append("text")
        .merge(values)
        .attr("class", "casesPerCapita")
        .attr('alignment-baseline', 'central')
        .attr("x", d => measurements.xScale(d[metric])-5)
        .attr("y", d => measurements.yScale(d[countryID]) + measurements.yScale.bandwidth()/2 + measurements.margin.top)
        .text(d => d.comparison)   

}

function renderValuesInBars(data, metric, countryID, measurements ){
        let values = d3.select("svg")
        .selectAll(".casesPerCapita")
        .data(data)
        values
        .enter()
        .append("text")
        .merge(values)
        .attr("class", "casesPerCapita")
        .attr('alignment-baseline', 'central')
        .attr("x", d => measurements.xScale(d[metric]))
        .attr("y", d => measurements.yScale(d[countryID]) + measurements.yScale.bandwidth()/2 + measurements.margin.top)
        .text(d => d.casesPerCapita)       
}


function renderBarChart(data, metric, countryID) {

    data = sortByHighestValues(data, metric)

    // https://www.w3schools.com/jsref/prop_screen_height.asp

    // https://www.w3schools.com/jsref/prop_screen_width.asp

    const width = 0.9 * screen.width
    const height = 0.8 * screen.height
    const margin = { top: 30, right: 0, bottom: 20, left: 30 }
    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width -margin.left - margin.right

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[metric])])
        .range([margin.left, innerWidth]);


    const yScale = d3
        .scaleBand()
        .domain(data.map((d) => d[countryID]))
        .range([0, innerHeight])
        .padding(0.2);


    const yAxis = d3.axisLeft(yScale);
    // const xAxis = d3.axisBottom(xScale).ticks(0);


    if (!barChartAxisRendered) {
        renderYAxis(width, height, margin, yAxis)
        // renderXAxis(width, height, margin, xAxis, innerHeight)

    let xScaleMidPoint = (xScale.range()[1]+xScale.range()[0])/2

    d3.select("svg")
        .append("text")
        .attr("fill", "black")
        .attr("y", 15)
        .attr('x', xScaleMidPoint)
        .attr("text-anchor", "middle")
        .text('Cases Per 100,000 People By Country')

    } else {
        updateYAxis(width, height, yAxis)
        // updateXAxis(width, height, xAxis, innerHeight)

    }

    barChartAxisRendered = true

    let measurements = {yScale, xScale, margin}

    renderBars(data, measurements, metric, countryID)

    renderValuesInBars(data, metric, countryID, measurements)


    //To Do: Get display title rendering in correct position



};


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

function isLatestDateTheSame(allData){

    let dataWithOutNulls = allData.filter(country => country !== null)
    
    let latestDays = dataWithOutNulls.map(country => country[country.length -1].date)

    let latestDaysIgnoringTime = latestDays.map(date => new Date(date).setHours(0, 0, 0, 0))


    //https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal

    let  sameLatestDateForAll =  latestDaysIgnoringTime.every( (val, i, arr) => val === arr[0] )

    

    return sameLatestDateForAll

}

function calculateEarliestDate(allData){

    let dataWithOutNulls = allData.filter(country => country !== null)
    
    let latestDays = dataWithOutNulls.map(country => country[country.length -1].date)

    let latestDaysIgnoringTime = latestDays.map(date => new Date(date).setHours(0, 0, 0, 0))

     //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min

    return (Math.min(...latestDaysIgnoringTime))

}

function filterDataByDates(allData, startDate, endDate){

        return allData.map(country => {
            if(country === null){return null}
            let filteredData =  country.filter(dailyData => {
                let jsDate = new Date (dailyData.date).setHours(0,0,0,0)
                if(jsDate >= startDate && jsDate<= endDate){return dailyData}
             } )

             return filteredData
        })
}


function returnDataWithSameDates(allData){

    const sameLatestDateForAll = isLatestDateTheSame(allData)

    if(sameLatestDateForAll){return allData}else{

        const earliestDate = calculateEarliestDate(allData)

        let startDate = new Date('January 01, 2020 03:24:00').setHours(0,0,0,0)

        let dataWithSameEndDate = filterDataByDates(allData, startDate, earliestDate)

        return dataWithSameEndDate
    }

}

async function getCasesPerCapita(countriesDownloaded) {

    let allData = await getDataFromStorage()

    allData = returnDataWithSameDates(allData)

    let casesPerCapita = calculateCasesPerCapita(allData)



    let promiseToReturn

    if (countriesDownloaded < 27) {
        promiseToReturn = new Promise((resolve, reject) => {
            resolve(casesPerCapita)
        })
    } else {
        promiseToReturn = new Promise((resolve, reject) => {
            resolve(includeEUInCasesPerCapita(allData, casesPerCapita))
        })
    }

    return promiseToReturn


}

function includeEUInCasesPerCapita(allData, casesPerCapita) {

    let totalEuCases = calculateTotalEUCases(allData)

    let euPopulation = calculateEUPopulation()

    casesPerCapita.push({
        countryCode: "eu",
        casesPerCapita: Math.round(totalEuCases / euPopulation),
    });

    return casesPerCapita
}

async function dataForGraphs() {

    let countriesDownloaded = await getNumberOfCountriesDownloaded()

    if (countriesDownloaded === 0) { return }

    casesPerCapita = await getCasesPerCapita(countriesDownloaded)

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

        displayNumberCountriesDownloaded()

        dataForGraphs();

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



getData([...eu], true, []);
