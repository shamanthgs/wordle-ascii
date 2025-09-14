const colors = {
  reset: '\x1b[0m',
  green: '\x1b[42m\x1b[30m',
  yellow: '\x1b[43m\x1b[30m',
  gray: '\x1b[100m\x1b[37m',
  white: '\x1b[47m\x1b[30m',
  dim: '\x1b[2m'
};

function clearScreen() {
  console.clear();
}

function displayGame(game) {
  clearScreen();
  console.log('🎯 ASCII WORDLE\n');

  displayGameBoard(game);
  console.log('');
  displayAlphabet(game);
  console.log('');
}

function displayGameBoard(game) {
  for (let row = 0; row < 6; row++) {
    let rowDisplay = '';

    if (row < game.guesses.length) {
      const guess = game.guesses[row];
      const result = game.results[row];

      for (let col = 0; col < 5; col++) {
        const letter = guess[col];
        const state = result[col];
        rowDisplay += formatLetter(letter, state) + ' ';
      }
    } else {
      for (let col = 0; col < 5; col++) {
        rowDisplay += formatLetter(' ', 'empty') + ' ';
      }
    }

    console.log(rowDisplay);
  }
}

function displayAlphabet(game) {
  console.log('Alphabet Status:');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let alphabetDisplay = '';

  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    const state = getLetterState(letter, game);
    alphabetDisplay += formatLetter(letter, state) + ' ';

    if ((i + 1) % 13 === 0) {
      console.log(alphabetDisplay);
      alphabetDisplay = '';
    }
  }

  if (alphabetDisplay) {
    console.log(alphabetDisplay);
  }
}

function formatLetter(letter, state) {
  switch (state) {
    case 'correct':
      return `${colors.green} ${letter} ${colors.reset}`;
    case 'present':
      return `${colors.yellow} ${letter} ${colors.reset}`;
    case 'absent':
      return `${colors.gray} ${letter} ${colors.reset}`;
    case 'empty':
      return `${colors.white}   ${colors.reset}`;
    default:
      return `${colors.dim} ${letter} ${colors.reset}`;
  }
}

function getLetterState(letter, game) {
  let hasCorrect = false;
  let hasPresent = false;
  let hasAbsent = false;

  for (let i = 0; i < game.guesses.length; i++) {
    const guess = game.guesses[i];
    const result = game.results[i];

    for (let j = 0; j < guess.length; j++) {
      if (guess[j] === letter) {
        if (result[j] === 'correct') {
          hasCorrect = true;
        } else if (result[j] === 'present') {
          hasPresent = true;
        } else if (result[j] === 'absent') {
          hasAbsent = true;
        }
      }
    }
  }

  if (hasCorrect) {
    return 'correct';
  } else if (hasPresent) {
    return 'present';
  } else if (hasAbsent) {
    return 'absent';
  }

  return 'unused';
}

module.exports = {
  displayGame,
  clearScreen
};