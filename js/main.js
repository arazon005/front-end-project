'use strict';
/* eslint-disable @typescript-eslint/no-unused-vars */
const $grid = document.querySelector('.grid');
if (!$grid) throw new Error('$grid query failed');
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
const $promotionButtons = document.querySelectorAll('.promotion-selector');
const $description = document.querySelector('.description');
const $mobileDescription = document.querySelector('.mobile');
const $artSelector = document.querySelector('.art-selector');
if (!$hp) throw new Error('$hp query failed');
if (!$atk) throw new Error('$atk query failed');
if (!$def) throw new Error('$def query failed');
if (!$level) throw new Error('$level query failed');
if (!$modalImage) throw new Error('$modalImage query failed');
if (!$skills) throw new Error('$skills query failed');
if (!$s1Name) throw new Error('$s1Name query failed');
if (!$s2Name) throw new Error('$s2Name query failed');
if (!$s3Name) throw new Error('$s3Name query failed');
if (!$promotionButtons) throw new Error('$promotionButtons query failed');
if (!$description) throw new Error('$description query failed');
if (!$artSelector) throw new Error('$artSelector query failed');
if (!$mobileDescription) throw new Error('$mobileDescription query failed');
const $searchBar = document.querySelector('#search');
const $filters = document.querySelector('#filters');
if (!$searchBar) throw new Error('$searchBar query failed');
if (!$filters) throw new Error('$filters query failed');
let $favElements;
let $ownElements;
let $editElements;
setTimeout(() => {
  createGrid();
  $favElements = document.querySelectorAll('.favorite');
  $ownElements = document.querySelectorAll('.own');
  $editElements = document.querySelectorAll('.edit');
  const $gridElements = document.querySelectorAll('.grid-container');
  if (!$gridElements) throw new Error('$gridElements query failed');
  for (let i = 0; i < $gridElements.length; i++) {
    $gridElements[i].addEventListener('click', (event) => {
      const $eventTarget = event.target;
      if ($eventTarget.textContent === 'own') {
        if (operators[i].own === false) {
          $gridElements[i].classList.remove('unowned');
          operators[i].own = true;
        } else {
          $gridElements[i].classList.add('unowned');
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
        $artSelector.textContent = '';
        for (let a = 0; a < operators[i].art.length; a++) {
          const $artButton = document.createElement('button');
          $artButton.setAttribute('type', 'button');
          $artButton.className = 'art-button ' + String(a);
          $artSelector.appendChild($artButton);
        }
        editModal(i);
        $modal.showModal();
      }
    });
  }
  $modal.addEventListener('click', (event) => {
    const $eventTarget = event.target;
    if ($eventTarget.className === 'exit-modal') {
      $mobileDescription.textContent = '';
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
        $eventTarget.parentElement?.parentElement?.classList[1],
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
        $eventTarget.parentElement?.parentElement?.classList[1],
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
    if ($eventTarget.classList.contains('promotion-selector')) {
      operators[current].promotion = Number($eventTarget.classList[1]);
      operators[current].artPointer = Number($eventTarget.classList[1]);
      operators[current].level = 1;
    }
    if ($eventTarget.classList.contains('art-button')) {
      operators[current].artPointer = Number($eventTarget.classList[1]);
    }
    editModal(current);
    writeOperators();
  });
  $modal.addEventListener('mouseover', (event) => {
    const $eventTarget = event.target;
    if ($eventTarget.classList.contains('skill')) {
      const skillPointer = Number($eventTarget.parentElement?.classList[1]);
      const skillLevel = operators[current].skills[skillPointer].level;
      $mobileDescription.textContent = '';
      const initialSp =
        'Initial SP: ' +
        operators[current].skills[skillPointer].variations[skillLevel - 1]
          .initial_sp;
      const $initialSp = document.createElement('p');
      $initialSp.textContent = initialSp;
      $mobileDescription.appendChild($initialSp);
      const spCost =
        'SP Cost: ' +
        operators[current].skills[skillPointer].variations[skillLevel - 1]
          .sp_cost;
      const $spCost = document.createElement('p');
      $spCost.textContent = spCost;
      $mobileDescription.appendChild($spCost);
      const duration =
        'Duration: ' +
        operators[current].skills[skillPointer].variations[skillLevel - 1]
          .duration;
      const $duration = document.createElement('p');
      $duration.textContent = duration;
      $mobileDescription.appendChild($duration);
      const $skillDescription = document.createElement('p');
      $skillDescription.textContent =
        operators[current].skills[skillPointer].variations[
          skillLevel - 1
        ].description;
      $mobileDescription.appendChild($skillDescription);
    } else {
      $description.textContent = '';
    }
  });
  $modal.addEventListener('mouseover', (event) => {
    const $eventTarget = event.target;
    if ($eventTarget.classList.contains('skill')) {
      const skillPointer = Number($eventTarget.parentElement?.classList[1]);
      const skillLevel = operators[current].skills[skillPointer].level;
      const initialSp =
        'Initial SP: ' +
        operators[current].skills[skillPointer].variations[skillLevel - 1]
          .initial_sp;
      const $initialSp = document.createElement('p');
      $initialSp.textContent = initialSp;
      $description.appendChild($initialSp);
      const spCost =
        'SP Cost: ' +
        operators[current].skills[skillPointer].variations[skillLevel - 1]
          .sp_cost;
      const $spCost = document.createElement('p');
      $spCost.textContent = spCost;
      $description.appendChild($spCost);
      const duration =
        'Duration: ' +
        operators[current].skills[skillPointer].variations[skillLevel - 1]
          .duration;
      const $duration = document.createElement('p');
      $duration.textContent = duration;
      $description.appendChild($duration);
      const $skillDescription = document.createElement('p');
      $skillDescription.textContent =
        operators[current].skills[skillPointer].variations[
          skillLevel - 1
        ].description;
      $description.appendChild($skillDescription);
    } else {
      $description.textContent = '';
    }
  });
  $searchBar.addEventListener('input', (event) => {
    const $eventTarget = event.target;
    for (let i = 0; i < operators.length; i++) {
      if (
        operators[i].name.slice(0, $eventTarget.value.length).toLowerCase() ===
        $eventTarget.value.toLowerCase()
      ) {
        $gridElements[i].classList.remove('name-filter');
      } else {
        $gridElements[i].classList.add('name-filter');
      }
    }
  });
  $filters.addEventListener('click', (event) => {
    const $eventTarget = event.target;
    if ($eventTarget.className === 'filtered') {
      $eventTarget.className = '';
      $filters.classList.remove($eventTarget.id);
    } else {
      $eventTarget.className = 'filtered';
      $filters.classList.add($eventTarget.id);
    }
    for (let i = 0; i < operators.length; i++) {
      if (
        $filters.classList.contains(operators[i].class[0].toLowerCase()) ||
        $filters.classList.length === 0
      ) {
        $gridElements[i].classList.remove('class-filter');
      } else {
        $gridElements[i].classList.add('class-filter');
      }
    }
  });
}, 2500);
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
  for (let l = 0; l < $promotionButtons.length; l++) {
    if (l === operators[i].promotion) {
      $promotionButtons[l].classList.add('selected');
    } else {
      $promotionButtons[l].classList.remove('selected');
    }
  }
  if (operators[current].artPointer > 1) {
    $modalImage.parentElement?.classList.add('big');
  } else {
    $modalImage.parentElement?.classList.remove('big');
  }
}
function createGrid() {
  for (let i = 0; i < operators.length; i++) {
    if (operators[i].art[0]) {
      const $gridContainer = document.createElement('div');
      $gridContainer.className = 'grid-container';
      if (!operators[i].own) {
        $gridContainer.classList.add('unowned');
      } else if (operators[i].own && operators[i].favorite) {
        $gridContainer.classList.add('favorite');
      }
      $gridContainer.id = String(i);
      const $containerImage = document.createElement('div');
      $containerImage.className = 'container-image';
      const $imgElement = document.createElement('img');
      $imgElement.src = operators[i].art[operators[i].artPointer].link;
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
      $level.className = 'grid-level';
      $level.textContent = `Level: ${operators[i].level}`;
      $charInfo.appendChild($level);
      $gridContainer.appendChild($charInfo);
      $grid?.appendChild($gridContainer);
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
  $level.className = 'grid-level';
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
