$("#resetform").submit(function (event) {
    event.preventDefault();
    $('.loading-text').hide();
    $('.loading-icon').show();

    const email = $("#email").val();

    $("#signupform .form-message").text("");

    if (email.length < 1) {
        $("#resetform .form-message").text("Email can't be blank");
        changeInpputBorderState("#email", "error");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    if (email.length > 100) {
        $("#resetform .form-message").text("Email can't be more than 100 characters");
        changeInpputBorderState("#email", "error");
        $('.loading-text').show();
        $('.loading-icon').hide();
        return;
    }

    $.ajax({
        "url": BASE_CONFIG.APP_URL + "/user/resetpassword",
        "method": "POST",
        "contentType": "application/json",
        "dataType" : "json",
        "data": JSON.stringify({
            email: email
    })})
        .done(function(data, status, xhr) {
            cash("#success-modal-preview").modal('show');
            $("#close-success-modal").click(function() {
                window.location.href = 'login';
            });
            return;
        })
        .fail(function(data) {
            $("#resetform .form-message").text("User not found");
            changeInpputBorderState("#email", "error");
            $('.loading-text').show();
            $('.loading-icon').hide();
            return;
        });
});