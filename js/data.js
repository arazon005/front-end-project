'use strict';
/* exported data */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let index = [];
async function getOperatorData() {
  try {
    const response = await fetch('https://api.rhodesapi.com/api/operator');
    const r2 = await fetch('https://api.rhodesapi.com/api/search?rarity=1');
    if (!response.ok) {
      throw new Error(`HTTP error: Status: ${response.status}`);
    }
    if (!r2.ok) {
      throw new Error();
    }
    const data = await response.json();
    const d2 = await r2.json();
    index = data;
    console.log(data[0]);
    console.log(d2);
  } catch (error) {
    console.error('Error:', error);
  }
}
getOperatorData();
