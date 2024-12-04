'use strict';
/* eslint-disable @typescript-eslint/no-unused-vars */
const $main = document.querySelector('div');
if (!$main) throw new Error('$main query failed');
const $modal = document.querySelector('dialog');
if (!$modal) throw new Error('$modal query failed');
const $exitModal = document.querySelector('.exit-modal');
if (!$exitModal) throw new Error('$exitModal query failed');
const $hp = document.querySelector('.hp');
const $atk = document.querySelector('.atk');
const $def = document.querySelector('.def');
const $level = document.querySelector('.level');
const $modalPot = document.querySelector('.modal-pot');
const $modalImage = document.querySelector('.modal-image');
const $modalName = document.querySelector('.modal-name');
const $classIcon = document.querySelector('.class-icon');
const $skills = document.querySelectorAll('.skill-level');
const $s1Name = document.querySelector('.s1-name');
const $s2Name = document.querySelector('.s2-name');
const $s3Name = document.querySelector('.s3-name');
const $description = document.querySelector('.description');
if (!$hp) throw new Error('$hp query failed');
if (!$atk) throw new Error('$atk query failed');
if (!$def) throw new Error('$def query failed');
if (!$level) throw new Error('$level query failed');
if (!$modalImage) throw new Error('$modalImage query failed');
if (!$skills) throw new Error('$skills query failed');
if (!$s1Name) throw new Error('$s1Name query failed');
if (!$s2Name) throw new Error('$s2Name query failed');
if (!$s3Name) throw new Error('$s3Name query failed');
if (!$description) throw new Error('$description query failed');
let $favElements;
let $ownElements;
let $editElements;
setTimeout(() => {
  console.log(operators);
  console.log(operators[9]);
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
      if ($eventTarget.classList.contains('edit')) {
        current = i;
        editModal(i);
        $modal.showModal();
      }
    });
  }
  $modal.addEventListener('click', (event) => {
    const $eventTarget = event.target;
    if ($eventTarget.className === 'exit-modal') {
      $modal.close();
      updateGrid(current);
    }
    if (
      $eventTarget.className === 'level-up' &&
      operators[current].level < levelCap(operators[current].promotion)
    ) {
      operators[current].level++;
    }
    if (
      $eventTarget.className === 'level-down' &&
      operators[current].level > 1
    ) {
      operators[current].level--;
    }
    if ($eventTarget.className === 'modal-pot') {
      if (operators[current].pot === 6) {
        operators[current].pot = 0;
      }
      operators[current].pot++;
    }
    if ($eventTarget.className === 's-up') {
      const skill = Number(
        $eventTarget.parentElement?.parentElement?.className,
      );
      if (operators[current].skills[skill].level < 7) {
        for (let i = 0; i < operators[current].skills.length; i++) {
          operators[current].skills[i].level++;
        }
      } else if (operators[current].skills[skill].level < 10) {
        operators[current].skills[skill].level++;
      }
    }
    if ($eventTarget.className === 's-down') {
      const skill = Number(
        $eventTarget.parentElement?.parentElement?.className,
      );
      if (
        operators[current].skills[skill].level > 1 &&
        operators[current].skills[skill].level <= 7 &&
        checkSkills(current)
      ) {
        for (let i = 0; i < operators[current].skills.length; i++) {
          operators[current].skills[i].level--;
        }
      } else if (operators[current].skills[skill].level > 7) {
        operators[current].skills[skill].level--;
      }
    }
    editModal(current);
    writeOperators();
  });
  $modal.addEventListener('mouseover', (event) => {
    const $eventTarget = event.target;
    if ($eventTarget.classList.contains('skill')) {
      const skillPointer = Number($eventTarget.parentElement?.className);
      const skillLevel = operators[current].skills[skillPointer].level;
      $description.textContent =
        operators[current].skills[skillPointer].variations[
          skillLevel - 1
        ].description;
    } else {
      $description.textContent = '';
    }
  });
  console.log(Object.values(operators[9].statistics)[0]);
}, 2000);
function editModal(i) {
  $level.textContent = String(operators[i].level);
  $atk.textContent = 'Atk: ' + String(calculateAtk(i));
  $def.textContent = 'Def: ' + String(calculateDef(i));
  $hp.textContent = 'HP: ' + String(calculateHp(i));
  $modalPot.src = `images/pot${operators[i].pot}.webp`;
  $modalImage.src = operators[i].art[operators[i].artPointer].link;
  $modalName.textContent = operators[i].name;
  for (let s = 0; s < $skills.length; s++) {
    $skills[s].setAttribute(
      'src',
      `images/${operators[current].skills[s].level}.webp`,
    );
  }
  $s1Name.textContent = operators[i].skills[0].name;
  $s2Name.textContent = operators[i].skills[1].name;
  $s3Name.textContent = operators[i].skills[2].name;
}
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
      if (operators[i].pot !== 1) {
        $potential.src = 'images/pot' + operators[i].pot + '.webp';
      }
      $charInfo.appendChild($potential);
      const $promotion = document.createElement('img');
      $promotion.className = 'promotion';
      $promotion.src = `images/e${operators[i].promotion}.webp`;
      $charInfo.appendChild($promotion);
      const $level = document.createElement('span');
      $level.textContent = `Level: ${operators[i].level}`;
      $charInfo.appendChild($level);
      $gridContainer.appendChild($charInfo);
      $main?.appendChild($gridContainer);
    }
  }
}
function updateGrid(id) {
  const $updateTarget = document.getElementById(String(id));
  if (!$updateTarget) throw new Error('$updateTarget query failed');
  while ($updateTarget.firstChild) {
    $updateTarget.removeChild($updateTarget.firstChild);
  }
  if (!operators[id].own) {
    $updateTarget.className += ' unowned';
  } else if (operators[id].own && operators[id].favorite) {
    $updateTarget.className += ' favorite';
  }
  const $containerImage = document.createElement('div');
  $containerImage.className = 'container-image';
  const $imgElement = document.createElement('img');
  $imgElement.src = operators[id].art[operators[id].artPointer].link;
  $containerImage.appendChild($imgElement);
  $updateTarget.appendChild($containerImage);
  const $charInfo = document.createElement('div');
  $charInfo.className = 'char-info';
  const $hoverElement = document.createElement('span');
  $hoverElement.className = 'name';
  const $charName = document.createElement('span');
  $charName.textContent = `${operators[id].name}`;
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
  if (operators[id].pot !== 1) {
    $potential.src = 'images/pot' + operators[id].pot + '.webp';
  }
  $charInfo.appendChild($potential);
  const $promotion = document.createElement('img');
  $promotion.className = 'promotion';
  $promotion.src = `images/e${operators[id].promotion}.webp`;
  $charInfo.appendChild($promotion);
  const $level = document.createElement('span');
  $level.textContent = `Level: ${operators[id].level}`;
  $charInfo.appendChild($level);
  $updateTarget.appendChild($charInfo);
}
function levelCap(p) {
  if (p === 0) {
    return 50;
  } else if (p === 1) {
    return 80;
  } else {
    return 90;
  }
}
function calculateHp(i) {
  const promotion = operators[i].promotion;
  const reference = Object.values(operators[i].statistics);
  const base = Number(reference[promotion].hp);
  const cap = Number(reference[promotion + 1].hp);
  const interval = (cap - base) / (levelCap(promotion) - 1);
  const hp = Math.round(base + interval * (operators[i].level - 1));
  return hp;
}
function calculateAtk(i) {
  const promotion = operators[i].promotion;
  const reference = Object.values(operators[i].statistics);
  const base = Number(reference[promotion].atk);
  const cap = Number(reference[promotion + 1].atk);
  const interval = (cap - base) / (levelCap(promotion) - 1);
  const atk = Math.round(base + interval * (operators[i].level - 1));
  return atk;
}
function calculateDef(i) {
  const promotion = operators[i].promotion;
  const reference = Object.values(operators[i].statistics);
  const base = Number(reference[promotion].def);
  const cap = Number(reference[promotion + 1].def);
  const interval = (cap - base) / (levelCap(promotion) - 1);
  const def = Math.round(base + interval * (operators[i].level - 1));
  return def;
}
function checkSkills(id) {
  for (let i = 0; i < operators[id].skills.length - 1; i++) {
    if (operators[id].skills[i].level !== operators[id].skills[i + 1].level) {
      return false;
    }
  }
  return true;
}
