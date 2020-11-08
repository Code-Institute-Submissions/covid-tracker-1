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

// Need to code so that more calls will be made if this array is not empty
let failedCalls = [];

let countryData = [];

// Make API call for first 9 countries

Promise.all(
  eu
    .slice(0, 9)
    .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
).then((firstCallResponse) => {
  // Record failed calls to re-try later

  firstCallResponse
    .filter((e) => e.status !== 200)
    .forEach((e) => failedCalls.push(e.url));

  // Manipulate data on successful calls

  Promise.all(
    firstCallResponse.filter((e) => e.status === 200).map((res) => res.json())
  ).then((firstCallData) => {
    let firstBatch = firstCallData.map((e) => {
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

    countryData = [...firstBatch];

    console.log("countryData", countryData);

    return;

    setTimeout(
      () =>
        Promise.all(
          eu
            .slice(9, 18)
            .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
        ).then((secondCallResponse) => {
          console.log("secondCallResponse", secondCallResponse);
          secondCallResponse
            .filter((e) => e.status !== 200)
            .forEach((e) => failedCalls.push(e.url));

          Promise.all(
            secondCallResponse
              .filter((e) => e.status === 200)
              .map((res) => res.json())
          ).then((secondCallData) => {
            console.log("secondCallData", secondCallData);

            setTimeout(
              () =>
                Promise.all(
                  eu
                    .slice(18)
                    .map((e) =>
                      fetch(`https://api.covid19api.com/dayone/country/${e}`)
                    )
                ).then((thirdCallResponse) => {
                  console.log("secondCallResponse", thirdCallResponse);
                  thirdCallResponse
                    .filter((e) => e.status !== 200)
                    .forEach((e) => failedCalls.push(e.url));

                  Promise.all(
                    thirdCallResponse
                      .filter((e) => e.status === 200)
                      .map((res) => res.json())
                  ).then((thirdCallData) => {
                    console.log("thirdCallData", thirdCallData);
                  });
                }),
              5000
            );
          });
        }),
      5000
    );
  });
});
