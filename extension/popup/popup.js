document.addEventListener('DOMContentLoaded', () => {
  const reminderList = document.getElementById('reminderList');
  const reminderForm = document.getElementById('reminderForm');
  let currentReminderIndex = null;

  if (reminderForm) {
    reminderForm.addEventListener('submit', handleReminderFormSubmit);
  }

  if (reminderList) {
    displayReminders();
  }

  function handleReminderFormSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const timeInput = document.getElementById('time').value;

    const time = new Date(timeInput).getTime();

    if (isNaN(time) || !isFinite(time)) {
      console.error('Invalid time:', time);
      return;
    }

    chrome.storage.local.get('reminders', (result) => {
      const reminders = result.reminders || [];
      if (currentReminderIndex !== null) {
        reminders[currentReminderIndex] = { title, time, alarmName: `reminder_${time}` };
        currentReminderIndex = null;
      } else {
        reminders.push({ title, time, alarmName: `reminder_${time}` });
      }

      chrome.storage.local.set({ reminders }, () => {
        console.log('Reminder created successfully:', reminders);
        reminderForm.reset();
        displayReminders();
      });
      console.log('Creating alarm with time:', time);
      chrome.alarms.create(`reminder_${time}`, { when: time });
    });
  }

  function displayReminders() {
    chrome.storage.local.get('reminders', (result) => {
      const reminders = result.reminders || [];
      const reminderList = document.getElementById('reminderList');
      reminderList.innerHTML = '';
  
      if (reminders.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No reminders found.';
        emptyMessage.className = 'empty-message';
        reminderList.appendChild(emptyMessage);
      } else {
        reminders.forEach((reminder, index) => {
          const listItem = document.createElement('li');
          listItem.className = 'list-item';
  
          const textContainer = document.createElement('div');
          textContainer.className = 'text-container';
          textContainer.textContent = `${reminder.title}  ‒  ${new Date(reminder.time).toLocaleString()}`;
  
          const buttonsContainer = document.createElement('div');
          buttonsContainer.className = 'buttons-container';
  
          const editButton = createButton('Edit', () => handleEditReminderClick(index, reminder));
          const deleteButton = createButton('Delete', () => handleDeleteReminderClick(index));
  
          editButton.classList.add('action-button');
          deleteButton.classList.add('action-button');
  
          buttonsContainer.appendChild(editButton);
          buttonsContainer.appendChild(deleteButton);
  
          listItem.appendChild(textContainer);
          listItem.appendChild(buttonsContainer);
  
          reminderList.appendChild(listItem);
        });
      }
    });
  }

  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  }

  function handleEditReminderClick(index, reminder) {
    currentReminderIndex = index;
    document.getElementById('title').value = reminder.title;
  
    const reminderTime = new Date(reminder.time);
    const timezoneOffset = reminderTime.getTimezoneOffset() * 60000;
    const adjustedTime = new Date(reminderTime.getTime() - timezoneOffset);
    const formattedTime = adjustedTime.toISOString().slice(0, 16);
    document.getElementById('time').value = formattedTime;
  }
  function handleDeleteReminderClick(index) {
    chrome.storage.local.get('reminders', (result) => {
      const updatedReminders = result.reminders || [];
      updatedReminders.splice(index, 1);
      chrome.storage.local.set({ reminders: updatedReminders }, () => {
        displayReminders();
      });
    });
  }
});




