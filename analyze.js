const fs = require('fs');

function main() {
  const logPath = process.argv[2];
  if (!logPath) {
    console.log('Использование: node analyze.js <файл_лога>');
    process.exit(1);
  }

  let content;
  try {
    content = fs.readFileSync(logPath, 'utf-8');
  } catch (err) {
    console.error(`Не удалось открыть файл: ${logPath}`);
    console.error(err.message);
    process.exit(1);
  }

  // Разбираем лог: каждая непустая строка — JSON-запись одной партии
  const games = [];
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      games.push(JSON.parse(trimmed));
    } catch {
      console.warn(`Пропущена некорректная строка: ${trimmed}`);
    }
  }

  const total = games.length;
  const wins = games.filter((g) => g.result === 'win').length;
  const losses = total - wins;
  const winPercent = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

  console.log('=== Анализ логов «Орёл или решка» ===');
  console.log(`Общее количество партий:  ${total}`);
  console.log(`Выиграно:                 ${wins}`);
  console.log(`Проиграно:                ${losses}`);
  console.log(`Процент побед:            ${winPercent}%`);
}

main();
