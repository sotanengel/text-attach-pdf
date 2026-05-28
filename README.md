# llmpdf

AI向けテキストをPDFに付与するCLIツール。PDFの見た目を一切変えずに、AI・LLM向けの補助テキストをPDF内部に埋め込みます。

## インストール

```bash
npm install -g llmpdf
# または
pnpm add -g llmpdf
```

## 使い方

### テキストを付与する（メインコマンド）

```bash
# テキストファイルを指定
llmpdf input.pdf notes.txt

# テキストを直接指定
llmpdf input.pdf --text "この文書は〇〇に関する技術仕様書です..."

# 出力先を指定（省略時: input.llm.pdf）
llmpdf input.pdf notes.txt --output output.pdf

# 既存の付与済みテキストを上書き
llmpdf input.llm.pdf notes.txt --overwrite
```

### 付与済みテキストを確認する

```bash
llmpdf show manual.llm.pdf
```

### 付与済みテキストを削除する

```bash
llmpdf remove manual.llm.pdf --output cleaned.pdf
```

## 引数・オプション

| 項目              | 書式       | 必須         | 説明                                           |
| ----------------- | ---------- | ------------ | ---------------------------------------------- |
| `<pdf>`           | 第1引数    | ✅           | 入力PDFファイルのパス                          |
| `<text_file>`     | 第2引数    | どちらか必須 | 付与するテキストファイルのパス                 |
| `--text <string>` | オプション | どちらか必須 | 付与するテキストを文字列で直接指定             |
| `--output <path>` | オプション | ❌           | 出力ファイルパス（省略時: `<入力名>.llm.pdf`） |
| `--overwrite`     | フラグ     | ❌           | 出力先ファイルが存在する場合に上書き           |

## 終了コード

| コード | 意味                                     |
| ------ | ---------------------------------------- |
| `0`    | 成功                                     |
| `1`    | 引数・オプションのエラー                 |
| `2`    | ファイル読み込みエラー                   |
| `3`    | PDFの処理エラー                          |
| `4`    | 既存付与データあり（`--overwrite` なし） |

## 技術仕様

- PDF Embedded File Stream + Associated Files (ISO 32000 / PDF/A-3 準拠)
- AFRelationship: `Alternative`
- MIME: `text/plain; charset=utf-8`
- ファイル名: `llm-content.txt`

## 開発

```bash
pnpm install
pnpm build
pnpm test:run
pnpm test:integration
```
