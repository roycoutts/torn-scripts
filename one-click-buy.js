// ==UserScript==
// @name         Torn - Item market quick buy
// @namespace    CoolBoiIndustries
// @version      0.1
// @description  one click buy™
// @author       You
// @match        https://www.torn.com/imarket.php
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  setTimeout(function () {
    // https://www.torn.com/imarket.php
    // step=buyItemConfirm&ID=%%ID_GOES_HERE%%&item=0
    const html = `
    <style>
    .itemMarketQuickBuyWrapper{
      position:fixed;
      top:0;
      z-index: 1500000;
      padding: 10px;
      width: 50%;
      width: 23%;
      background: #ccc url(/images/v2/main/bg_regular.jpg) left top repeat;
    }
    .itemMarketQuickBuyHeader{
      width: 100%;
      text-align: center;
      font-size: 18px;
    }
    .itemMarketQuickBuyButton{
      padding: 10px;
      width: 20%;
    }
    </style>
    <div class="itemMarketQuickBuyWrapper">
    <div class="itemMarketQuickBuyHeader">
    <div>One Click Buy™</div>
    </div>
    <br/>
    <div id="itemMarketQuickBuyOutput"></div>
    
        </div>`;

    const sidebar = document.createElement('div');
    sidebar.innerHTML = html;
    sidebar.setAttribute('id', 'itemMarketQuickBuyContainer');
    document.body.appendChild(sidebar);

    init();

  }, 1000);
})();

function init() {
  const area = document.getElementById('itemMarketQuickBuyOutput');
  const items = document.getElementsByClassName('buy-link');

  const itemIds = [];
  for (const item of items) {
    const id = item.getAttribute('data-id');
    itemIds.push(id);
  }

  itemIds.forEach(id => {
    const buttonId = 'itemMarketQuickBuyOutputBtn' + id;
    area.innerHTML += `<button class="itemMarketQuickBuyButton" id="${buttonId}">${id}</button>`;
  });

  itemIds.forEach(id => {
    const buttonId = 'itemMarketQuickBuyOutputBtn' + id;
    document.getElementById(buttonId).addEventListener('click', function () {
      const url = "https://www.torn.com/imarket.php";
      const formData = 'step=buyItemConfirm&ID=' + id + '&item=0'
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, false);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            // mark complete
            document.getElementById(buttonId).style = 'display:none;'
            const index = itemIds.indexOf(id);
            if (index > -1) {
              itemIds.splice(index, 1);
            }

            if (itemIds.length === 0) {
              window.location.reload();
            }
          } else {
            alert('error');
          }
        }
      }
      xhr.send(formData);
    });
  });

}
