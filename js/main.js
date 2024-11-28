'use strict';
const $main = document.querySelector('div');
if (!$main) throw new Error('$main query failed');
setTimeout(() => {
  console.log(index.length);
  console.log(fetch('https://api.rhodesapi.com/api/search?rarity=0'));
  for (let i = 0; i < index.length; i++) {
    console.log(i);
    const $gridContainer = document.createElement('div');
    $gridContainer.className = 'grid-container unowned';
    const $containerImage = document.createElement('div');
    $containerImage.className = 'container-image';
    const $imgElement = document.createElement('img');
    $imgElement.src = index[i].art[0].link;
    $containerImage.appendChild($imgElement);
    $gridContainer.appendChild($containerImage);
    const $charInfo = document.createElement('div');
    $charInfo.className = 'char-info';
    const $potential = document.createElement('img');
    $potential.className = 'container-pot';
    $charInfo.appendChild($potential);
    const $promotion = document.createElement('img');
    $promotion.className = 'promotion';
    $promotion.src =
      'https://ak.gamepress.gg/sites/default/files/2019-10/0.png';
    $charInfo.appendChild($promotion);
    const $level = document.createElement('span');
    $level.textContent = 'Level: 1';
    $charInfo.appendChild($level);
    $gridContainer.appendChild($charInfo);
    $main.appendChild($gridContainer);
  }
}, 2000);
