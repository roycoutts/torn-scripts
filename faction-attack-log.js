const http = require('http');
const https = require('https');

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

const getJSON = (options, onResult) => {
  
  const port = options.port == 443 ? https : http;

  let output = '';

  const req = port.request(options, (res) => {
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      output += chunk;
    });

    res.on('end', () => {
      let obj = JSON.parse(output);

      onResult(res.statusCode, obj);
    });
  });

  req.on('error', (err) => {
    // res.send('error: ' + err.message);
  });

  req.end();
};

const optionsFactionAttacksFull = {
  host: 'api.torn.com',
  port: 443,
  path: '/faction/?selections=attacksfull&key=' + process.argv[2],
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const optionsFactionMembers = {
  host: 'api.torn.com',
  port: 443,
  path: '/faction/?selections=basic&key=' + process.argv[2],
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

getJSON(optionsFactionAttacksFull, (statusCode, result) => {
  getJSON(optionsFactionMembers, (statusCode2, result2) => {

    const members = result2.members;
    // I could work with the resulting HTML/JSON here. I could also just return it
    //  result;

    const start = Math.floor(new Date('2020-02-01').getTime() / 1000);
    const end = Math.floor(new Date('2020-02-08').getTime() / 1000);

    const attacks = [];
    for (var key in result.attacks) {
      // skip loop if the property is from prototype
      if (!result.attacks.hasOwnProperty(key)) continue;

      const attack = result.attacks[key];

      // your code
      // timestamp_started
      // timestamp_ended
      // attacker_id
      // attacker_faction
      // defender_id
      // defender_faction
      // result
      // stealthed
      // respect_gain
      if (
        attack.attacker_faction == process.argv[3]
        && attack.result != "Lost"
        && attack.result != "Timeout"
        && attack.result != "Stalemate"
        && attack.result != "Assist"
        && attack.result != "Escape"
        && attack.timestamp_ended >= start
        && attack.timestamp_ended <= end
      ) {
        attacks.push(attack);
      }
    }

    console.log('Total Attacks: ' + attacks.length);

    const players = [];

    attacks.forEach(attack => {
      if (players.includes(attack.attacker_id) === false) {
        players.push(attack.attacker_id);
      }
    });
    console.log('Total Players: ' + players.length);

    const output = [];
    players.forEach(p => {


      let respect = 0;
      attacks.filter(attack => attack.attacker_id === p).forEach(a => {
        respect += +(a.respect_gain);
      })

      output.push({
        id: p,
        respect: respect,
        total: attacks.filter(attack => attack.attacker_id === p).length
      });
    });

    /*
    attacks.forEach(attack => {
      console.log(attack.attacker_id);
      if(output.some(o => o.id == attack.attacker_id)){
        output.push({
          id: attack.attacker_id,
          // total: attacks.filter(x => x.attacker_id === attack.attacker_id).length
        });
      }
    });
    */

    // console.log(output.length);
    output.sort((a, b) => { return b.total - a.total });

    console.log('--------');
    output.forEach(o => {
      console.log(`${o.total} - ${members[o.id.toString()].name} - ${o.respect}`);
    });

  });
});

