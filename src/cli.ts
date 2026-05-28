import { defineCommand, runMain } from 'citty';
import { runEmbed } from './commands/embed.js';
import { runShow } from './commands/show.js';
import { runRemove } from './commands/remove.js';

const showCommand = defineCommand({
  meta: { name: 'show', description: '付与済みAI向けテキストを表示する' },
  args: {
    pdf: { type: 'positional', description: '入力PDFファイルのパス', required: true },
  },
  async run({ args }) {
    await runShow({ pdf: args.pdf });
  },
});

const removeCommand = defineCommand({
  meta: { name: 'remove', description: '付与済みAI向けテキストを削除する' },
  args: {
    pdf: { type: 'positional', description: '入力PDFファイルのパス', required: true },
    output: { type: 'string', description: '出力ファイルパス' },
    overwrite: { type: 'boolean', description: '出力先が既存の場合に上書き', default: false },
  },
  async run({ args }) {
    await runRemove({ pdf: args.pdf, output: args.output, overwrite: args.overwrite ?? false });
  },
});

const embedCommand = defineCommand({
  meta: { name: 'llmpdf', version: '0.1.0', description: 'AI向けテキストをPDFに付与するCLIツール' },
  args: {
    pdf: { type: 'positional', description: '入力PDFファイルのパス', required: true },
    text_file: { type: 'positional', description: 'テキストファイルのパス', required: false },
    text: { type: 'string', description: 'テキストを文字列で直接指定' },
    output: { type: 'string', description: '出力ファイルパス (省略時: <入力名>.llm.pdf)' },
    overwrite: { type: 'boolean', description: '出力先が既存の場合に上書き', default: false },
  },
  async run({ args }) {
    await runEmbed({
      pdf: args.pdf,
      text_file: args.text_file,
      text: args.text,
      output: args.output,
      overwrite: args.overwrite ?? false,
    });
  },
});

const rawArgs = process.argv.slice(2);
const firstArg = rawArgs.find((a) => !a.startsWith('-'));

if (firstArg === 'show') {
  runMain(showCommand, { rawArgs: rawArgs.slice(rawArgs.indexOf('show') + 1) });
} else if (firstArg === 'remove') {
  runMain(removeCommand, { rawArgs: rawArgs.slice(rawArgs.indexOf('remove') + 1) });
} else {
  runMain(embedCommand);
}
