chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get('reminders', (result) => {
    if (!chrome.runtime.lastError) {
      const reminders = result.reminders || [];

      for (const reminder of reminders) {
        if (reminder.alarmName === alarm.name) {
          const notificationMessage = `${reminder.title}`;

          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Reminder',
            message: notificationMessage
          });

          console.log('Reminder shown:', notificationMessage);

          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
              console.error('Error querying tabs:', chrome.runtime.lastError);
              return;
            }

            if (tabs && tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'addCustomDiv', reminderTitle: reminder.title }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error('Error sending message:', chrome.runtime.lastError);
                } else {
                  console.log('Message sent to content script:', response);
                }
              });
            } else {
              console.error('No active tabs found.');
            }
          });

          break;
        }
      }
    }
  });
});

const StorageHelper = {
  get: async (key) => {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        const data = result[key] || [];
        resolve(data);
      });
    });
  },}

chrome.runtime.onInstalled.addListener(() => {
  updateBlockingRules();
});

export async function updateBlockingRules() {
  const blockedDomains = await StorageHelper.get('blockedDomains');

  const rule = {
    id: 4321,
    action: { type: "block" },
    condition: {
      urlFilter: "*://*/*",
      domains: blockedDomains
    }
  };

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [4321],
    addRules: [rule]
  });
  
}



