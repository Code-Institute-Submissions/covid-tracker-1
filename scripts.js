//local storage

//deal with failedCalls

let eu = [
  "austria",
  "belgium",
  "bulgaria",
  "croatia",
  "cyprus",
  "czech-Republic",
  "denmark",
  "estonia",
  "finland",
  "france",
  "germany",
  "greece",
  "hungary",
  "ireland",
  "italy",
  "latvia",
  "lithuania",
  "luxembourg",
  "malta",
  "netherlands",
  "poland",
  "portugal",
  "romania",
  "slovakia",
  "slovenia",
  "spain",
  "sweden",
  "united-kingdom",
];

let failedCalls = [];

const dealWithData = (data, firstCall, countries) => {
  data.filter((e) => e.status !== 200).forEach((e) => failedCalls.push(e.url));

  // Manipulate data on successful calls

  Promise.all(
    data.filter((e) => e.status === 200).map((res) => res.json())
  ).then((jsonData) => {
    let newData = jsonData.map((e) => {
      // remove data from British, French, Dutch and Danish colonies

      let coloniesRemoved = e.filter((f) => f.Province === "");
      let dataINeed = coloniesRemoved.map((e, i) => {
        // calculate daily totals from data

        let todaysCases, todaysDeaths;

        if (i == 0) {
          todaysCases = e.Confirmed;
          todaysDeaths = e.Deaths;
        } else {
          todaysCases = e.Confirmed - coloniesRemoved[i - 1].Confirmed;
          todaysDeaths = e.Deaths - coloniesRemoved[i - 1].Deaths;
        }

        // return daily data that I want

        return {
          casesToDate: e.Confirmed,
          deathsToDate: e.Deaths,
          date: e.Date,
          todaysCases: todaysCases,
          todaysDeaths: todaysDeaths,
        };
      });

      //   return array for each country in the format I want

      return {
        country: e[0].Country.toLowerCase(),
        countryCode: e[0].CountryCode.toLowerCase(),
        data: dataINeed,
      };
    });

    console.log("newData", newData);

    if (firstCall) {
      localStorage.setItem("eu", 0);
      localStorage.setItem("countriesDownloaded", 0);
    }

    let currentTotal = Number(localStorage.getItem("eu"));

    newData.forEach((e) => {
      localStorage.setItem(e.country, JSON.stringify(e.data));

      if (e.countryCode === "ie") {
        let irelandObject = JSON.parse(localStorage.getItem("ireland"));
        document.getElementById(e.countryCode).innerHTML =
          irelandObject[irelandObject.length - 1].casesToDate;
      }
    });

    let countriesDownloaded = Number(
      localStorage.getItem("countriesDownloaded")
    );

    let totalCases = newData
      .map((e) => e.data[e.data.length - 1].casesToDate)
      .reduce((a, b) => a + b);

    localStorage.setItem(
      "countriesDownloaded",
      countriesDownloaded + newData.length
    );

    localStorage.setItem("eu", currentTotal + totalCases);

    document.getElementById("downloads").innerHTML = localStorage.getItem(
      "countriesDownloaded"
    );

    document.getElementById("euTotalCases").innerHTML = localStorage.getItem(
      "eu"
    );

    if (countries.length > 0) {
      getData(countries, false);
    }
  });
};

const getData = (countries, firstCall) => {
  if (firstCall) {
    MakeAPICalls(countries, firstCall);
  } else {
    setTimeout(() => MakeAPICalls(countries, firstCall), 5000);
  }
};

const MakeAPICalls = (countries, firstCall) => {
  Promise.all(
    countries
      .splice(0, 10)
      .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
  ).then((response) => {
    dealWithData(response, firstCall, countries);
  });
};

getData(eu, true);
