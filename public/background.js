let portToPopup;

chrome.runtime.onConnect.addListener(function (port) {
    console.log("[ema-background] Connected to popup script");
    portToPopup = port;

    // Listen for messages from the popup script
    portToPopup.onMessage.addListener(function (msg) {
        console.log("[ema-background] Received message from popup script: ", msg);
    });

    // Listen for the disconnect event
    portToPopup.onDisconnect.addListener(function () {
        console.log("[ema-background] Disconnected from popup script");
    });
});

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.signalID === "inject-return-data") {
            // The user wants to add the new item
            chrome.action.setBadgeText({ text: "+" });
            // Generate unique id
            let id = "" + new Date().getTime();
            let obj = {};
            obj[id] = message.data;
            // Add new item to storage
            chrome.storage.local.set(obj);
        }
    }
);
