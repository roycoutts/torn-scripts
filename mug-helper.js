(function () {
  let API_KEY = '';
  let MUG_MERITS = 0;

  const MugHelper = {
    init: function (key, merits) {
      API_KEY = key;
      MUG_MERITS = merits;
    },
    mug: async function (area) {
      let url = `https://api.torn.com/market/283?selections=&key=${API_KEY}`;
      let response = await fetch(url);
      let json = await response.json();
      const dps = json.bazaar;
      console.log(JSON.stringify(dps));

      url = `https://api.torn.com/torn/283?selections=items&key=${API_KEY}`;
      response = await fetch(url);
      json = await response.json();
      const dp = json.items['283']
      console.log(dp.sell_price);

      display(area, dps, dp.sell_price);
    }
  }

  function display(area, dps, dpPrice) {
    const modifier = (1 + (MUG_MERITS * .05));
    const modifierMin = (0.05 * modifier).toFixed(3);
    const modifierMax = (0.10 * modifier).toFixed(3);
    dps.forEach(dp => {
      const total = dp.quantity * dp.cost;
      const totalDisplay = '$' + numberWithCommas(total);

      const minMug = (total * modifierMin).toFixed(0);
      const minMugFormatted = '$' + numberWithCommas(minMug);

      const maxMug = (total * modifierMax).toFixed(0);
      const maxMugFormatted = '$' + numberWithCommas(maxMug);

      
      const loss = (dp.cost - dpPrice);
      area.innerHTML += `<div>${totalDisplay} - ${minMugFormatted}(${minMug - loss}) - ${maxMugFormatted}(${maxMug - loss}) </div>`
    })
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  window.MugHelper = MugHelper;
})();