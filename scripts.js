
let EU = [
    'Austria',
    'Belgium',
    'Bulgaria',
    'Croatia',
    'Cyprus',
    'Czech-Republic',
    'Denmark',
    'Estonia',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Hungary',
    'Ireland',
    'Italy',
    'Latvia',
    'Lithuania',
    'Luxembourg',
    'Malta',
    'Netherlands',
    'Poland',
    'Portugal',
    'Romania',
    'Slovakia',
    'Slovenia',
    'Spain',
    'Sweden',
    'United-Kingdom']

let apiCalls = EU.map(e => fetch(`https://api.covid19api.com/dayone/country/${e}`))
let t0 = performance.now()

Promise.all(apiCalls).then(async([au, be, bu, cr, cy, cz, dk, et, fi, fr, de, gr, hu, ie, it, la, li, lu, ma, nl, po,
pt, ro, sv, sk, es, sw, uk]) => {

    const austria = await au.json()
    const belgium = await be.json()
    const bulgaria = await bu.json()
    const croatia = await cr.json()
    const cyprus = await cy.json()
    const czech = await cz.json()
    const denmark = await dk.json()
    const estonia = await et.json()
    const finland = await fi.json()
    const france = await fr.json()
    const germany = await de.json()
    const greece = await gr.json()
    const hungary = await hu.json()
    const ireland = await ie.json()
    const italy = await it.json()
    const latvia = await la.json()
    const lithuania = await li.json()
    const malta = await ma.json()
    const netherlands = await nl.json()
    const poland = await po.json()
    const portugal = await pt.json()
    const romania = await ro.json()
    const slovakia = await sv.json()
    const slovenia = await sk.json()
    const spain = await es.json()
    const sweden = await sw.json()
    const unitedKingdom = await uk.json()

    console.log('ie', ie)


    // const ireland = await ie.json();
    // const spain = await es.json();
    // const belgium = await be.json();
    // const unitedKingdom = await uk.json();
    let t1 = performance.now()

    console.log("API calls took " + (t1 - t0) + " milliseconds.")

    // console.log('ireland', ireland[ireland.length-1].Confirmed)
    // console.log('spain', spain[spain.length-1].Confirmed)
    // console.log('belgium', belgium[belgium.length-1].Confirmed)
    // console.log('unitedKingdom', unitedKingdom)
  })
  .catch((err) => {
    console.log(err);
  });
  
