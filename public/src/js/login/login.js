$("#loginform").submit(function (event) {
    event.preventDefault();
    $('.loading-text').hide();
    $('.loading-icon').show();
    
    const email = $("#email").val();
    const password = $("#password").val();

    $("#loginform .form-message").text('');
    changeInpputBorderState("#email", "normal");
    changeInpputBorderState("#password", "normal");

    if (email.length < 1) {
        $("#loginform .form-message").text("Email can't be blank");
        changeInpputBorderState("#email", "error");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    if (password.length < 1) {
        $("#loginform .form-message").text("Password can't be blank");
        changeInpputBorderState("#password", "error");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

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
            // console.log(data, status);
        })
        .fail(function() {
            $("#loginform .form-message").text("Incorrect account or password");
            changeInpputBorderState("#email", "error");
            changeInpputBorderState("#password", "error");
            // console.log('fail');
            $('.loading-text').show();
            $('.loading-icon').hide();
        });
});
$(document).ready(function() {
    if(getUrlParameter('email_verify') && getUrlParameter('email_verify') == 'yes') {
        show_toast('success', 'Thank you! You have successfully verified your email address.', 5000);
    }

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