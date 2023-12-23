function getUserInfo() {
  const apiConfig = getRequestConfig({
    url: BASE_CONFIG.APP_URL + '/user',
  });
  return new Promise((resolve, reject) => {
    if (!apiConfig.headers['x-access-token']) {
      window.location.href = 'login';
      reject();
    }
    $.ajax(apiConfig)
      .done(function(data) {
        $('.fixed-top-notification').remove()
        const notification = `
          <div class="fixed-top-notification fixed-top-notification-info flex" style="justify-content:center;align-items:center">
            <img src="src/images/alert_icon.png">
            Please finish confirming your email address. Did not get the verification email? 
            <button id="resend-email-btn" class="button inline-block bg-theme-1 text-white">Resend</button>
          </div>
        `;
        const changeEmailNotification = `
          <div class="fixed-top-notification fixed-top-notification-info flex" style="justify-content:center;align-items:center">
            <img src="src/images/alert_icon.png">
            Please confirm your new email address ${data.newEmail}. Did not get the verification email?
            <button id="resend-email-btn" class="button inline-block bg-theme-1 text-white">Resend</button>
          </div>
        `;
        if (!data.emailVerify) {
          data.newEmail ? $('body').prepend(changeEmailNotification) : $('body').prepend(notification);
          data.newEmail ? $('#resend-email-btn').on('click', () => resendUpdateEmail(data.newEmail)) : $('#resend-email-btn').on('click', resendEmail);
          // window.location.href = '/email_verify_notice.html?email=' + data.email;
        }
        $('.section-placeholder--loading').toggle(false);
        $('.section-placeholder--done').toggle(true);
        $('#site-loading').hide();
        $('#userinfo_username')
          .html(data.username)
          .parent()
          .on('click', function () {
            window.location.href = 'account';
          })
        $('#userinfo_user_email').html(data.email);
        resolve(data);
      })
      .fail(function(data) {
        window.location.href = 'login';
        resolve(data);
      })
  });
}

jQuery(function() {
  getUserInfo();
});

function resendEmail() {
  let token = localStorage.getItem('token');
  $.ajax({
    "url": BASE_CONFIG.APP_URL + "/user/resend",
    "method": "POST",
    "contentType": "application/json",
    "dataType" : "json",
    "headers": {
        "x-access-token": token
    }
  })
    .done(function(data, status, xhr) {
        show_toast('success', 'Email sent!', 3000);
        // console.log(data);
    })
    .fail(function(data) {
        // console.log(data);
    });
}

function resendUpdateEmail(email) {
  let token = localStorage.getItem('token');
  $.ajax({
    "url": BASE_CONFIG.APP_URL + "/user/email",
    "method": "PUT",
    "contentType": "application/json",
    "dataType" : "json",
    "headers": {
        "x-access-token": token
    },
    data: JSON.stringify({ email })
  })
    .done(function(data, status, xhr) {
        show_toast('success', 'Email sent!', 3000);
        // console.log(data);
    })
    .fail(function(data) {
        // console.log(data);
    });
}
