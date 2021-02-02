//TO DO: find users country from their IP

//TO DO: Fix Bug. If screen size changes values/comparisons will change size even though bar size has not

let backUpData = [
    [{casesToDate: 404714,
date: "2021-01-24T00:00:00Z",
deathsToDate: 7418}, {casesToDate: 405723,
date: "2021-01-25T00:00:00Z",
deathsToDate: 7451}], 

[{casesToDate: 693666,
date: "2021-01-24T00:00:00Z",
deathsToDate: 20779}, {casesToDate: 694858,
date: "2021-01-25T00:00:00Z",
deathsToDate: 20814},
],

[{casesToDate: 214817,
date: "2021-01-24T00:00:00Z",
deathsToDate: 8820}, {casesToDate: 215589,
date: "2021-01-25T00:00:00Z",
deathsToDate: 8880}],

[{casesToDate: 228920,
date: "2021-01-24T00:00:00Z",
deathsToDate: 4827}, {casesToDate: 229054,
date: "2021-01-25T00:00:00Z",
deathsToDate: 4859}]
]

//https://www.w3schools.com/jsref/prop_win_innerheight.asp

let windowHeight= window.innerHeight;
let windowWidth = window.innerWidth
let expanded = false;
let allCountriesDownloaded = false
let apiFailedCalls = 0


//https://stackoverflow.com/questions/17714705/how-to-use-checkbox-inside-select-option

let tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")

let highlightedCountries = ["eu"]
const euDataSet = [
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
let eu = euDataSet.map((e) => e.country);
const countryCodes = euDataSet.map((e) => e.countryCode)
let countriesDownloaded = 0
let barChartAxisRendered = false
let latestCommonDate = new Date()
let verticalBarChart = false


function showCheckboxes(checkboxType) {
    let checkboxes = document.getElementById(checkboxType);
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
        console.log(`overSelect-${checkboxType}`)
      let width =   document.getElementById(`overSelect-${checkboxType}`).clientWidth;
      console.log('width', width)
      console.log(document.getElementsByClassName('checkboxes'))

      let checkboxHTML = [...document.getElementsByClassName('checkboxes')]
    
      checkboxHTML.forEach(e => e.style.width = `${width}px`)


      

    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

function collapseCheckboxes(checkboxType){
    let checkboxes = document.getElementById(checkboxType);
    checkboxes.style.display = "none";
    expanded = false;
}

function getUncheckedCountries() {

    // https://stackoverflow.com/questions/3871547/js-iterating-over-result-of-getelementsbyclassname-using-array-foreach

    let unCheckedCountries = [...document.getElementsByClassName('select-country')].filter(e => !e.checked).map(e => e.id)

    let unCheckedClassNames = [...document.getElementsByClassName('select-country')].filter(e => !e.checked).map(e => e.class)

    return unCheckedCountries
}

function setHighlightedCountries() {
    highlightedCountries = [...document.getElementsByClassName('highlight-country')].filter(e => e.checked).map(e => e.id)

}


function displayNav() {

    document.getElementById('nav').style.display = "flex";

}

function setDefaultDates() {

    if (countriesDownloaded < 27) { return }

    document.getElementById("end-date").value = convertDateFormat(latestCommonDate).toString()
    document.getElementById("end-date").max = convertDateFormat(latestCommonDate).toString()
    document.getElementById("start-date").max = convertDateFormat(latestCommonDate).toString()

}

function convertDateFormat(date) {

    //https://dzone.com/articles/javascript-convert-date

    let month = new Date(date).getMonth() + 1
    let day = new Date(date).getDate()
    let year = new Date(date).getFullYear()

    if (month < 10) {
        month = `0${month.toString()}`
    }

    if (day < 10) {
        day = `0${day.toString()}`
    }





    return `${year}-${month}-${day}`

}

async function changeRequestedData() {

    d3.selectAll(".values-in-bar").style("opacity", "0")

    let startDate = new Date(document.getElementById("start-date").value)

    //https://stackoverflow.com/questions/25136760/from-date-i-just-want-to-subtract-1-day-in-javascript-angularjs

    startDate = new Date(startDate.setDate(startDate.getDate() - 1)).setHours(0, 0, 0, 0)

    let endDate = new Date(document.getElementById("end-date").value).setHours(0, 0, 0, 0)

    let allData = await getDataFromStorage()

    dataForGraphs(startDate, endDate, allData)

}




function setBarChartType() {
    if (windowWidth > windowHeight) { verticalBarChart = true }
}


// This function is from https://www.youtube.com/watch?v=_8V5o2UHG0E&t=26788s

function sortByHighestValues(data, metric) {
    return data.sort((a, b) => b[metric] - a[metric])
}




function displayToolTip(barData) {
    if (countriesDownloaded < 27) { return }
    tooltip.text(barData.country);
    return tooltip.style("visibility", "visible")
}



var BrowserText = (function () {

    //https://stackoverflow.com/questions/29031659/calculate-width-of-text-before-drawing-the-text
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    /**
     * Measures the rendered width of arbitrary text given the font size and font face
     * @param {string} text The text to measure
     * @param {number} fontSize The font size in pixels
     * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
     * @returns {number} The width of the text
     **/
    function getWidth(text, fontSize, fontFace) {
        context.font = fontSize + 'px ' + fontFace;
        return context.measureText(text).width;
    }

    return {
        getWidth: getWidth
    };
})();

function getBarWidth(measurements, countryData, metric){

    if(verticalBarChart){return measurements.xScale.bandwidth()}
    return  measurements.xScale(countryData[metric])

}


function setBarMaxWidth(data, countryID, measurements, metric, countryData){

    // if(!verticalBarChart){return}

    let barWidth = getBarWidth(measurements)

    // verticalBarChart ? barWidth= measurements.xScale.bandwidth() : barWidth = measurements.xScale(countryData[metric])
    

        if(barWidth > 200){

            let widthDifference = 200 - barWidth
            
             const xScale = setXScale(data, countryID, measurements.margin, measurements.innerWidth - widthDifference, metric)

             updateXAxis(measurements.width, measurements.height, d3.axisBottom(xScale), measurements.innerHeight)
        
            barWidth = 200
        }
        return barWidth
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
                .range([0, width]);
        }
    }

function updateXAxis(width, height, xAxis) {

        if (!verticalBarChart) { return }

        d3.select("svg")
            .attr("width", width)
            .attr("height", height)
            .selectAll("g.x.axis")
            .transition().delay(500)
            .call(xAxis)

        d3.selectAll(".x.axis .tick")
            .on("mouseover", function(event, countryCode) {  displayToolTip(getCountryName(countryCode))        })
            .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
            .on("mouseout", () => tooltip.style("visibility", "hidden") )
    }

function getCountryName(countryCode){

    if(countryCode === 'eu'){ return 'European Union'}

    let countryCodes = euDataSet.map(e=> e.countryCode)

    let index = countryCodes.indexOf(countryCode)

    return {country: euDataSet[index].country}

}







function renderValuesInBars(data, metric, countryID, measurements, barData, countriesDownloaded, barWidth) {

    if (countriesDownloaded < 27) { return }




    function calculateFontSize(countryData, data, measurements, metric) {
            let text = decideTextToReturn(countryData, metric, data, measurements)
            let textWidth = 0
            let barWidth = getBarWidth(measurements, countryData, metric)
            let fontSize = 0
         

        if (verticalBarChart) {
            //https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions/8876069#8876069
            fontSize =  ((.25 / data.length) * Math.max(windowWidth || 0, window.innerWidth || 0)).toString()
            barWidth = setBarMaxWidth(data, countryID, measurements, metric)
            textWidth = BrowserText.getWidth(text, fontSize, 'sans-serif')

        } else {
            fontSize = 12
            textWidth = BrowserText.getWidth(text, fontSize, 'sans-serif')
        }

        while(textWidth > .95*barWidth){

            fontSize = fontSize -1
            textWidth = BrowserText.getWidth(text, fontSize, 'sans-serif')
    
        }

        return fontSize
    }

    function setXValue(data, metric, countryData, measurements, countryID) {
        if (verticalBarChart) {


            return measurements.xScale(countryData[countryID]) +setBarMaxWidth(data, countryID, measurements, metric)/ 2
        } else {

            let fontSize =  calculateFontSize(countryData, data, measurements, metric)
            let text = decideTextToReturn(countryData, metric)
            let textWidth = BrowserText.getWidth(text, fontSize, 'sans-serif')

            let reduction = 0

            reduction = textWidth -Math.log(10000)
 
            return (measurements.xScale(countryData[metric]) +20 - reduction)
        }
    }

    function setYValue(countryData, measurements, metric) {


        if (verticalBarChart) {
            return measurements.yScale(countryData[metric]) + measurements.margin.top + setBarMaxWidth( data, countryID, measurements, metric,  )/3
        } else {
            return (measurements.yScale(countryData[countryID]) + measurements.yScale.bandwidth() / 2 + measurements.margin.top)
        }
    }


    function setColor(countryData, barData) {

        return "white"

        // if (!verticalBarChart) { return "white" }


        // let valueToReturn

        // countryData.countryCode === 'eu' ? valueToReturn = 'orange' : valueToReturn = 'steelBlue'

        // if (barData === undefined) { return valueToReturn }
        // if (barData.countryCode === 'eu' && countryData.countryCode === 'eu') { return 'orange' }
        // if (typeof (countryData.comparison) === 'number') { return "steelblue" }
        // if (countryData.comparison.includes("+")) { return "tomato" }
        // return "darkgreen"


    }

    function decideTextToReturn(countryData, metric) {


        let text = ''

        if (countryData.comparison !== undefined) { text = countryData.comparison }
        else if(countryData[metric]<0.001){text = ''}
        else { text = countryData[metric] }

       

  

        //or make fontSize smaller?
        //below if statement should be if fontsize is below a certain level

     
        return text
    }

    function setTextAnchor() {
        if (verticalBarChart) { return 'middle' }
        else { return 'start' }
    }

    function setAlignmentBaseline() {
        if (verticalBarChart) { return 'auto' }
        else { return 'central' }
    }

 
    function applyHoverEffectsToBar(event) {
        let allBars = [...document.getElementsByTagName("rect")]

        let allBarData = allBars.map(e => e.__data__)

        let countryCodes = allBars.map(e => e.dataset.countryCode)

        let index = countryCodes.indexOf(event.target.dataset.countryCode)

        document.getElementsByTagName("rect")[index].style.opacity = "0.5"

        displayToolTip(allBarData[index])
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px")
    }

    function removeHoverEffectsFromBar(event) {

        tooltip.style("visibility", "hidden")

        let allBars = [...document.getElementsByTagName("rect")]

        let countryCodes = allBars.map(e => e.dataset.countryCode)

        let index = countryCodes.indexOf(event.target.dataset.countryCode)

        document.getElementsByTagName("rect")[index].style.opacity = "1"
    }



    let values = d3.select("svg")
        .selectAll(".casesPerCapita")
        .data(data, d => d[countryID])

    values
        .enter()
        .append("text")
        .merge(values)
        .attr("class", `${metric} values-in-bar`)
        .attr('text-anchor', setTextAnchor())
        .attr('alignment-baseline', setAlignmentBaseline())
        .attr('data-countryCode', d => d.countryCode)
        .attr("x", countryData => setXValue(data, metric, countryData, measurements, countryID))
        .attr("y", countryData => setYValue(countryData, measurements, metric))
        .style("fill", countryData => setColor(countryData, barData))
        .style("font-size", countryData => calculateFontSize(countryData, data, measurements, metric))
        .style("opacity", "1")
        .text(countryData => decideTextToReturn(countryData, metric, data, measurements))
        .on('mouseover', (event, barData) => {applyHoverEffectsToBar(event);  displayComparisons(event, barData, data, metric, countryID, measurements) })
        .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
        .on('mouseout', (event, barData) => { removeHoverEffectsFromBar(event); removeComparisons(data, metric, countryID, measurements) })
        

        
        

    values.exit().remove()

}

function removeComparisons(data, metric, countryID, measurements) {
    let dataWithOutComparisons = data.map(countryData => {
        delete countryData.comparison
        return countryData
    })
    renderValuesInBars(data, metric, countryID, measurements)
}

function setSpeed() {

    
    if (!allCountriesDownloaded) { 

        return 4500 }
    else { 

        return 500 }
}




function renderBarChart(data, metric, countryID, countriesDownloaded) {

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



    function renderXAxis(width, height, margin, xAxis, innerHeight) {

        if (!verticalBarChart) { return }

        d3.select("svg").attr("width", width).attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${innerHeight + margin.top})`)
            .call(xAxis)
            .selectAll('.tick line').remove()

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



    function updateYAxis(width, height, yAxis) {
        if (verticalBarChart) { return }

        d3.select("svg")
            .selectAll("g.y.axis")
            .transition().delay(setSpeed() / 2)
            .call(yAxis)
            .selectAll('.tick line').remove()

            d3.selectAll(".y.axis .tick")
            .on("mouseover", function(event, countryCode) {  displayToolTip(getCountryName(countryCode))        })
            .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
            .on("mouseout", tooltip.style("visibility", "hidden") )
            
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
            .attr('data-countryCode', d => d.countryCode)
            .merge(selectDataForBarCharts)
            .on('mouseover', (event, barData) => { displayComparisons(event, barData, data, metric, countryID, measurements); displayToolTip(barData) })
            .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
            .on('mouseout', () => { removeComparisons(data, metric, countryID, measurements); tooltip.style("visibility", "hidden") })
            .transition().delay(setSpeed() / 2)
            .attr("fill", d => setBarColor(d))
            .attr("height", measurements.yScale.bandwidth())
            .attr("transform", `translate(${measurements.margin.left}, ${measurements.margin.top})`)
            .attr("y", (d) => measurements.yScale(d[countryID]))
            .transition().duration(setSpeed() / 2).attr("width", (d) => measurements.xScale(d[metric]))
             
            .ease(d3.easeBounce)
            //https://gist.github.com/miguelmota/3faa2a2954f5249f61d9
            .end()
            .then(() => {
                renderValuesInBars(data, metric, countryID, measurements, [], countriesDownloaded)
            });
        
      

        selectDataForBarCharts.exit()
            .transition().duration(500).attr("width", 0)
            .transition().duration(500).delay(500).remove()
    }





    function renderVerticalBars(data, measurements, metric, countryID) {


        let selectDataForBarCharts = d3.select("svg")
            .selectAll("rect")
            .data(data, d => d[countryID])
        
            

        selectDataForBarCharts
            .enter()
            .append("rect")
            .attr('width', setBarMaxWidth (data, countryID, measurements, metric))
            .attr("height", 0)
            .attr('y', d => measurements.yScale(0))
            .attr('data-countryCode', d => d.countryCode)
            .merge(selectDataForBarCharts)
            .on('mouseover', (event, barData) => { displayComparisons(event, barData, data, metric, countryID, measurements); displayToolTip(barData) })
            .on("mousemove", (event) => tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"))
            .on('mouseout', () => { removeComparisons(data, metric, countryID, measurements); tooltip.style("visibility", "hidden") })
            .transition().delay(500)
            .attr("transform", `translate(0, ${measurements.margin.top})`)
            .attr('width', setBarMaxWidth (data, countryID, measurements, metric))
            .attr('x', (d) => measurements.xScale(d[countryID]))
            .transition()
            .ease(d3.easeBounce)
            .duration(setSpeed())
            .attr("height", d => measurements.innerHeight - measurements.yScale(d[metric]))
           
            .attr("y", (d) => measurements.yScale(d[metric]))
            .attr("fill", d => setBarColor(d))
            //https://gist.github.com/miguelmota/3faa2a2954f5249f61d9
            .end()
            .then(() => {
                renderValuesInBars(data, metric, countryID, measurements, [], countriesDownloaded)
            });
        


        selectDataForBarCharts.exit()
            .transition().duration(500).attr("height", 0).attr("y", d => measurements.yScale(0)).remove()

            
    }

    function setBarColor(data) {

        if (highlightedCountries.includes(data.countryCode)) { return 'orange' }
        else { return "steelBlue" }
    }





    data = sortByHighestValues(data, metric)


    const width = 0.9 * windowWidth
    const height = 0.8 * windowHeight
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

    let measurements = { yScale, xScale, margin, height, innerHeight, innerWidth }

    verticalBarChart ? renderVerticalBars(data, measurements, metric, countryID) : renderHorizontalBars(data, measurements, metric, countryID)

    // setTimeout(renderValuesInBars, 1000, data, metric, countryID, measurements);

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


    let dataToReturn = allData.map(country => {
        if (country === null) { return null }
        let filteredData = country.filter(dailyData => {
            let jsDate = new Date(dailyData.date).setHours(0, 0, 0, 0)

            if (jsDate >= startDate && jsDate <= endDate) { return dailyData }
        })

        return filteredData
    })

    return dataToReturn
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

function calculateCasesPerCapita(allData, startDate, endDate) {


    let casesPerCapita = allData
        .map((country, index) => {

            //prevent countries that haven't been downloaded yet from causing errors

            if (country === null) { return null }

            let firstDateData

            let latestDateData

            if (country.length === 0) {
                firstDateData = 0
                latestDateData = 0
            } else if (country.length === 1) {
                firstDateData = 0
                latestDateData = country[country.length - 1].casesToDate;
            }
            else if (country[0].firstDayOfData) {
                firstDateData = 0
                latestDateData = country[country.length - 1].casesToDate
            }
            else {
                firstDateData = country[0].casesToDate
                latestDateData = country[country.length - 1].casesToDate
            }



            // if(firstDateData === latestDateData){firstDateData = 0}

            let casesPerCapita = ((latestDateData - firstDateData) / euDataSet[index].population).toFixed(3)

            if (casesPerCapita > 0.49) { casesPerCapita = Math.round(casesPerCapita) }



            return {
                ["country"]: euDataSet[index].country,
                ["countryCode"]: euDataSet[index].countryCode,
                ["casesPerCapita"]: casesPerCapita
            };

        })
        //remove countries that haven't been downloaded yet & countries without data
        // .filter(country => country !== undefined && country !== null && country.casesPerCapita > 0)
        .filter(country => country !== undefined && country !== null)



    return casesPerCapita

}

function getCasesPerCapita(requestedData, startDate, endDate) {


    let casesPerCapita = calculateCasesPerCapita(requestedData, startDate, endDate)

    if (countriesDownloaded < 27) {

        return casesPerCapita
    }
    else {

        return includeEUInCasesPerCapita(requestedData, casesPerCapita)
    }

}

function calculateEUPopulation() {
    return euDataSet.map((country) => country.population).reduce((a, b) => a + b)
}

function calculateTotalEUCases(allData) {

    let totalCases = [];

    allData
        .forEach((country) => {
            let firstDateDate, latestDateData

            if (country.length === 0) {
                firstDateData = 0
                latestDateData = 0
            } else if (country.length === 1) {
                firstDateData = 0
                latestDateData = country[country.length - 1].casesToDate;
            }
            else if (country[0].firstDayOfData) {
                firstDateData = 0
                latestDateData = country[country.length - 1].casesToDate
            }
            else {
                firstDateData = country[0].casesToDate
                latestDateData = country[country.length - 1].casesToDate
            }


            totalCases.push(latestDateData - firstDateData);
        })

    return totalCases.reduce((a, b) => a + b);
}

function includeEUInCasesPerCapita(allData, casesPerCapita) {

  

    let totalEuCases = calculateTotalEUCases(allData)


    let euPopulation = calculateEUPopulation()

    let euCasesPerCapita = (totalEuCases / euPopulation).toFixed(4)

    if((totalEuCases / euPopulation).toFixed(3)>0.000){
        euCasesPerCapita = (totalEuCases / euPopulation).toFixed(3)
    }
    


    if(euCasesPerCapita === 0.000){euCasesPerCapita = totalEuCases / euPopulation}


    if (euCasesPerCapita > 1) { euCasesPerCapita = Math.round(euCasesPerCapita) }

 


    casesPerCapita.push({
        country: "european union",
        countryCode: "eu",
        casesPerCapita: euCasesPerCapita,
    });

    return casesPerCapita

}



function filterDataByCountry(data) {

    let countriesToDelete = getUncheckedCountries()

    let countryCodes = data.map(country => country.countryCode)

    let indexesToDelete = countriesToDelete.map(country => countryCodes.indexOf(country)).sort((a, b) => b - a)

    indexesToDelete.forEach(index => {
        data.splice(index, 1)
    })
    return data
}

function dataForGraphs(startDate, endDate, allData, countriesDownloaded) {


    if (countriesDownloaded === 0) { return }

    let filteredDataByDate = filterDataByDates(allData, startDate, endDate)

    casesPerCapita = getCasesPerCapita(filteredDataByDate, startDate, endDate)

    filteredDataByCountry = filterDataByCountry(casesPerCapita)

    setHighlightedCountries()

    renderBarChart(filteredDataByCountry, "casesPerCapita", "countryCode", countriesDownloaded);
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

        let dailySummaries = country.map((dailyData, index) => {

            let objectToReturn = {
                casesToDate: dailyData.Confirmed,
                deathsToDate: dailyData.Deaths,
                date: dailyData.Date,
            };
            if (index === 0) { objectToReturn.firstDayOfData = true }
            return objectToReturn
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



        if (countriesDownloaded === 27) {
            allCountriesDownloaded = true
            setDefaultDates()
            displayNav()       
        }

        displayNumberCountriesDownloaded()

        let allData = await getDataFromStorage()

        let startDate = new Date('January 24, 2020 03:24:00').setHours(0, 0, 0, 0)

        let endDate = calculateCommonLatestDate(allData)


        dataForGraphs(startDate, endDate, allData, countriesDownloaded)

    }
    getData(countries, false, failedCalls);
};

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
    .catch((err)=> {
        console.log('err')

        //TO DO: Make error display on UI if promise fails three times
   
         apiFailedCalls++
         console.log('apiFailedCalls', apiFailedCalls)
         if(apiFailedCalls >=35){
             console.log('api call failed five times')
             return
            }else{

                setTimeout(() => getData([...eu], true, []), 10000);
         
            }
        
    
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


// setBarChartType()
// getData([...eu], true, []);




