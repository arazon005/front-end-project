'use strict';
/* eslint-disable @typescript-eslint/no-unused-vars */
const $main = document.querySelector('div');
if (!$main) throw new Error('$main query failed');
let $favElements;
let $ownElements;
let $editElements;
setTimeout(() => {
  console.log(operators[0].own);
  operators[0].level = 50;
  createGrid();
  $favElements = document.querySelectorAll('.favorite');
  $ownElements = document.querySelectorAll('.own');
  $editElements = document.querySelectorAll('.edit');
  const $gridElements = document.querySelectorAll('.grid-container');
  if (!$gridElements) throw new Error('$gridElements query failed');
  for (let i = 0; i < $gridElements.length; i++) {
    $gridElements[i].addEventListener('click', (event) => {
      const $eventTarget = event.target;
      console.log($gridElements[i].id);
      console.log($eventTarget.textContent);
      console.log($gridElements[i].className.length);
      if ($eventTarget.textContent === 'own') {
        if (operators[i].own === false) {
          $gridElements[i].className = 'grid-container';
          operators[i].own = true;
        } else {
          $gridElements[i].className = 'grid-container unowned';
          operators[i].own = false;
        }
        writeOperators();
      }
      if (
        $eventTarget.textContent === 'favorite' &&
        $gridElements[i].className !== 'grid-container unowned'
      ) {
        if (operators[i].favorite === true) {
          $gridElements[i].className = 'grid-container';
          operators[i].favorite = false;
        } else {
          $gridElements[i].className = 'grid-container favorite';
          operators[i].favorite = true;
        }
        writeOperators();
      }
    });
  }
}, 2000);
function createGrid() {
  for (let i = 0; i < operators.length; i++) {
    if (operators[i].art[0]) {
      const $gridContainer = document.createElement('div');
      $gridContainer.className = 'grid-container';
      if (!operators[i].own) {
        $gridContainer.className += ' unowned';
      } else if (operators[i].own && operators[i].favorite) {
        $gridContainer.className += ' favorite';
      }
      $gridContainer.id = String(i);
      const $containerImage = document.createElement('div');
      $containerImage.className = 'container-image';
      const $imgElement = document.createElement('img');
      $imgElement.src = operators[i].art[0].link;
      $containerImage.appendChild($imgElement);
      $gridContainer.appendChild($containerImage);
      const $charInfo = document.createElement('div');
      $charInfo.className = 'char-info';
      const $hoverElement = document.createElement('span');
      $hoverElement.className = 'name';
      const $charName = document.createElement('span');
      $charName.textContent = `${operators[i].name}`;
      const $hoverButtons = document.createElement('span');
      $hoverButtons.className = 'hover-buttons';
      const $favButton = document.createElement('a');
      $favButton.textContent = 'favorite';
      $favButton.className = 'fav-button';
      $hoverButtons.append($favButton);
      const $ownButton = document.createElement('a');
      $ownButton.textContent = 'own';
      $ownButton.className = 'own';
      $hoverButtons.append($ownButton);
      const $editButton = document.createElement('a');
      $editButton.textContent = 'edit';
      $editButton.className = 'edit';
      $hoverButtons.append($editButton);
      $hoverElement.append($hoverButtons);
      $hoverElement.append($charName);
      $charInfo.appendChild($hoverElement);
      const $potential = document.createElement('img');
      $potential.className = 'container-pot';
      $charInfo.appendChild($potential);
      const $promotion = document.createElement('img');
      $promotion.className = 'promotion';
      $promotion.src =
        'https://ak.gamepress.gg/sites/default/files/2019-10/0.png';
      $charInfo.appendChild($promotion);
      const $level = document.createElement('span');
      $level.textContent = `Level: ${operators[i].level}`;
      $charInfo.appendChild($level);
      $gridContainer.appendChild($charInfo);
      $main?.appendChild($gridContainer);
    }
  }
}
