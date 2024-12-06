/* exported data */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let operators: any[] = [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
let current: number = 0;

async function getOperatorData(): Promise<void> {
  try {
    const response = await fetch(
      'https://api.rhodesapi.com/api/search?rarity=6',
    );

    if (!response.ok) {
      throw new Error(`HTTP error: Status: ${response.status}`);
    }

    const data = await response.json();
    const operatorData = data;
    for (let i = 0; i < operatorData.length; i++) {
      operators[i] = operatorData[i];
      operators[i].favorite = false;
      operators[i].own = false;
      operators[i].level = 1;
      operators[i].promotion = 0;
      operators[i].pot = 1;
      operators[i].artPointer = 0;
      if (operators[i].skills.length > 0) {
        for (let s = 0; s < operators[i].skills.length; s++) {
          operators[i].skills[s].level = 1;
        }
      }
      if (operators[i].module.length > 1) {
        for (let m = 0; m < operators[i].module.length; m++) {
          operators[i].module[m].level = 0;
        }
      }
    }
    writeOperators();
    console.log(operators[0]);
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
