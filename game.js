import { wordleWords } from './words.js';

function initializeGame(targetWord) {
  return {
    targetWord: targetWord.toUpperCase(),
    guesses: [],
    results: [],
    currentGuess: 0,
    won: false,
    lost: false,
    startTime: Date.now()
  };
}

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordleWords.length);
  return wordleWords[randomIndex].toUpperCase();
}

function getRandomWordExcluding(usedWords = []) {
  const upperCaseUsed = usedWords.map(word => word.toUpperCase());
  const availableWords = wordleWords.filter(word =>
    !upperCaseUsed.includes(word.toUpperCase())
  );

  if (availableWords.length === 0) {
    // If all words have been used, reset the pool
    return getRandomWord();
  }

  const randomIndex = Math.floor(Math.random() * availableWords.length);
  return availableWords[randomIndex].toUpperCase();
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

function getElapsedTime(game) {
  const elapsedMs = Date.now() - game.startTime;
  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

function getGameStats(game) {
  return {
    word: game.targetWord,
    attempts: game.currentGuess,
    time: getElapsedTime(game)
  };
}

export {
  initializeGame,
  makeGuess,
  evaluateGuess,
  isGameOver,
  getGameStatus,
  getRandomWord,
  getRandomWordExcluding,
  getGameStats
};