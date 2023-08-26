chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get("reminders", (result) => {
    if (!chrome.runtime.lastError) {
      const reminders = result.reminders || [];

      for (const reminder of reminders) {
        if (reminder.alarmName === alarm.name) {
          const notificationMessage = `${reminder.title}`;

          chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "Reminder",
            message: notificationMessage,
          });

          console.log("Reminder shown:", notificationMessage);

          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
              console.error("Error querying tabs:", chrome.runtime.lastError);
              return;
            }

            if (tabs && tabs.length > 0) {
              chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "addCustomDiv", reminderTitle: reminder.title },
                (response) => {
                  if (chrome.runtime.lastError) {
                    console.error(
                      "Error sending message:",
                      chrome.runtime.lastError
                    );
                  } else {
                    console.log("Message sent to content script:", response);
                  }
                }
              );
            } else {
              console.error("No active tabs found.");
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
  },
  set: async (key, value) => {
    return new Promise((resolve) => {
      const data = {};
      data[key] = value;
      chrome.storage.local.set(data, () => {
        resolve();
      });
    });
  },
};

chrome.runtime.onInstalled.addListener(() => {
  updateBlockingRules();
});

export async function updateBlockingRules() {
  const blockedDomains = await StorageHelper.get("blockedDomains");

  const rules = blockedDomains.map((domain) => ({
    id: domain.id,
    action: { type: "block" },
    condition: {
      urlFilter: domain.url,
      resourceTypes: ["main_frame"],
    },
  }));

  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: blockedDomains.map((domain) => domain.id),
      addRules: rules,
    },
    () => {
      console.log("Rules updated successfully.");
    }
  );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateRules") {
    updateBlockingRules();
  }
});

export function removeRuleById(ruleId, callback) {
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: [ruleId],
    },
    callback
  );
}

export function getRuleIdByUrl(url, blockedDomains) {
  const domain = blockedDomains.find((domain) => domain.url === url);
  return domain ? domain.id : null;
}
