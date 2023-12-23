const ogGetUserInfo = getUserInfo;
const state = {
    username: '',
    email: '',
    id: '',
    history: [],
    historyPage: 0
};

getUserInfo = () => {
    ogGetUserInfo()
        .then(result => {
            $('#email-address').val(result.email);
            $('#display-name').val(result.username);
            state.id = result.id;
            state.email = result.email;
            state.username = result.username;
            handlePasswordInput();
            handleInfoInput();
        });
    getUserLoginHistory()
    handlePaginationListener();
}

function getUserLoginHistory () {
    const apiConfig = getRequestConfig({
        "url": `${BASE_CONFIG.APP_URL}/user/login`,
        "method": "GET",
    });
    if (!apiConfig.headers['x-access-token']) {
        return;
    }
    $.ajax(apiConfig)
        .done(function(data = {}) {
            const { data: history } = data.data || { data: [] };
            state.history = history;
            renderLoginHistory();
            renderLoginHistoryPagination();
        })
        .fail(function() {
        });
}

function updateInfoButtonStatus() {
    const name = $('#display-name').val();
    const email = $('#email-address').val();
    const disabled = (name == state.username && email == state.email);
    // console.log(state, name, email, disabled);
    $('#change-info').prop('disabled', disabled);
}

function handleInfoInput() {
    $('#display-name').on('input', updateInfoButtonStatus);
    $('#email-address').on('input', updateInfoButtonStatus);
}

function updatePasswordButtonStatus() {
    const oldPassword = $('#old-password');
    const newPassword = $('#new-password');
    const confirmPassword = $('#confirm-new-password');
    const changePasswordButton = $('#change-password');
    changePasswordButton.prop('disabled', (confirmPassword.val() !== newPassword.val()) || !oldPassword.val() || !newPassword.val() || !confirmPassword.val());
}

function handlePasswordInput() {
    const oldPassword = $('#old-password');
    const newPassword = $('#new-password');
    const confirmPassword = $('#confirm-new-password');
    oldPassword.on('input', updatePasswordButtonStatus);
    newPassword.on('input', updatePasswordButtonStatus);
}

function verfiyPasswordMatched() {
    const newPassword = $('#new-password').val();
    const confirmPassword = $('#confirm-new-password').val();
    if (newPassword !== confirmPassword) {
        changeInpputBorderState("#confirm-new-password", "error");
        $(".form-message").text("Password doesn't match");
    } else {
        changeInpputBorderState("#confirm-new-password", "normal");
        $(".form-message").text('');
    }
}

var changeMatchPasswordInterval = null;

$("#confirm-new-password").keyup(function() {
    clearInterval(changeMatchPasswordInterval);

    changeMatchPasswordInterval = setInterval(function() {
        verfiyPasswordMatched();
        updatePasswordButtonStatus();
        clearInterval(changeMatchPasswordInterval)
    }, 1000);
});

$('#change-password').click(function() {
    $('#old-password').val('');
    $('#new-password').val('');
    $('#confirm-new-password').val('');
    updatePasswordButtonStatus();
    show_toast('success', 'Changes saved');
});

$('#change-info').on('click', function() {
    const name = $('#display-name').val();
    const email = $('#email-address').val();
    state.username = name;
    // state.email = email;
    updateUserInfo();
    (state.email !== email) && updateUserEmail(email)
    updateInfoButtonStatus();
    show_toast('success', 'Changes saved');
});

function updateUserInfo() {
    const data = {
        userId: state.id,
        username: state.username
        // email: state.email
    }
    const apiConfig = getRequestConfig({
        "url": BASE_CONFIG.APP_URL + "/user",
        "method": "PUT",
        "data": JSON.stringify(data)
    });
    if (!apiConfig.headers['x-access-token']) {
        return;
    }
    $('#userinfo_username').html(data.username);
    // $('#userinfo_user_email').html(data.email);
    return $.ajax(apiConfig)
}

function updateUserEmail(email) {
    const data = {
        email
    }
    const apiConfig = getRequestConfig({
        "url": BASE_CONFIG.APP_URL + "/user/email",
        "method": "PUT",
        "data": JSON.stringify(data)
    });
    return $.ajax(apiConfig).then(() => {
        getUserInfo && getUserInfo();
    })
}

function renderLoginHistory() {
    const { historyPage, history } = state;
    const perPage = +$('#login-history-per-page').val();
    const fragment = document.createDocumentFragment();
    const startIndex = historyPage * perPage;
    history
        .slice(startIndex, startIndex + perPage)
        .forEach(item => {
            const tr = document.createElement('tr');
            const c = new Date(item.createdAt).toLocaleString(navigator.language, { hour12: false })
            tr.innerHTML = [
                `<td class="overflow-hidden pr-5" style="white-space: nowrap;max-width: 200px;text-overflow: ellipsis;">${item.browser}</td>`,
                `<td class="overflow-hidden pr-5" style="white-space: nowrap;max-width: 275px;text-overflow: ellipsis;">${item.os}</td>`,
                `<td class="overflow-hidden pr-5" style="white-space: nowrap;max-width: 220px;text-overflow: ellipsis;">${item.ip}</td>`,
                `<td class="overflow-hidden pr-5" style="white-space: nowrap;max-width: 170px;text-overflow: ellipsis;">${c}</td>`
            ].join('')
            fragment.appendChild(tr);
        })
    $('#login-history').empty().append(fragment);
}

function renderLoginHistoryPagination() {
    const { historyPage, history } = state;
    const perPage = +$('#login-history-per-page').val();
    const isShowPagination = history.length && ((history.length / perPage) > 1);
    $('#login-history-pagination').toggle(history.length > 5);
    $('#login-history-page-select').toggleClass('opacity-0', !isShowPagination);
    $('#page-left-button').prop('disabled', historyPage <= 0);
    $('#page-right-button').prop('disabled', (historyPage + 1) * perPage >= history.length);
    $('#login-history-page-number').text(historyPage + 1);
}

function handlePaginationListener() {
    $('#login-history-per-page').on('change', function () {
        state.historyPage = 0;
        renderLoginHistory();
        renderLoginHistoryPagination();
    })

    $('#page-left-button').on('click', function () {
        state.historyPage -= 1;
        renderLoginHistory();
        renderLoginHistoryPagination();
    })

    $('#page-right-button').on('click', function () {
        state.historyPage += 1;
        renderLoginHistory();
        renderLoginHistoryPagination();
    })
}