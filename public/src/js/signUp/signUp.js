$("#signupform").submit(function (event) {
    event.preventDefault();
    $('.loading-text').hide();
    $('.loading-icon').show();

    $("#signupform .form-message").text("");
    changeInpputBorderState("#signupform .login__input", "normal");

    const display_name = $("#display_name").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const password_confirmation = $("#password_confirmation").val();
    const agree = $("#agree-terms").is(":checked");

    if (display_name.length < 1) {
        changeInpputBorderState("#display_name", "error");
        $("#signupform .form-message").text("Display Name can't be blank");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    if (display_name.length > 50) {
        changeInpputBorderState("#display_name", "error");
        $("#signupform .form-message").text("Display Name can't be more than 50 characters");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    if (email.length < 1) {
        changeInpputBorderState("#email", "error");
        $("#signupform .form-message").text("Email can't be blank");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    if (email.length > 100) {
        changeInpputBorderState("#email", "error");
        $("#signupform .form-message").text("Email can't be more than 100 characters");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    if (password.length < 8) {
        changeInpputBorderState("#password", "error");
        $("#signupform .form-message").text("Password should be at least 8 characters");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    if (password != password_confirmation) {
        changeInpputBorderState("#password", "error");
        $("#signupform .form-message").text("Password doesn't match");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    if (! agree) {
        $("#signupform .form-message").text("Please agree to Terms and Privacy Policy.");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    $.ajax({
        "url": BASE_CONFIG.APP_URL + "/user",
        "method": "POST",
        "contentType": "application/json",
        "dataType" : "json",
        "data": JSON.stringify({
            email: email,
            username: display_name,
            password: password,
            checkPassword: password_confirmation,
            termsOfUseAgreedAt: + new Date(),
            privacyPolicyAgreedAt: + new Date()
    })})
        .done(function(data, status, xhr) {
            $.ajax({
                "url": BASE_CONFIG.APP_URL + "/user/signin",
                "method": "POST",
                "contentType": "application/json",
                "dataType" : "json",
                "data": JSON.stringify({
                    email: email,
                    password: password,
            })})
                .done(function(data, status, xhr) {
                    let token = xhr.getResponseHeader("x-access-token");

                    if (token) {
                        localStorage.setItem("token", token);
                        localStorage.setItem("email", data.email);
                        localStorage.setItem("username", data.username);
                        localStorage.setItem("userId", data.id);
                        
                        window.location.href = './';
                    }
                });
        })
        .fail(function(data) {
            if (data.responseJSON.message) {
                // $("#fail-modal-message").html(data.responseJSON.message);
                cash("#fail-modal-preview").modal('show');
            }
            $('.loading-text').show();
            $('.loading-icon').hide();
        });
});

jQuery(function() {
    const apiConfig = getRequestConfig({
        url: BASE_CONFIG.APP_URL + '/user',
    });
    // console.log(apiConfig);
    if (apiConfig.headers['x-access-token']) {
        $.ajax(apiConfig)
            .done(function(data) {
                $('#user-email-text').html(data.email);
                $('.redirect-form').show();
            })
            .fail(function(data) {
                $('.landing-form').show();
            });
    } else {
        $('.landing-form').show();
    }

    $('.js-password-validation').passwordValidation({
        validations: [
        /^.{8,}/,               // Validate: atleast 8 characters
        /[A-Z]+/,               // Validate: atleast one capital letter
        /\d+/,                  // Validate: atleast one number
        /[\!\@#\$%\^&\*]+/      // Validate: atleast one special character
        ]
    });

    $('#signupform input').on('input', function() {
        updateButtonStatus();
    });

    AppleID.auth.init({
        clientId : 'dashboard.imkitadmin',
        scope : 'name email',
        redirectURI : `https://${window.location.host}/login`,
        state : 'register',
        nonce : 'register',
        usePopup : true
    });
    async function signInApple() {
        // console.log('signInApple');
        const data = await AppleID.auth.signIn().then(function(response) {
            // console.log("response", response);
            registerByApple(response)
        }, function(err) {
            // console.log('err', err);
        });
    }
      
    const buttonElement = document.getElementById('appleid-signin-btn');
    buttonElement.addEventListener('click', function (event) {
        try {
            event.preventDefault();
            // console.log('click')
            signInApple();
        } catch (error) {
            // console.log(error)
            throw error
        }
    });
    function registerByApple(data) {
        var payload = { token: data.authorization.id_token };
      
        var registerSettings = {
          "url": BASE_CONFIG.APP_URL + "/user/apple",
          "method": "POST",
          "contentType": "application/json",
          "dataType" : "json",
          "data": JSON.stringify(payload),
        };
      
        $.ajax(registerSettings).done(function(data, status, xhr) {
            let token = xhr.getResponseHeader("x-access-token");
      
            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("email", data.email);
                localStorage.setItem("username", data.username);
                localStorage.setItem("userId", data.id);
                
            }
            window.location.href = './';
        })
    }
});
(function ($) {
  $.fn.passwordValidation = function (options) {
    var settings = $.extend({
        validClass: 'is-valid-format',
        invalidClass: 'is-invalid-format',
        validationContainer: '#js-password-validation-container',
        validations: []
    }, options);

    function updateList(index, valid)
    {
      var list = settings.validationContainer;

      if (valid) 
      {
        $(list).find('li').eq(index)
        .removeClass(settings.invalidClass).addClass(settings.validClass);
      } 
      else {
        $(list).find('li').eq(index)
        .removeClass(settings.validClass).addClass(settings.invalidClass);
      }
    }

    return $(this).keyup(function(){

      var pswd = $(this).val();
      var list = settings.validationContainer;

      for (var i = 0; i < settings.validations.length; i++)
      {
        updateList(i, settings.validations[i].test(pswd));
      }
      if ($('#js-password-validation-container .is-invalid-format').length > 0) {
          $('.password_validation_rule_text').show();
          $('.password_validation_rule_passed_text').hide();
      } else {
          $('.password_validation_rule_text').hide();
          $('.password_validation_rule_passed_text').show();
      }
    });
  };
}(jQuery));
function updateButtonStatus() {
    const submitButton = $('#submit_button');
    const display_name = $('#display_name').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const password_confirmation = $('#password_confirmation').val();
    let notEmpty = Boolean(display_name && email && password && password_confirmation);
    let equalPassword = Boolean(password === password_confirmation);
    let rulePassed = Boolean($('#js-password-validation-container .is-invalid-format').length < 1);
    // console.log(notEmpty, equalPassword, rulePassed);
    submitButton.prop('disabled', !(notEmpty && equalPassword && rulePassed));
}