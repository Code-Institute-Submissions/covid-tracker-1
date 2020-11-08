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
