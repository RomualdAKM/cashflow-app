function changeInpputBorderState(selector, state) {
  let styles = {
    "normal": "border-gray-300",
    "error": "border-theme-6"
  };
  for (style in styles) {
    $(selector).removeClass(styles[style]);
  }
  $(selector).addClass(styles[state]);
}
function userLogout() {
  let token = localStorage.getItem("token");
  $.ajax({
    "url": BASE_CONFIG.APP_URL + "/user/logout",
    "method": "POST",
    "contentType": "application/json",
    "dataType" : "json",
    "headers": {
      "x-access-token": token
    }
  })
    .done(function(data, status, xhr) {
      // console.log(data);
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");

      window.location.href = 'login';
      return;
    })
    .fail(function(data) {
      window.location.href = 'login';
      // console.log(data);
    });
  
}
function appendLogoutModal() {
  let modal = `<div class="modal" id="logout-modal">
                <div class="modal__content">
                  <div class="p-5 text-center">
                      <img src="src/images/heartbroken_icon.png" class="custom-modal-icon">
                      <div class="text-3xl mt-3">Are you sure?</div> 
                      <div class="text-gray-600 mt-2" id="fail-modal-message">Do you really want to log out?</div>
                  </div>
                  <div class="px-5 pb-8 text-center">
                      <button type="button" data-dismiss="modal" class="button w-24 border text-gray-700 mr-1">Cancel</button>
                      <button id="logout-confirm-button" type="button" class="button w-24 bg-theme-1 text-white">Log out</button>
                  </div>
                </div>
              </div>`;
  $('body').append(modal);
  $('body').append('<img src="src/images/gray_no_wifi.png" style="display:none">');

  $('#user-logout').on('click', function() {
    cash('#logout-modal').modal('show');
  });
  $('#logout-confirm-button').on('click', function() {
    userLogout();
  });
}
function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
}

function checkDevice() {
  $('.device-suggestion').toggleClass('hidden', !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/));
}

function getRequestConfig(config) {
  let token = localStorage.getItem('token');
  return {
    "method": "GET",
    "contentType": "application/json",
    "dataType" : "json",
    "headers": { "x-access-token": token },
    ...config,
  };
}

function show_toast(type, message, duration=2500, close=false) {
  let icon = '';
  if (type === 'success')
    icon = '<img src="src/images/check_icon_green.png">';
  else if (type === 'wifi')
    icon = `
      <svg style="width: 24px; height: 24px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#66C35A" x="0px" y="0px" viewBox="0 0 494.45 494.45" style="enable-background:new 0 0 494.45 494.45;" xml:space="preserve">
      <g><g>
        <g><path d="M395.225,277.325c-6.8,0-13.5-2.6-18.7-7.8c-71.4-71.3-187.4-71.3-258.8,0c-10.3,10.3-27.1,10.3-37.4,0s-10.3-27.1,0-37.4c92-92,241.6-92,333.6,0c10.3,10.3,10.3,27.1,0,37.4C408.725,274.725,401.925,277.325,395.225,277.325z"/></g>
        <g><path d="M323.625,348.825c-6.8,0-13.5-2.6-18.7-7.8c-15.4-15.4-36-23.9-57.8-23.9s-42.4,8.5-57.8,23.9c-10.3,10.3-27.1,10.3-37.4,0c-10.3-10.3-10.3-27.1,0-37.4c25.4-25.4,59.2-39.4,95.2-39.4s69.8,14,95.2,39.5c10.3,10.3,10.3,27.1,0,37.4C337.225,346.225,330.425,348.825,323.625,348.825z"/></g>
        <g><circle cx="247.125" cy="398.925" r="35.3"/></g>
        <g><path d="M467.925,204.625c-6.8,0-13.5-2.6-18.7-7.8c-111.5-111.4-292.7-111.4-404.1,0c-10.3,10.3-27.1,10.3-37.4,0s-10.3-27.1,0-37.4c64-64,149-99.2,239.5-99.2s175.5,35.2,239.5,99.2c10.3,10.3,10.3,27.1,0,37.4C481.425,202.025,474.625,204.625,467.925,204.625z"/></g>
      </g></g>
      </svg>
    `;
  else if (type === 'nowifi')
    icon = `
      <svg width="24px" height="24px" fill="#989898" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m1.293 8.395 1.414 1.414c.504-.504 1.052-.95 1.622-1.359L2.9 7.021c-.56.422-1.104.87-1.607 1.374zM6.474 5.06 3.707 2.293 2.293 3.707l18 18 1.414-1.414-5.012-5.012.976-.975a7.86 7.86 0 0 0-4.099-2.148L11.294 9.88c2.789-.191 5.649.748 7.729 2.827l1.414-1.414c-2.898-2.899-7.061-3.936-10.888-3.158L8.024 6.61A13.366 13.366 0 0 1 12 6c3.537 0 6.837 1.353 9.293 3.809l1.414-1.414C19.874 5.561 16.071 4 12 4a15.198 15.198 0 0 0-5.526 1.06zm-2.911 6.233 1.414 1.414a9.563 9.563 0 0 1 2.058-1.551L5.576 9.697c-.717.451-1.395.979-2.013 1.596zm2.766 3.014 1.414 1.414c.692-.692 1.535-1.151 2.429-1.428l-1.557-1.557a7.76 7.76 0 0 0-2.286 1.571zm7.66 3.803-2.1-2.1a1.996 1.996 0 1 0 2.1 2.1z"/></svg>
    `;

  cash.Toastify({
    node: cash(
      `<div class="toast-content">${icon}<div>${message}</div></div>`
    )[0],
    duration,
    newWindow: true,
    close,
    gravity: "bottom",
    position: "left",
    backgroundColor: "#0e2c88",
    stopOnFocus: true
  }).showToast();
}

function detectInternetConnection() {
  var isOnline = true;
  setInterval(function(){
      if(!isOnline && navigator.onLine){
          isOnline = true;
          $('.toastify').remove();
          show_toast('wifi', 'Your internet connection was restored.', 5000, true);
      }
      else if(isOnline && !navigator.onLine){
          isOnline = false;
          $('.toastify').remove();
          show_toast('nowifi', 'You are currently offline.', -1, true);
      }
  }, 1000);
}

$(document).ready(function() {
  appendLogoutModal();
  checkDevice();
  detectInternetConnection();
});
