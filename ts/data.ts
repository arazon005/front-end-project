/* exported data */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let operators: any[] = [];

async function getOperatorData(): Promise<void> {
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
    const operatorData = data;
    for (let i = 0; i < operatorData.length / 2; i++) {
      operators[i] = operatorData[i];
      operators[i].favorite = false;
      operators[i].own = false;
      operators[i].level = 1;
      operators[i].promotion = 0;
      operators[i].pot = 1;
    }
    writeOperators();
    console.log(operators[0]);
    console.log(d2);
  } catch (error) {
    console.error('Error:', error);
  }
}

function writeOperators(): void {
  const operatorsJSON = JSON.stringify(operators);
  localStorage.setItem('operators', operatorsJSON);
}
if (!localStorage.getItem('operators')) {
  getOperatorData();
} else {
  operators = JSON.parse(localStorage.getItem('operators') as string);
}
