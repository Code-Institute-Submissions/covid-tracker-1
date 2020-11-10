//find users country from their IP

//if EU make sure their country is called by the second call

//pull their country data and display while the rest is loading

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


const cleanData = (jsonData) => {
   let cleanedData =  jsonData.map((e) => {
      // remove British, French, Dutch and Danish colonies from data

      let changeDataFormat = e.filter((f) => f.Province === "").map((e) => {

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

    return cleanedData
}


const dealWithData = (data, firstCall, countries, failedCalls) => {

    //Record failed calls so that I can re-call them later

  data.filter((e) => e.status !== 200).forEach((e) => { 
      
    
    // I based this on similar code that I found here: https://stackoverflow.com/questions/3568921/how-to-remove-part-of-a-string

    failedCalls.push(e.url.split("country/").pop())});

  // Manipulate data on successful calls

  Promise.all(
    data.filter((e) => e.status === 200).map((res) => res.json())
  ).then((jsonData) => {
    let countryData = cleanData(jsonData)

    console.log("countryData", countryData);

    if (firstCall) {
      localStorage.setItem("eu", 0);
      localStorage.setItem("countriesDownloaded", 0);
    }

    let currentTotal = Number(localStorage.getItem("eu"));

    countryData.forEach((e) => {
      localStorage.setItem(e.country, JSON.stringify(e.data));

 

    // set attribute from Here; https://stackoverflow.com/questions/9422974/createelement-with-id
    //rest from: https://www.w3schools.com/jsref/met_node_appendchild.asp
   
  let node = document.createElement("LI");
  let textnode = document.createTextNode(`${e.country}: ${e.data[e.data.length-1].casesToDate}`);
  node.appendChild(textnode);
  document.getElementById("countries").appendChild(node).setAttribute("id", e.countryCode);



    });

    let countriesDownloaded = Number(
      localStorage.getItem("countriesDownloaded")
    );

    let totalCases = 0
    
    if(countryData.length > 0){
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

    if(countriesDownloaded+countryData.length === 28){

       let ireland = localStorage.getItem("ireland");

    //    console.log('ireland', ireland)

    //    console.log('ireland parsed', JSON.parse(ireland))
 
        // console.log(JSON.parse(allData.ireland))

        // let allData = Object.entries(localStorage)

    //    let colmData = allData.map(e=>{e.map((f,i)=>{

    //         if(i===0){
    //             return f
    //         }else{
    //             console.log('f', f)
    //             console.log('parsed f', f)
    //             return (JSON.parse(f))
    //         }

    //     })
    //     return e
    // })

        // console.log('colmData', colmData)


        // console.log('allData[0]', allData[0])

        // console.log('allData[0][0]', allData[0][0])
        // console.log('allData[0][1]', allData[0][1])

        //  console.log('allData[0][1] PARSED', JSON.parse(allData[0][1]))
    }
    






    if (countries.length > 0) {
      getData(countries, false, failedCalls);
    }else if(failedCalls.length >0){

        countries = failedCalls.splice(0,10)
        getData(countries, false, failedCalls);
    }
  });
};

const getData = (countries, firstCall, failedCalls) => {


  if (firstCall) {
    MakeAPICalls(countries, firstCall, failedCalls);
  } else {
    setTimeout(() => MakeAPICalls(countries, firstCall, failedCalls), 5000);
  }
};

const MakeAPICalls = (countries, firstCall, failedCalls) => {
  Promise.all(
    countries
      .splice(0, 10)
      .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
  ).then((response) => {
    dealWithData(response, firstCall, countries, failedCalls);
  });
};

getData(eu, true, []);
