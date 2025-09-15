#!/usr/bin/env node

import readline from 'readline';
import { displayGame, clearScreen } from './display.js';
import { initializeGame, makeGuess, isGameOver, getRandomWordExcluding, getGameStats } from './game.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  const usedWords = [];
  let playAgain = true;

  console.log('🎯 Welcome to ASCII Wordle!\n');

  while (playAgain) {
    await playGame(usedWords);
    playAgain = await askForReplay();
  }

  console.log('\n👋 Thanks for playing ASCII Wordle! Goodbye!');
  rl.close();
}

async function playGame(usedWords) {
  const targetWord = getRandomWordExcluding(usedWords);
  usedWords.push(targetWord);

  const game = initializeGame(targetWord);

  while (!isGameOver(game)) {
    displayGame(game);

    const guess = await getGuess();
    if (guess) {
      makeGuess(game, guess.toUpperCase());
    }
  }

  displayGame(game);

  if (game.won) {
    const stats = getGameStats(game);
    console.log('\n🎉 Congratulations! You found the word!');
    console.log('\n📊 Your Stats:');
    console.log(`Word: ${stats.word}`);
    console.log(`Attempts: ${stats.attempts}/6`);
    console.log(`Time: ${stats.time}`);
    console.log('\nShare your success! 🎯');
  } else {
    console.log(`\n💔 Game over! The word was: ${game.targetWord}`);
  }
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

function askForReplay() {
  return new Promise((resolve) => {
    rl.question('\n🎮 Would you like to play again? (y/n): ', (answer) => {
      const response = answer.toLowerCase().trim();
      if (response === 'y' || response === 'yes') {
        console.log('\n🎯 Starting a new game with a different word!\n');
        resolve(true);
      } else if (response === 'n' || response === 'no') {
        resolve(false);
      } else {
        console.log('❌ Please enter "y" for yes or "n" for no.');
        resolve(askForReplay());
      }
    });
  });
}

main().catch(console.error);