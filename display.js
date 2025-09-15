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

function formatGameTime(game) {
  const elapsedMs = Date.now() - game.startTime;
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((elapsedMs % 1000) / 10); // Show centiseconds instead of full milliseconds

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

function displayGame(game) {
  clearScreen();
  console.log('🎯 ASCII WORDLE');
  console.log('Guess the 5-letter word. You have 6 attempts.');
  console.log('Green = Correct letter, correct position');
  console.log('Yellow = Correct letter, wrong position');
  console.log('Gray = Letter not in word');
  console.log(`⏱️  Time: ${formatGameTime(game)}\n`);

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
        rowDisplay += formatLetter(letter, state);
        if (col < 4) rowDisplay += '  ';
      }
    } else {
      for (let col = 0; col < 5; col++) {
        rowDisplay += formatLetter(' ', 'empty');
        if (col < 4) rowDisplay += '  ';
      }
    }

    console.log(rowDisplay);
    console.log('');
  }
}

function displayAlphabet(game) {
  const qwertyRows = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM'
  ];

  for (let row of qwertyRows) {
    let rowDisplay = '';

    for (let i = 0; i < row.length; i++) {
      const letter = row[i];
      const state = getLetterState(letter, game);
      rowDisplay += formatLetter(letter, state);
      if (i < row.length - 1) rowDisplay += '  ';
    }

    console.log(rowDisplay);
  }
}

function formatLetter(letter, state) {
  switch (state) {
    case 'correct':
      return `${colors.green}  ${letter}  ${colors.reset}`;
    case 'present':
      return `${colors.yellow}  ${letter}  ${colors.reset}`;
    case 'absent':
      return `${colors.gray}  ${letter}  ${colors.reset}`;
    case 'empty':
      return `${colors.white}     ${colors.reset}`;
    default:
      return `${colors.dim}  ${letter}  ${colors.reset}`;
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

export {
  displayGame,
  clearScreen
};