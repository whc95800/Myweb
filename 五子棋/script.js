const ROWS_COUNT = 15;
const COLUMNS_COUNT = 15;
const WIN_SEQUENCE_LENGTH = 4;
let gameIsOver = false;
let currentTurn = "black";

class Chip {
  constructor(chipNode, rowIndex, columnIndex) {
    this.node = chipNode;
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;
    this.node.addEventListener("click", () => {
      const targetChip = chips.chips[this.rowIndex][this.columnIndex];
      if (!targetChip.color && !gameIsOver) {
        targetChip.setColor(currentTurn);
        const winChips = getWinChips(targetChip);
        if (winChips.length !== 0) {
          winChips.forEach(chip => chip.setColor("red"));
          gameIsOver = true;
          document
            .getElementById("win-result")
            .appendChild(document.createTextNode(`${currentTurn} win!!!`));
          return;
        }
        switchTurn();
      }
    });
  }

  setColor(color) {
    this.color = color;
    const oldClassAttribute = this.node.getAttribute("class");
    const colorsRegExp = /black|white|red/;
    this.node.setAttribute(
      "class",
      colorsRegExp.test(oldClassAttribute)
        ? oldClassAttribute.replace(colorsRegExp, color)
        : `${oldClassAttribute} ${color}`
    );
  }
}

class ChipsCollection {
  constructor({ rows, columns }) {
    this.rowsCount = rows;
    this.columnsCount = columns;
    this.chips = [[]]; //store chips in two-dimensional array
  }

  push(chipNode) {
    const lastRow = this.chips[this.chips.length - 1];
    const rowIndex = this.chips.length - 1;
    const columnIndex = lastRow.length;
    if (lastRow.length < this.columnsCount) {
      const chip = new Chip(chipNode, rowIndex, columnIndex);
      lastRow.push(chip);
    } else {
      if (this.chips.length < this.rowsCount) {
        const chip = new Chip(chipNode, rowIndex + 1, 0);
        const newRow = [chip];
        this.chips.push(newRow);
      }
    }
  }
}

const chips = new ChipsCollection({
  rows: ROWS_COUNT + 1,
  columns: COLUMNS_COUNT + 1
});
const table = document.getElementById("field-table");
let chipCounter = 0;
for (let y = 0; y < ROWS_COUNT; y++) {
  const row = document.createElement("tr");
  for (let x = 0; x < COLUMNS_COUNT; x++) {
    const cell = document.createElement("td");
    createChipInCell(cell);
    const lastCellInRow = x === COLUMNS_COUNT - 1;
    if (lastCellInRow) {
      createChipInCell(cell, "last-in-row");
    }
    row.appendChild(cell);
  }
  table.appendChild(row);
}

document
  .querySelectorAll("#field-table tr:last-child td")
  .forEach((cell, index) => {
    const lastCellInRow = index === COLUMNS_COUNT - 1;
    createChipInCell(cell, "last-in-column");
    if (lastCellInRow) {
      createChipInCell(cell, "last-in-row", "last-in-column");
    }
  });

function createChipInCell(cellNode, ...additionalChipClasses) {
  const chipNode = document.createElement("div");
  chips.push(chipNode);
  chipNode.setAttribute("class", "chip");
  additionalChipClasses.forEach(additionalClass => {
    chipNode.setAttribute(
      "class",
      chipNode.getAttribute("class") + " " + additionalClass
    );
  });
  cellNode.appendChild(chipNode);
}

function switchTurn() {
  const blackTurnHtml = document.getElementById("turn-black");
  const whiteTurnHtml = document.getElementById("turn-white");
  if (currentTurn === "white") {
    currentTurn = "black";
    blackTurnHtml.setAttribute(
      "class",
      `${blackTurnHtml.getAttribute("class")} turn-current`
    );
    whiteTurnHtml.setAttribute(
      "class",
      whiteTurnHtml.getAttribute("class").replace(" turn-current", "")
    );
  } else {
    currentTurn = "white";
    whiteTurnHtml.setAttribute(
      "class",
      `${whiteTurnHtml.getAttribute("class")} turn-current`
    );
    blackTurnHtml.setAttribute(
      "class",
      blackTurnHtml.getAttribute("class").replace(" turn-current", "")
    );
  }
}

function getWinChips(targetChip) {
  const horisontalWinSequence = getHorisontalWinSequence(targetChip);
  const verticalWinSequence = getVerticalWinSequence(targetChip);
  const slashWinSequence = getSlashWinSequence(targetChip);
  const backSlashWinSequence = getBackSlashWinSequence(targetChip);
  return [
    ...horisontalWinSequence,
    ...verticalWinSequence,
    ...slashWinSequence,
    ...backSlashWinSequence
  ];
}

function getHorisontalWinSequence(targetChip) {
  let chipSequences = [];
  let currentChipSequence = [];
  for (let y = targetChip.rowIndex, x = 0; x < chips.columnsCount; x++) {
    if (chips.chips[y][x].color === currentTurn) {
      currentChipSequence.push(chips.chips[y][x]);
      if (x === chips.columnsCount - 1) {
        chipSequences.push([...currentChipSequence]);
      }
    } else if (currentChipSequence.length) {
      chipSequences.push([...currentChipSequence]);
      currentChipSequence = [];
    }
  }
  const winSequence =
    chipSequences.find(sequence => sequence.length >= WIN_SEQUENCE_LENGTH) ||
    [];
  return winSequence;
}

function getVerticalWinSequence(targetChip) {
  let chipSequences = [];
  let currentChipSequence = [];
  for (let y = 0, x = targetChip.columnIndex; y < chips.rowsCount; y++) {
    if (chips.chips[y][x].color === currentTurn) {
      currentChipSequence.push(chips.chips[y][x]);
      if (y === chips.rowsCount - 1) {
        chipSequences.push([...currentChipSequence]);
      }
    } else if (currentChipSequence.length) {
      chipSequences.push([...currentChipSequence]);
      currentChipSequence = [];
    }
  }
  const winSequence =
    chipSequences.find(sequence => sequence.length >= WIN_SEQUENCE_LENGTH) ||
    [];
  return winSequence;
}

function getSlashWinSequence(targetChip) {
  let chipSequences = [];
  let currentChipSequence = [];
  const coordinatesSum = targetChip.rowIndex + targetChip.columnIndex;
  const startY =
    coordinatesSum < chips.rowsCount - 1 ? coordinatesSum : chips.rowsCount - 1;
  const startX =
    coordinatesSum >= chips.rowsCount - 1
      ? coordinatesSum - (chips.rowsCount - 1)
      : 0;
  for (let y = startY, x = startX; x < chips.columnsCount && y >= 0; x++, y--) {
    if (chips.chips[y][x].color === currentTurn) {
      currentChipSequence.push(chips.chips[y][x]);
      if (x === chips.columnsCount - 1 || y === 0) {
        chipSequences.push([...currentChipSequence]);
      }
    } else if (currentChipSequence.length) {
      chipSequences.push([...currentChipSequence]);
      currentChipSequence = [];
    }
  }
  const winSequence =
    chipSequences.find(sequence => sequence.length >= WIN_SEQUENCE_LENGTH) ||
    [];
  return winSequence;
}

function getBackSlashWinSequence(targetChip) {
  let chipSequences = [];
  let currentChipSequence = [];
  const coordinatesDifference = targetChip.rowIndex - targetChip.columnIndex;
  const startY = coordinatesDifference > 0 ? coordinatesDifference : 0;
  const startX =
    coordinatesDifference > 0 ? 0 : Math.abs(coordinatesDifference);

  for (
    let y = startY, x = startX;
    x < chips.columnsCount && y < chips.rowsCount;
    x++, y++
  ) {
    if (chips.chips[y][x].color === currentTurn) {
      currentChipSequence.push(chips.chips[y][x]);
      if (x === chips.columnsCount - 1 || y === chips.rowsCount - 1) {
        chipSequences.push([...currentChipSequence]);
      }
    } else if (currentChipSequence.length) {
      chipSequences.push([...currentChipSequence]);
      currentChipSequence = [];
    }
  }
  const winSequence =
    chipSequences.find(sequence => sequence.length >= WIN_SEQUENCE_LENGTH) ||
    [];
  return winSequence;
}