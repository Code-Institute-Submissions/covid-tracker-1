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

let failedCalls = []


// Promise.all([
// 	fetch('https://jsonplaceholder.typicode.com/posts'),
// 	fetch('https://jsonplaceholder.typicode.com/users')
// ]).then(function (responses) {
// 	// Get a JSON object from each of the responses
// 	return Promise.all(responses.map(function (response) {
// 		return response.json();
// 	}));
// }).then(function (data) {
// 	// Log the data to the console
// 	// You would do something with both sets of data here
// 	console.log(data);
// }).catch(function (error) {
// 	// if there's an error, log it
// 	console.log(error);
// });

Promise.all(
  eu
    .slice(0, 8)
    .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
).then((firstCallResponse) => {

    firstCallResponse.filter((e) => e.status !== 200).forEach(e => failedCalls.push(e.url))

  Promise.all(firstCallResponse.filter((e) => e.status === 200).map((res) => res.json())).then((data1) => {
    // data1 = data1.map((e) => JSON.parse(e));

    console.log("data1", data1);

    setTimeout(
      () =>
        Promise.all(
          eu
            .slice(9, 17)
            .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
        ).then((secondCallResponse) => {
            secondCallResponse.forEach(e => failedCalls.push(e.url))

          console.log(
            "successfulcalls",
            secondCallResponse.filter((e) => e.status === 200)
          );
        }),
      5000
    );
  });
});

// repeating code - use function

//         console.log('firstCallResponse2 before splice', firstCallResponse2)

//             firstCallResponse2.forEach((e,i )=> {
//                 console.log('in firstCallResponse2', e.url)
//                 console.log(e.status)
//                 console.log('----------')
//         if(e.status !== 200){
//             //push to an array so you can try them again at the end
//             // console.log(`status ${e.status} for ${e.url}`)
//             firstCallResponse2.splice(i,1)
//         }
//     })

//     console.log('firstCallResponse2 after splice', firstCallResponse2)

//     })
// })

//   })

//   .then((responseText) => {
//     console.log('response',responseText);

//   }).catch((err) => {
//     console.log(err);
//   });

// let t0 = performance.now()

// Promise.all(firstCalls).then(async([au, be, bu, cr, cy, cz, dk, et, fi]) => {

//     // au, be, bu, cr, cy, cz, dk, et, fi

//     const austria = await au.json()
//     const belgium = await be.json()
//     const bulgaria = await bu.json()
//     const croatia = await cr.json()
//     const cyprus = await cy.json()
//     const czech = await cz.json()
//     const denmark = await dk.json()
//     const estonia = await et.json()
//     const finland = await fi.json()

//     console.log('belgium', belgium)

//     // apiCalls.slice(9,17)

//     let secondCalls = eu.splice(0,8).map(e => fetch(`https://api.covid19api.com/dayone/country/${e}`))

//     let SecondCall = Promise.all(secondCalls).then(async([fr, de, gr, hu, ie, it, la, li, lu]) => {

//         console.log('after time out')

//         const france = await fr.json()
//         const germany = await de.json()
//         const greece = await gr.json()
//         const hungary = await hu.json()
//         const ireland = await ie.json()
//         const italy = await it.json()
//         const latvia = await la.json()
//         const lithuania = await li.json()
//         const luxembourg = await lu.json()

//         console.log('ireland', ireland)
//         let t1 = performance.now()

//         console.log("API calls took " + (t1 - t0) + " milliseconds.")

//     })

//     console.log('before time out')

//     setTimeout(SecondCall, 4000)

// //     ma, nl, po,
// // pt, ro, sv, sk, es, sw, uk

// //     const malta = await ma.json()
// //     const netherlands = await nl.json()
// //     const poland = await po.json()
// //     const portugal = await pt.json()
// //     const romania = await ro.json()
// //     const slovakia = await sv.json()
// //     const slovenia = await sk.json()
// //     const spain = await es.json()
// //     const sweden = await sw.json()
// //     const unitedKingdom = await uk.json()

//     // const ireland = await ie.json();
//     // const spain = await es.json();
//     // const belgium = await be.json();
//     // const unitedKingdom = await uk.json();

//     // console.log('ireland', ireland[ireland.length-1].Confirmed)
//     // console.log('spain', spain[spain.length-1].Confirmed)
//     // console.log('belgium', belgium[belgium.length-1].Confirmed)
//     // console.log('unitedKingdom', unitedKingdom)
//   })
//   .catch((err) => {
//     console.log(err);
//   });
