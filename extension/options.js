const domainElem = document.getElementById('domain');
chrome.storage.local.get(['domain'], function(data) {
  domainElem.value = data.domain ?? "";
});

const roomCodeElem = document.getElementById('roomCode');
chrome.storage.local.get(['roomCode'], function(data) {
  roomCodeElem.value = data.roomCode ?? "";
});


const button = document.getElementById('config-set');

//設定反映
button.addEventListener('click', function() {
  chrome.storage.local.set({domain: domainElem.value}, function() {
    console.log('domain is ' + domainElem.value);
  });
  chrome.storage.local.set({roomCode: roomCodeElem.value}, function() {
    console.log('roomCode is ' + roomCodeElem.value);
  });

  alert("反映しました")
});
