import { defineCommand, runMain } from 'citty';

const main = defineCommand({
  meta: {
    name: 'llmpdf',
    version: '0.1.0',
    description: 'AI向けテキストをPDFに付与するCLIツール',
  },
  run() {
    console.log('llmpdf v0.1.0 — まだ実装中です');
  },
});

runMain(main);
