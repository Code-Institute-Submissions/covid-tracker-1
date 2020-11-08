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
  "united-Kingdom",
];

const dealWithData = (data) => {
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

    console.log('newData', newData)

    newData.forEach(e=> {
     
        
        localStorage.setItem(e.country, JSON.stringify(e.data))

        if(e.countryCode === 'ie'){
            console.log('irl')
            document.getElementById(e.countryCode).innerText(localStorage.getItem("ireland"))
        }
        
        
    
    })
       
        



  
  });
};

// Need to code so that more calls will be made if this array is not empty
let failedCalls = [];


// Make API call for first 9 countries

const getData = () => {

    Promise.all(
  eu
    .slice(0, 9)
    .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
).then((firstCallResponse) => {
  dealWithData(firstCallResponse);

  // Cause dealy before next batch of countries are sent to api (to prevent too many calls error)

  setTimeout(
    // Make API call for next 9 countries
    () =>
      Promise.all(
        eu
          .slice(9, 18)
          .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
      ).then((secondCallResponse) => {
        dealWithData(secondCallResponse);

        // Cause dealy before next batch of countries are sent to api (to prevent too many calls error)

        setTimeout(
          () =>
          // Make API call for final 10 countries

            Promise.all(
              eu
                .slice(18)
                .map((e) =>
                  fetch(`https://api.covid19api.com/dayone/country/${e}`)
                )
            ).then((thirdCallResponse) => {
              dealWithData(thirdCallResponse);
            }),
          5000
        );
      }),
    5000
  );
});



}

getData()

