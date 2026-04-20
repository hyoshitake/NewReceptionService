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
  overlay.textContent = "〇○参戦！！";
  overlay.style.display = "none";
  overlay.style.position = "absolute";
  overlay.style.top = "50%";
  overlay.style.left = "50%";
  overlay.style.transform = "translate(-50%, -50%)";
  overlay.style.zIndex = "9999";
  overlay.style.padding = "24px 40px";
  overlay.style.borderRadius = "16px";
  overlay.style.background = "rgba(0, 0, 0, 0.75)";
  overlay.style.color = "#fff";
  overlay.style.fontSize = "48px";
  overlay.style.fontWeight = "bold";
  overlay.style.textAlign = "center";
  overlay.style.pointerEvents = "none";

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
    overlay.textContent = `${name}参戦！！`;
    overlay.style.display = "block";

    if (receptionOverlayHideTimer) {
      clearTimeout(receptionOverlayHideTimer);
    }

    receptionOverlayHideTimer = setTimeout(() => {
      overlay.style.display = "none";
    }, 3000);
  })
}

connectReceptionSocket()
