//find users country from their IP

//if EU make sure their country is called by the second call

//pull their country data and display while the rest is loading

const euDataSet = [
  { country: "austria", countryCode: "at", population: 8.8588 },
  { country: "belgium", countryCode: "be", population: 8.9011 },
  { country: "bulgaria", countryCode: "bg", population: 6.9515 },
  { country: "croatia", countryCode: "hr", population: 4.0582 },
  { country: "cyprus", countryCode: "cy", population: 0.888 },
  { country: "czech-republic", countryCode: "cz", population: 10.6939 },
  { country: "denmark", countryCode: "dk", population: 5.8228 },
  { country: "estonia", countryCode: "ee", population: 1.329 },
  { country: "finland", countryCode: "fi", population: 5.5253 },
  { country: "france", countryCode: "fr", population: 67.0988 },
  { country: "germany", countryCode: "de", population: 83.1667 },
  { country: "greece", countryCode: "gr", population: 10.7097 },
  { country: "hungary", countryCode: "hu", population: 9.7695 },
  { country: "ireland", countryCode: "ie", population: 4.9638 },
  { country: "italy", countryCode: "it", population: 60.2446 },
  { country: "latvia", countryCode: "lv", population: 1.9077 },
  { country: "lithuania", countryCode: "lt", population: 2.7941 },
  { country: "luxembourg", countryCode: "lu", population: 0.6261 },
  { country: "malta", countryCode: "mt", population: 0.5146 },
  { country: "netherlands", countryCode: "nl", population: 17.4076 },
  { country: "poland", countryCode: "pl", population: 37.9581 },
  { country: "portugal", countryCode: "pt", population: 10.2959 },
  { country: "romania", countryCode: "ro", population: 19.318 },
  { country: "slovakia", countryCode: "sk", population: 5.4579 },
  { country: "slovenia", countryCode: "si", population: 2.0959 },
  { country: "spain", countryCode: "es", population: 47.33 },
  { country: "sweden", countryCode: "se", population: 10.3276 },
  { country: "united-kingdom", countryCode: "gb", population: 67.0255 },
];

let eu = euDataSet.map((e) => e.country);

const countryCodes = euDataSet.map((e) => e.countryCode);

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

    console.log('countryData', countryData)

    if (countryData.length > 0) {
      
        totalCases = countryData.map(e=>e.data[e.data.length-1].casesToDate).reduce((a, b) => a + b) 
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

    if (countriesDownloaded + countryData.length === 28) {
      let cyprus = localStorage.getItem("cyprus");

      let unitedKingdom = localStorage.getItem("united-kingdom");


      let allData = euDataSet
        .map((e) => e.countryCode.toLowerCase())
        .map((e) => JSON.parse(localStorage.getItem(e)));


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
