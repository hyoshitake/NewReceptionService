# AGENTS.md

このファイルは、このリポジトリで作業する開発者およびAIエージェント向けのガイドです。

## プロジェクト概要

このリポジトリは、Google Slides に受付通知を表示するための小規模なリアルタイム通知システムです。

- 受付ページで名前を送信する
- Node.js サーバーが Socket.IO でイベントを配信する
- Chrome 拡張が Google Slides 上に通知を表示する

## 主要ディレクトリ

- `app/server.js`
  - Express サーバー本体
  - `/reserve` を配信
  - `join` / `post` / `reserve` のイベントを処理

- `app/reserve.html`
  - 受付用の画面
  - URLクエリの `room` をもとにルームへ参加する

- `extension/content.js`
  - Google Slides の画面上に通知オーバーレイを描画する
  - `reserve` イベントを受信して表示を更新する

- `extension/options.html` / `extension/options.js`
  - `domain` と `roomCode` を保存する設定画面

- `docker-compose.yml` / `Dockerfile`
  - ローカル開発用の起動設定

## 作業時の前提

### 起動コマンド

```bash
docker-compose up -d
```

### ローカル確認URL

```text
http://localhost:13000/reserve?room=demo
```

## 変更時のルール

1. Socket.IO のイベント名を揃えること
   - サーバー、受付画面、拡張機能で `join` / `post` / `reserve` を一致させる

2. 設定キー名を揃えること
   - 拡張機能の保存キーは `domain` と `roomCode`
   - 名称変更を行う場合は関連ファイルをまとめて更新する

3. ユーザー向け導線を壊さないこと
   - 受付ページのURL
   - ポート番号
   - Google Slides 上での通知表示

4. ドキュメントも同時に更新すること
   - 起動方法、URL、設定項目名を変えた場合は `README.md` を必ず更新する

## 実装上の注意

- 現在の実装はシンプルで、認証やデータ永続化はありません
- CORS は Google Slides 利用を前提に設定されています
- 大きな構成変更よりも、小さく安全な差分を優先してください
- UI文言は既存の日本語ベースを維持してください

## 確認観点

変更後は少なくとも次を確認してください。

- サーバーが起動すること
- `/reserve?room=任意の値` で受付画面が開くこと
- 拡張側の `Domain` と `RoomCode` が実際の導線と一致していること
- README の手順が実装と矛盾していないこと
