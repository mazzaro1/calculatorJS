const previousOperationText = document.querySelector("#previous-operation");
const currentOperationText = document.querySelector("#current-operation");
const buttons = document.querySelectorAll("#buttons-container button");
const btnToggleSounds = document.querySelector("#toggle-sounds");

class Calculator {
  constructor(previousOperationText, currentOperationText) {
    this.previousOperationText = previousOperationText;
    this.currentOperationText = currentOperationText;
    this.currentDigit = ""; 
  }

  // Adiciona um dígito ou ponto
  addDigit(digit) {
    //valida se já possui ponto
    if (digit === "." && this.currentOperationText.innerText.includes("."))
       return;
    this.currentDigit = digit;
    this.updateScreen();
  }

  // verifica o tipo de operação e converte a string pra numero
  processOperation(operation) {
    if (this.currentOperationText.innerText === "" && operation !== "C") {
      if (this.previousOperationText.innerText !== "") {
        this.changeOperation(operation);
      }
      return;
    }

    let previous = +this.previousOperationText.innerText.split(" ")[0];
    let current = +this.currentOperationText.innerText;

    const specialOperations = ["DEL", "CE", "C"]; 
    //valida se é um numero
    if ((isNaN(previous) || isNaN(current)) && !specialOperations.includes(operation)) return;

    let operationResult;

    switch (operation) {
      case "+":
        operationResult = previous + current;
        break;
      case "-":
        operationResult = previous - current;
        break;
      case "*":
        operationResult = previous * current;
        break;
      case "/":
        operationResult = previous / current;
        break;
      case "DEL":
        this.processDelOperator();
        return;
      case "CE":
        this.processClearCurrentOperator();
        return;
      case "C":
        this.processClearOperator();
        return;
      case "=":
        this.processEqualOperator();
        return;
      default:
        return;
    }

    this.updateScreen(operationResult, operation, current, previous);
  }

  // Atualiza a tela da calculadora
  updateScreen(operationResult = null, operation = null, current = null, previous = null) {
    if (operationResult === null) {
      this.currentOperationText.innerText += this.currentDigit;
    } else {
      if (previous === 0) {
        operationResult = current;
      }
      this.previousOperationText.innerText = `${operationResult} ${operation}`;
      this.currentOperationText.innerText = "";
    }
  }

  // Troca o operador 
  changeOperation(operation) {
    const mathOperations = ["*", "-", "+", "/"];
    if (!mathOperations.includes(operation)) return;

    this.previousOperationText.innerText =
      this.previousOperationText.innerText.slice(0, -1) + operation;
  }

  // Apaga o ultimo digito
  processDelOperator() {
    this.currentOperationText.innerText =
      this.currentOperationText.innerText.slice(0, -1);
  }

  // Limpa o numero atual 
  processClearCurrentOperator() {
    this.currentOperationText.innerText = "";
  }

  // Limpa tudo 
  processClearOperator() {
    this.currentOperationText.innerText = "";
    this.previousOperationText.innerText = "";
  }

  // Executa a operação anterior novamente
  processEqualOperator() {
    let operation = this.previousOperationText.innerText.split(" ")[1];
    this.processOperation(operation);
  }
}


const normalSounds = [
  'sounds/click1.mp3',
  'sounds/click2.mp3',
  'sounds/click3.mp3',
  'sounds/click4.mp3',
];

const coolSounds = [
  'sounds/teclado1.mp3', 'sounds/teclado2.mp3', 'sounds/teclado3.mp3', 'sounds/teclado4.mp3',
  'sounds/teclado5.mp3', 'sounds/teclado6.mp3', 'sounds/teclado7.mp3', 'sounds/teclado8.mp3',
  'sounds/teclado9.mp3', 'sounds/teclado10.mp3', 'sounds/teclado11.mp3', 'sounds/teclado12.mp3',
  'sounds/teclado13.mp3', 'sounds/teclado14.mp3', 'sounds/teclado15.mp3', 'sounds/teclado16.mp3',
];


let currentSounds = normalSounds;
let currentSet = 1;
let sequentialIndex = 0;

// Função para alternar os sons e o texto do botão
function toggleSounds() {
  if (currentSet === 1) {
    currentSounds = coolSounds;
    currentSet = 2;
    sequentialIndex = 0;
    btnToggleSounds.innerText = "🎹😎 Teclado lindinho 2009";
  } else {
    currentSounds = normalSounds;
    currentSet = 1;
    btnToggleSounds.innerText = "🖱️⌨️ Teclado Normal";
  }
}

// Botão para trocar sons manualmente
btnToggleSounds.addEventListener("click", toggleSounds);


const calculator = new Calculator(previousOperationText, currentOperationText);


buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerText;

    playSound();

    if (+value >= 0 || value === ".") {
      calculator.addDigit(value);
    } else {
      calculator.processOperation(value);
    }
  });
});

// Evento de teclado
document.addEventListener("keydown", (event) => {
  const key = event.key;

  const allowedDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  const allowedOperations = ["+", "-", "*", "/", "Enter", "Backspace", "Escape", "Delete"];

  // Tecla espaço troca o som (sem som)
  if (key === " ") {
    event.preventDefault(); // Evita scroll
    toggleSounds(); // Troca sons e muda o texto
    return;
  }

  playSound();

  // Se for número ou ponto
    if (allowedDigits.includes(key)) {
    calculator.addDigit(key);
    return;
  }

  // Se for operação
  if (allowedOperations.includes(key)) {
    let op = key;

    if (key === "Enter") {
      event.preventDefault(); //nao deixa o enter dar duplo click
      op = "=";
    }
    if (key === "Backspace") op = "DEL";
    if (key === "Escape") op = "CE";
    if (key === "Delete") op = "C";

    calculator.processOperation(op);
  }
});

// Função para tocar som
function playSound() {
  let soundToPlay;

  if (currentSet === 1) {
    const randomIndex = Math.floor(Math.random() * currentSounds.length);
    soundToPlay = currentSounds[randomIndex];
  } else {
    soundToPlay = currentSounds[sequentialIndex];
    sequentialIndex = (sequentialIndex + 1) % currentSounds.length;
  }

  new Audio(soundToPlay).play();
}
