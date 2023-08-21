chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'addCustomDiv') {
    const reminderTitle = message.reminderTitle;
    const customDiv = document.createElement('div');
    customDiv.className = 'custom-div'; 

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', () => {
      customDiv.remove();
    });

    // div styles
    customDiv.textContent = `Reminder: ${reminderTitle}`;
    customDiv.style.backgroundColor = "#000000";
    customDiv.style.padding = "10px";
    customDiv.style.position = "fixed";
    customDiv.style.top = "10px";
    customDiv.style.right = "10px";
    customDiv.style.zIndex = "9999";
    customDiv.style.color = "#f0f0f0";
    customDiv.style.borderRadius = "5px";
    customDiv.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";

    //button styles
    closeButton.style.backgroundColor = "#000000";
    closeButton.style.color = "#f0f0f0";
    closeButton.style.border = "none";
    closeButton.style.margin = "40px 30px 0px 0px";
    closeButton.style.padding = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "11px";

    customDiv.appendChild(closeButton);
    document.body.appendChild(customDiv);

    console.log('Custom div element added:', customDiv.textContent);
  }
});