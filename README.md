# New Reception Service

Google Slides と連携して、受付通知をリアルタイム表示するためのシステムです。

受付ページで名前を送信すると、同じ RoomCode を設定した Google Slides 上に通知が表示されます。

## 構成

- `app/` : Node.js + Express + Socket.IO で動く受付サーバー
- `extension/` : Google Slides 上に通知を表示する Chrome 拡張
- `docker-compose.yml` : ローカル起動設定

## 起動方法

### 前提

- Docker
- Docker Compose

### 起動

```bash
docker-compose up -d
```

起動後、受付画面は次のURLで開けます。

```text
http://localhost:13000/reception?room=demo
```

ログ確認画面は次のURLで開けます。

```text
http://localhost:13000/log
```

> `room` の値は任意ですが、Chrome 拡張側で設定する `RoomCode` と同じ値にしてください。

## 利用手順

1. サーバーを起動する
2. Chrome 拡張をインストールする
3. 拡張機能の設定画面で `Domain` と `RoomCode` を保存する
4. Google Slides のプレゼンテーション画面を開く
5. 受付ページで名前を入力してボタンを押す
6. スライド上に受付通知が表示される

## Chrome 拡張の設定

Chrome 拡張は以下から利用できます。

- Chrome Web Store
  https://chromewebstore.google.com/detail/google-slide-vote-system/dcgljdgnllohpahcbmgkeeelianlkkfn

設定画面では、次の2項目を入力します。

- `Domain` : 受付サーバーのURL
  - 例: `http://localhost:13000`
- `RoomCode` : 通知を受け取るルーム名
  - 例: `demo`

### 設定例

- 受付ページ: `http://localhost:13000/reception?room=demo`
- 拡張の `Domain`: `http://localhost:13000`
- 拡張の `RoomCode`: `demo`

この3つを揃えることで、受付通知が同じルームに配信されます。

## 補足

- 通知は Socket.IO を使ってリアルタイム配信されます
- `/log` で Socket.IO の動作ログをリアルタイム確認できます
- 現在の実装では認証やデータ永続化はありません
- Google Slides (`docs.google.com`) 上での利用を前提にしています

