console.log("Google Slide受付通知システム: content.js loaded");
let socket

// 受け付けたときにスライドの上に受付通知を表示する
const setOverlayReseversion = (node) => {
  // スライドの表示がない場合は処理をしない
  if (!node.classList.contains("punch-full-screen-element")) {
    return;
  }

  // TODO: 受付通知の画面を作り、nodeにappendする。display:noneで作っておいて、受付があったときにdisplay:blockにする
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
      setOverlayReseversion(node);
    });
  })
})

observer.observe(document.body, {
  childList: true
});

getRoomCode = async () => {
  const data = await chrome.storage.local.get('roomCode')
  return data.roomCode;
}

getDomain = async () => {
  const data = await chrome.storage.local.get('domain')
  return data.domain;
}

// 設定されたルームコードを使ってログインする
const login = async () => {
  // ログイン情報を取得する
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

  socket.on("reserve", () => {
    // TODO: 受付通知を表示する。display:noneのdivをdisplay:blockにする
  })
}

login()
