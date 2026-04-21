console.log("Google Slide受付通知システム: content.js loaded");
let socket
let receptionOverlayHideTimer = null
const OVERLAY_ID = "reception-notification-overlay"

// 受け付けたときにスライドの上に受付通知を表示する
const setReceptionOverlay = (node) => {
  // スライドの表示がない場合は処理をしない
  if (!node.classList.contains("punch-full-screen-element")) {
    return;
  }

  if (node.querySelector(`#${OVERLAY_ID}`)) {
    return;
  }

  node.style.position = "relative";

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  // スタイルは content.css に委ねる

  node.appendChild(overlay);
}

// DOMの変更を検知する
const observer = new MutationObserver(records => {
  // 検知したDOMノードを調べる
  records.forEach(record => {
    // addedNodesで追加されたNodeを取得できる
    record.addedNodes.forEach(node => {
      // Nodeの変更でなければ処理をしない
      if(node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }
      setReceptionOverlay(node);
    });
  })
})

observer.observe(document.body, {
  childList: true
});

const getRoomCode = async () => {
  const data = await chrome.storage.local.get('roomCode')
  return data.roomCode;
}

const getDomain = async () => {
  const data = await chrome.storage.local.get('domain')
  return data.domain;
}

// 設定されたルームコードを使って受付通知へ接続する
const connectReceptionSocket = async () => {
  // 設定情報を取得する
  const roomCode = await getRoomCode();
  const domain = await getDomain();

  // ルームコードが設定されていない場合は処理をしない
  if (!roomCode || !domain) {
    return;
  }

  // ルームに入る
  socket = io(`${domain}`);

  socket.on("connect", () => {
    socket.emit("join", { roomCode: roomCode, name: 'slide' });
  })

  socket.on("reception", (receptionMessage) => {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      return;
    }

    const name = receptionMessage?.name || "〇○";
    overlay.textContent = `🎉 ${name} 参戦！！ 🎉`;

    // 既存アニメーション・タイマーをリセット
    overlay.classList.remove("is-entering", "is-exiting");
    // 強制リフロー（クラス削除直後に再追加するため）
    void overlay.offsetWidth;

    if (receptionOverlayHideTimer) {
      clearTimeout(receptionOverlayHideTimer);
    }

    // スライドイン開始
    overlay.classList.add("is-entering");

    // 3秒後にスライドアウト開始
    receptionOverlayHideTimer = setTimeout(() => {
      overlay.classList.remove("is-entering");
      overlay.classList.add("is-exiting");

      // アニメーション終了後にクラスを除去して画面外に戻す
      overlay.addEventListener("animationend", (e) => {
        if (e.animationName === "slideOutToRight") {
          overlay.classList.remove("is-exiting");
        }
      }, { once: true });
    }, 3000);
  })
}

connectReceptionSocket()
