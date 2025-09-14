#!/usr/bin/env node

import readline from 'readline';
import { displayGame, clearScreen } from './display.js';
import { initializeGame, makeGuess, isGameOver } from './game.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('🎯 Welcome to ASCII Wordle!');
  console.log('Guess the 5-letter word. You have 6 attempts.');
  console.log('Green = Correct letter, correct position');
  console.log('Yellow = Correct letter, wrong position');
  console.log('Gray = Letter not in word\n');

  const game = initializeGame('HELLO');

  while (!isGameOver(game)) {
    displayGame(game);

    const guess = await getGuess();
    if (guess) {
      makeGuess(game, guess.toUpperCase());
    }
  }

  displayGame(game);

  if (game.won) {
    console.log('\n🎉 Congratulations! You found the word!');
  } else {
    console.log(`\n💔 Game over! The word was: ${game.targetWord}`);
  }

  rl.close();
}

function getGuess() {
  return new Promise((resolve) => {
    rl.question('Enter your 5-letter guess: ', (answer) => {
      if (answer.length !== 5) {
        console.log('❌ Please enter exactly 5 letters.');
        resolve(null);
      } else if (!/^[A-Za-z]+$/.test(answer)) {
        console.log('❌ Please enter only letters.');
        resolve(null);
      } else {
        resolve(answer);
      }
    });
  });
}

main().catch(console.error);