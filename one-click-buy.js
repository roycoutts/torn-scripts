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
      width: calc((64px * 5));
      background: #ccc url(/images/v2/main/bg_regular.jpg) left top repeat;
    }
    .itemMarketQuickBuyHeader{
      width: 100%;
      text-align: center;
      font-size: 18px;
    }
    .itemMarketQuickBuyButton{
      padding: 10px;
      background: white;
      border: 2px solid #ccc;
      line-height: 20px;
      height: 60px;
      font-size: 14px;
      width: 60px;
      overflow: hidden;
      cursor: pointer;
      margin: 2px;
    }

    .itemMarketQuickBuyButton:hover{
      background: #cfcfcf;
      border: 2px solid white;
    }
    

    .spin {
      border:4px solid #f3f3f3;
      border-radius: 50%;
      border-top: 4px solid #cfcfcf;
      width: 20px;
      height: 20px;
      margin-left: 5px;

      -webkit-animation:spin 2s linear infinite;
      -moz-animation:spin 2s linear infinite;
      animation:spin 2s linear infinite;
  }

  .spin:hover{
    cursor: default;
  }
    @-moz-keyframes spin { 
      100% { 
        -moz-transform: rotate(360deg);
       }
    }
    @-webkit-keyframes spin { 
      100% { 
        -webkit-transform: rotate(360deg);
       } 
    }
    @keyframes spin {
       100% { 
         -webkit-transform: rotate(360deg); 
         transform:rotate(360deg);
         } 
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
  const itemNodes = document.getElementsByClassName('buy-link');

  const items = [];
  for (const item of itemNodes) {
    const id = item.getAttribute('data-id');
    
    // cost
    const costContainer = item.parentNode.parentNode.querySelector('li.cost');
    const cost = costContainer.innerHTML.replace('<span class="t-show bold">Price:</span>', '').trim();
    console.log(cost);
    
    items.push({
      id: id,
      cost: cost
    });
  }

  items.forEach(item => {
    const buttonId = 'itemMarketQuickBuyOutputBtn' + item.id;
    area.innerHTML += `<button class="itemMarketQuickBuyButton" id="${buttonId}">${item.cost}</button>`;
  });

  items.forEach(item => {
    const buttonId = 'itemMarketQuickBuyOutputBtn' + item.id;
    const button = document.getElementById(buttonId);
    button.addEventListener('click', function(button) {
      buy(item.id);
    });
  });

  function buy (id) {
    // remove event listener
    const buttonId = 'itemMarketQuickBuyOutputBtn' + id;
    let button = document.getElementById(buttonId);
    const buttonClone = button.cloneNode(true);
    button.parentNode.replaceChild(buttonClone, button);
    button = buttonClone;

    console.log('click');
    button.innerHTML = '<div class="spin"></div>';
    const url = "https://www.torn.com/imarket.php";
    const formData = 'step=buyItemConfirm&ID=' + id + '&item=0'
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
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
    // xhr.send(formData);
  }

}
