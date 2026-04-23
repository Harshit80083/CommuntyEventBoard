// helper functions for the frontend

// check if a string is empty
function isEmpty(str) {
  if (!str || str.trim() === '') {
    return true;
  }
  return false;
}

// format date for display
function formatDate(dateStr) {
  let parts = dateStr.split('-');
  let year = parts[0];
  let month = parts[1];
  let day = parts[2];
  return month + '/' + day + '/' + year;
}

// log to console with label
function logInfo(label, data) {
  console.log('[' + label + ']', data);
}
