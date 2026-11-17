const fs = require('fs');
const readline = require('readline');

const NAMES = { 1: 'орёл', 2: 'решка' };

function logResult(logPath, entry) {
  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n', 'utf-8');
}

function askGuess(rl, prompt) {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(prompt, (answer) => {
        const value = answer.trim();
        if (value === '1' || value === '2') {
          resolve(Number(value));
        } else {
          console.log('Введите 1 (орёл) или 2 (решка).');
          ask();
        }
      });
    };
    ask();
  });
}

async function main() {
  const logPath = process.argv[2];
  if (!logPath) {
    console.log('Использование: node coin.js <файл_лога>');
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('=== Орёл или решка ===');
  console.log('Я загадываю 1 (орёл) или 2 (решка). Угадывай! Для выхода нажми Ctrl+C.\n');

  let gameNumber = 0;
  try {
    while (true) {
      gameNumber += 1;
      const secret = Math.floor(Math.random() * 2) + 1; // 1 или 2
      const guess = await askGuess(rl, `Партия ${gameNumber}. Твоя догадка: `);

      const won = guess === secret;
      if (won) {
        console.log(`Угадал! Выпало: ${NAMES[secret]} 🎉`);
      } else {
        console.log(`Не угадал. Выпало: ${NAMES[secret]}.`);
      }

      logResult(logPath, {
        game_number: gameNumber,
        datetime: new Date().toISOString(),
        secret: NAMES[secret],
        guess: NAMES[guess],
        result: won ? 'win' : 'lose',
      });
    }
  } catch (err) {
    console.error('Ошибка:', err.message);
  } finally {
    rl.close();
    console.log('\nИгра окончена. Логи сохранены в', logPath);
  }
}

main();

process.on('SIGINT', () => process.exit(0));
