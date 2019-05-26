// ==UserScript==
// @name         Torn - Advanced Search Plus 
// @namespace    CoolBoiIndustries
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/userlist.php*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  setTimeout(function () {
    const results = document.querySelectorAll('ul.user-info-list-wrap>li')

    for (const result of results) {
      const players = result.querySelectorAll('ul#iconTray');

      for (const player of players) {
        const factionMemeber = player.querySelector('li#icon9');
        const factionLeaderCoLeader = player.querySelector('li#icon74');
        const donator = player.querySelector('li#icon3');
        const subscriber = player.querySelector('li#icon4');

        if (factionMemeber !== null || factionLeaderCoLeader !== null) {
          result.setAttribute('style', 'display:none;')
        }
      }
    }

  }, 1000);
})();

