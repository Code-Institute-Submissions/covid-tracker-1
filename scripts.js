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

console.log("slice", eu.slice(0, 8));

// let secondCalls = eu.slice(9,17).map(e => fetch(`https://api.covid19api.com/dayone/country/${e}`))

// Promise.all(urls.map(u=>fetch(u))).then(responses =>

//     Promise.all(responses.map(res => res.text()))
// )

// .then(texts => {
//     …
// })

// Promise.all(urls.map(u=>fetch(u))).then(responses =>
//     Promise.all(responses.map(res => res.text()))
// ).then(texts => {

// })

Promise.all(
  eu
    .slice(0, 8)
    .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
).then((responses) => {
  responses.forEach((e, i) => {
    if (e.status !== 200) {
      //push to an array so you can try them again at the end
      console.log(`status ${e.status} for ${e.url}`);
      responses.splice(i, 1);
    }
  });

  Promise.all(responses.map((res) => res.text())).then((data1) => {
    data1 = data1.map((e) => JSON.parse(e));

    console.log("data1", data1);

    setTimeout(
      () =>
        Promise.all(
          eu
            .slice(9, 17)
            .map((e) => fetch(`https://api.covid19api.com/dayone/country/${e}`))
        ).then((secondCallResponse) => {
          console.log(
            "failedcalls",
            secondCallResponse.filter((e) => e.status !== 200)
          );

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

//         console.log('responses2 before splice', responses2)

//             responses2.forEach((e,i )=> {
//                 console.log('in responses2', e.url)
//                 console.log(e.status)
//                 console.log('----------')
//         if(e.status !== 200){
//             //push to an array so you can try them again at the end
//             // console.log(`status ${e.status} for ${e.url}`)
//             responses2.splice(i,1)
//         }
//     })

//     console.log('responses2 after splice', responses2)

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
