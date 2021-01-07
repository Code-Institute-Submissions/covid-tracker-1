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
  { country: "united-kingdom", countryCode: "gb", population: 670.255 },
];

let eu = euDataSet.map((e) => e.country);

const countryCodes = euDataSet.map((e) => e.countryCode);

// This function is from https://www.youtube.com/watch?v=_8V5o2UHG0E&t=26788s

const colmRender = (data, metric, countryID, callNumber) => {
  //   https://www.w3schools.com/jsref/jsref_isnan.asp

  data = data
    .filter((e) => !isNaN(e[metric]))
    .sort((a, b) => b[metric] - a[metric]);

  console.log("data", data);

  const xValue = (d) => d[metric];
  const yValue = (d) => d[countryID];

  // https://www.w3schools.com/jsref/prop_screen_height.asp

  // https://www.w3schools.com/jsref/prop_screen_width.asp

  const width = screen.width;
  const height = screen.height;

  const svg = d3.select("svg").attr("width", width).attr("height", height);

  //     const width = +svg.attr("width");
  //   const height = +svg.attr("height");

  //   console.log('width', width)
  //   console.log('height', height)

  //

  const margin = { top: 20, right: 20, bottom: 20, left: 30 };
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[metric])])
    .range([0, innerWidth]);

  console.log("domain", xScale.domain());

  console.log("range", xScale.range());

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d[countryID]))
    .range([0, innerHeight])
    .padding(0.2);

  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale).ticks(5);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const firstCall = g;
  const subsequentCall = svg;
  let callStatus;

  if (callNumber === 0) {
    // append axis
    callStatus = firstCall;
    g.append("g")

      .attr("class", "y axis")
      .call(yAxis);

    g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);
  } else {
    callStatus = subsequentCall;
    //update yAxis
    // https://stackoverflow.com/questions/16919280/how-to-update-axis-using-d3-js
    svg.selectAll("g.y.axis").call(yAxis);

    svg.selectAll("g.x.axis").call(xAxis);
  }

  calls++;

  d3.select("svg")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(d[countryID]))
    .attr("width", (d) => xScale(d[metric]))
    .attr("height", yScale.bandwidth())
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg
    .selectAll("rect")
    .data(data)
    //   .enter()
    //   .append('rect')
    .attr("y", (d) => yScale(d[countryID]))
    .attr("width", (d) => xScale(d[metric]))
    .attr("height", yScale.bandwidth())
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
};

// dataForGraphs();

const render = (data, metric, countryID) => {
  const svg = d3.select("svg");
  const width = .7*screen.width;
  const height = .7*screen.height;

  console.log('screen.width', screen.width)
  console.log('screen.height', screen.height)

  console.log('width', width)
  console.log('height', height)

  const xValue = (d) => d[metric];
  const yValue = (d) => d[countryID];
  const margin = { top: 40, right: 20, bottom: 20, left: 25 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.15);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("height", height)
    .attr("width", width)

  const xAxis = d3.axisBottom(xScale).tickSize(-innerWidth);

  g.append("g")
    .call(d3.axisLeft(yScale))
    .selectAll(".domain, .tick line")
    .remove();

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`);

  xAxisG.select(".domain").remove();

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", (d) => xScale(xValue(d)))
    .attr("height", yScale.bandwidth());

  g.append("text")
    .attr("y", -8)
    .text("Covid Cases Per 100,000 People by Country");
};

let calls = 0;

function dataForGraphs(countriesDownloaded) {

  let allData = euDataSet.map((e) =>
    JSON.parse(localStorage.getItem(e.countryCode))
  );
  let totalCases = [];

  allData = allData
    .map((e, i) => {
      if (e !== null) {
        let latestDay = e[e.length - 1];
        if (euDataSet[i].countryCode !== "gb") {
          totalCases.push(latestDay.casesToDate);
        }

        return {
          ["countryCode"]: euDataSet[i].countryCode,
          ["casesPerCapita"]: Math.round(
            latestDay.casesToDate / euDataSet[i].population
          ),
        };
      }
    })
    .filter((e) => e !== undefined);

  if (countriesDownloaded === 28) {
    let totalEuCases = totalCases.reduce((a, b) => a + b);

    let euPopulation =
      euDataSet.map((e) => e.population).reduce((a, b) => a + b) - 670.255;

    allData.push({
      countryCode: "eu",
      casesPerCapita: Math.round(totalEuCases / euPopulation),
    });
  }

  colmRender(allData, "casesPerCapita", "countryCode", calls);
}

const cleanData = (jsonData) => {
  let cleanedData = jsonData.map((e) => {
    // remove British, French, Dutch and Danish colonies from data

    let changeDataFormat = e
      .filter((f) => f.Province === "")
      .map((e) => {
        return {
          casesToDate: e.Confirmed,
          deathsToDate: e.Deaths,
          date: e.Date,
        };
      });

    //   return array for each country in the format I want

    return {
      country: e[0].Country.toLowerCase(),
      countryCode: e[0].CountryCode.toLowerCase(),
      data: changeDataFormat,
    };
  });

  return cleanedData;
};


const dealWithData = (data, firstCall, countries, failedCalls) => {
  //Record failed calls so that I can re-call them later

  data
    .filter((e) => e.status !== 200)
    .forEach((e) => {
      // I based this on similar code that I found here: https://stackoverflow.com/questions/3568921/how-to-remove-part-of-a-string

      failedCalls.push(e.url.split("country/").pop());
    });

  // Manipulate data on successful calls

  Promise.all(
    data.filter((e) => e.status === 200).map((res) => res.json())
  ).then((jsonData) => {
    let countryData = cleanData(jsonData);

    if (firstCall) {
      localStorage.setItem("eu", 0);
      localStorage.setItem("countriesDownloaded", 0);
    }

    let currentTotal = Number(localStorage.getItem("eu"));

    countryData.forEach((e, i) => {
      localStorage.setItem(e.countryCode, JSON.stringify(e.data));

      // set attribute from Here; https://stackoverflow.com/questions/9422974/createelement-with-id
      //rest from: https://www.w3schools.com/jsref/met_node_appendchild.asp

      let node = document.createElement("LI");
      let textnode = document.createTextNode(
        `${e.country}: ${e.data[e.data.length - 1].casesToDate}`
      );
      node.appendChild(textnode);
      document
        .getElementById("countries")
        .appendChild(node)
        .setAttribute("id", e.countryCode);
    });

    let countriesDownloaded = Number(
      localStorage.getItem("countriesDownloaded")
    );

    let totalCases = 0;

    if (countryData.length > 0) {
      totalCases = countryData
        .map((e) => e.data[e.data.length - 1].casesToDate)
        .reduce((a, b) => a + b);
    }

    localStorage.setItem(
      "countriesDownloaded",
      countriesDownloaded + countryData.length
    );

    localStorage.setItem("eu", currentTotal + totalCases);

    document.getElementById("downloads").innerHTML = localStorage.getItem(
      "countriesDownloaded"
    );

    document.getElementById("euTotalCases").innerHTML = localStorage.getItem(
      "eu"
    );

    if (countriesDownloaded + countryData.length > 0) {
      dataForGraphs(countriesDownloaded + countryData.length);
    }

    if (countries.length > 0) {
      getData(countries, false, failedCalls);
    } else if (failedCalls.length > 0) {
      countries = failedCalls.splice(0, 10);
      getData(countries, false, failedCalls);
    }
  });
};

const getData = (countries, firstCall, failedCalls) => {
  if (firstCall) {
    localStorage.clear();
    makeAPICalls(countries, firstCall, failedCalls);
  } else {
    setTimeout(() => makeAPICalls(countries, firstCall, failedCalls), 5000);
  }
};

const makeAPICalls = (countries, firstCall, failedCalls) => {
  Promise.all(
    countries
      .splice(0, 10)
      .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
  ).then((response) => {
    dealWithData(response, firstCall, countries, failedCalls);
  });
};

getData([...eu], true, []);
