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

let failedCalls = [];

Promise.all(
  eu
    .slice(0, 8)
    .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
).then((firstCallResponse) => {
  firstCallResponse
    .filter((e) => e.status !== 200)
    .forEach((e) => failedCalls.push(e.url));

  Promise.all(
    firstCallResponse.filter((e) => e.status === 200).map((res) => res.json())
  ).then((data1) => {
    console.log("data1", data1);
    


    setTimeout(
      () => Promise.all(
      eu
        .slice(9, 17)
        .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
    ).then((secondCallResponse) => {

        console.log('secondCallResponse', secondCallResponse)
      secondCallResponse.filter((e) => e.status !== 200).forEach((e) => failedCalls.push(e.url));

        Promise.all(
    secondCallResponse.filter((e) => e.status === 200).map((res) => res.json())
  ).then(data2 => {
      console.log('data2', data2)
  })


    }),
      5000
    );
  });
});
