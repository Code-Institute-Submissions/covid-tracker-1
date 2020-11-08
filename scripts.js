let eu = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech-Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "United-Kingdom",
];

const dealWithData = (data) => {

    data
    .filter((e) => e.status !== 200)
    .forEach((e) => failedCalls.push(e.url));

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
        country: e[0].Country,
        countryCode: e[0].CountryCode,
        data: dataINeed,
      };
    });

    countryData = [...countryData, ...newData]
    console.log('countryData', countryData)
})
}








// Need to code so that more calls will be made if this array is not empty
let failedCalls = [];

let countryData = [];

// Make API call for first 9 countries

Promise.all(
  eu
    .slice(0, 9)
    .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
).then((firstCallResponse) => {

    dealWithData(firstCallResponse)

    // Cause dealy before next batch of countries are sent to api (to prevent too many calls error)

    setTimeout(
        // Make API call for next 9 countries
      () =>
        Promise.all(
          eu
            .slice(9, 18)
            .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
        ).then((secondCallResponse) => {

            dealWithData(secondCallResponse)

        //       // Record failed calls to re-try later
        //   secondCallResponse
        //     .filter((e) => e.status !== 200)
        //     .forEach((e) => failedCalls.push(e.url));

        //   Promise.all(
        //     secondCallResponse
        //       .filter((e) => e.status === 200)
        //       .map((res) => res.json())
        //   ).then((secondCallData) => {
        //     console.log("secondCallData", secondCallData);

            setTimeout(
              () =>
                Promise.all(
                  eu
                    .slice(18)
                    .map((e) =>
                      fetch(`https://api.covid19api.com/dayone/country/${e}`)
                    )
                ).then((thirdCallResponse) => {

                    dealWithData(thirdCallResponse)

                }),
              5000
            );
          }), 5000
        // }),
     
      );
  });
// });
