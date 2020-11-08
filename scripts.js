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

let data = []


Promise.all(
  eu
    .slice(0, 9)
    .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
).then((firstCallResponse) => {
  firstCallResponse
    .filter((e) => e.status !== 200)
    .forEach((e) => failedCalls.push(e.url));

  Promise.all(
    firstCallResponse.filter((e) => e.status === 200).map((res) => res.json())
  ).then((firstCallData) => {
    console.log("firstCallData", firstCallData);

             let newData = firstCallData.map((e)=> {
return(
    e.filter(f => f.Province === "")
    
    // .map((g,i) => {
        
    //     if(i===0){console.log('i', i)}
        
    //     return(
    //     {country: g.Country,
    //         countryCode: g.CountryCode,
    //         data: g
    //     }
    // )})
    
    )


            })


                    let newData2 = newData.map(e => {return(
        {country: e[0].Country,
            countryCode: e[0].CountryCode,
            data: e.map((f,i) => {
                
                let todaysCases, todaysDeaths

                i==0 ? todaysCases = f.Confirmed : todaysCases = f.Confirmed - e[i-1].Confirmed
                i==0 ? todaysDeaths = f.Deaths : todaysDeaths = f.Deaths - e[i-1].Deaths
                
                return(
                {casesToDate: f.Confirmed,
                deathsToDate: f.Deaths,
                date: f.Date,
                todaysCases: todaysCases,
                todaysDeaths: todaysDeaths
                }
            )})
        }
    )})

        console.log('newData', newData)

        console.log('newData2', newData2)
   
        return
 
    


    setTimeout(
      () => Promise.all(
      eu
        .slice(9, 18)
        .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
    ).then((secondCallResponse) => {

        console.log('secondCallResponse', secondCallResponse)
      secondCallResponse.filter((e) => e.status !== 200).forEach((e) => failedCalls.push(e.url));

        Promise.all(
    secondCallResponse.filter((e) => e.status === 200).map((res) => res.json())
  ).then(secondCallData => {
      console.log('secondCallData', secondCallData)



          setTimeout(
      () => Promise.all(
      eu
        .slice(18)
        .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
    ).then((thirdCallResponse) => {

        console.log('secondCallResponse', thirdCallResponse)
      thirdCallResponse.filter((e) => e.status !== 200).forEach((e) => failedCalls.push(e.url));

        Promise.all(
    thirdCallResponse.filter((e) => e.status === 200).map((res) => res.json())
  ).then(thirdCallData => {
      console.log('thirdCallData', thirdCallData)
  })


    }),
      5000
    );

  })


    }),
      5000
    );
  });
});
