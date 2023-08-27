const StorageHelper = {
  get: async (key) => {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        const data = result[key] || [];
        console.log(`Data retrieved for ${key}:`, data);
        resolve(data);
      });
    });
  },

  set: async (key, value) => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        console.log(`${key} set in storage.`);
        resolve();
      });
    });
  },
};

export default StorageHelper;
