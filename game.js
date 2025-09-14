function initializeGame(targetWord) {
  return {
    targetWord: targetWord.toUpperCase(),
    guesses: [],
    results: [],
    currentGuess: 0,
    won: false,
    lost: false
  };
}

function makeGuess(game, guess) {
  if (isGameOver(game)) {
    return false;
  }

  const result = evaluateGuess(guess, game.targetWord);

  game.guesses.push(guess);
  game.results.push(result);
  game.currentGuess++;

  if (guess === game.targetWord) {
    game.won = true;
  } else if (game.currentGuess >= 6) {
    game.lost = true;
  }

  return true;
}

function evaluateGuess(guess, targetWord) {
  const result = [];
  const targetLetters = targetWord.split('');
  const guessLetters = guess.split('');

  const letterCount = {};
  for (const letter of targetLetters) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      letterCount[guessLetters[i]]--;
    } else {
      result[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === null) {
      if (letterCount[guessLetters[i]] && letterCount[guessLetters[i]] > 0) {
        result[i] = 'present';
        letterCount[guessLetters[i]]--;
      } else {
        result[i] = 'absent';
      }
    }
  }

  return result;
}

function isGameOver(game) {
  return game.won || game.lost;
}

function getGameStatus(game) {
  if (game.won) {
    return 'won';
  } else if (game.lost) {
    return 'lost';
  } else {
    return 'playing';
  }
}

export {
  initializeGame,
  makeGuess,
  evaluateGuess,
  isGameOver,
  getGameStatus
};