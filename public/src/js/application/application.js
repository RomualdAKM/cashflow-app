var state = {}

function getApplications () {
    const apiConfig = getRequestConfig({
        "url": BASE_CONFIG.APP_URL + "/application",
        "method": "GET",
    });
    if (!apiConfig.headers['x-access-token']) {
        return;
    }
    $.ajax(apiConfig)
        .done(function(data, status, xhr) {
            renderApplications(data);
        })
        .fail(function() {
        });
}

function startApplication (id) {
    const apiStartAppConfig = getRequestConfig({
        "url": BASE_CONFIG.APP_URL + "/application/" + id + "/start",
        "method": "PUT",
        "data": JSON.stringify({ userId: state.id })
    });
    return $.ajax(apiStartAppConfig)
}

function checkApplicationTitle (title) {
    const apiCheckTitleConfig = getRequestConfig({
        "url": BASE_CONFIG.APP_URL + "/application/checkTitle",
        "method": "POST",
        "data": JSON.stringify({ title })
    });
    if (!/^[a-zA-Z0-9]+$/.test(title)) {
        return Promise.resolve({ err: 'Application name should only include English letters or numbers.' });
    }

    return new Promise(resolve => {
        try {
            $.ajax(apiCheckTitleConfig)
                .done(function (result) {
                    if (result.RC === 0) {
                        resolve({});
                    } else {
                        resolve({ err: 'This name has already been used. Please try another one.' });
                    }
                })
        } catch (err) {
            resolve({ err });
        }
    });
}

function createApplication (title) {
    const apiCreateConfig = getRequestConfig({
        "url": BASE_CONFIG.APP_URL + "/application",
        "method": "POST",
        "data": JSON.stringify({
            CPU: 1,
            clientNum: 1200,
            dashboard: 'basic',
            fileUpload: null,
            push: false,
            richSDK: true,
            title,
        })
    });
    return new Promise((resolve) => {
        $.ajax(apiCreateConfig)
            .done(app => {
                renderApplications([app]);
                startApplication(app.id);
                resolve({ success: true });
            })
            .fail(error => {
                cash('#try-again').modal('show');
                resolve({ success: false });
            })
    })
}

function renderApplications (apps = []) {
    const targetTable = document.querySelector("#applications");
    const appTmpl = document.querySelector('#app-item');
    const appTmplTitle = appTmpl.content.querySelector('.app-title');
    const appTmplMode = appTmpl.content.querySelector('.app-mode');
    const appTmplCreatedAt = appTmpl.content.querySelector('.app-createdAt');
    const appTmplDetail = appTmpl.content.querySelector('.app-detail');
    const appTmpId = appTmpl.content.querySelector('.application-id');
    apps.forEach(app => {
        const createAt = new Date(app.createdAt).toLocaleString(navigator.language, { hour12: false })
        appTmpId.value = app.id;
        appTmplTitle.textContent = app.title;
        appTmplMode.textContent = app.mode || 'Sandbox';
        appTmplCreatedAt.textContent = createAt;
        appTmplDetail.href = `index_detail?id=${app.id}`;
        targetTable.prepend(document.importNode(appTmpl.content, true));
    });
    feather.replace();
    $('.application-list').on('click', function () {
        window.location.href = $(this).find('.app-detail').attr('href');
    })
    const appLength = $('.application-list').length;
    $('#add-app').toggleClass('pointer-events-none', appLength >= 10)
    $('#section-search').toggle(appLength > 0);
    $('#section-applications').toggle(appLength > 0);
    $('#apps-count').text(appLength);
}

function renderCurrentPlan () {
    const { planId = 'free', planPeriod, mau, maxMAU, planStartAt, planEndAt } = state
    const isFreePlan = planId === 'free';
    const endDate = new Date(planEndAt);
    const today = new Date();
    const periodMap = {
        month: 'Monthly payment',
        annual: 'Annually payment',
        none: '14-Day Free Trial'
    }
    $('.plan-unsubscribed').toggle(isFreePlan || today > endDate);
    if (!isFreePlan && endDate > today) {
        $('#plan-id').text(planId);
        $('#plan-status').text(`(${periodMap[planPeriod]})`);
    }
    if (planStartAt && planEndAt) {
        const startAt = new Date(planStartAt).toLocaleDateString(navigator.language, { hour12: false });
        const endAt = new Date(planEndAt).toLocaleDateString(navigator.language, { hour12: false });
        $('#plan-duration').text(`${startAt} - ${endAt}`);
    }
    if (today > endDate) {
        const endAt = new Date(planEndAt).toLocaleDateString(navigator.language, { hour12: false });
        $('#plan-duration').css('color', '#e2574c');
        window.tippy('img.plan-unsubscribed',
            {
                appendTo: 'parent',
                content: `Your 14-Day Free Trial has ended on <span style="color: #e2574c;">${endAt}</span>. Please upgrade your plan to continue using IMKIT service.`,
                placement: 'bottom',
                allowHTML: true
            }
        )
    }
    $('.mau__value').width(`${100 * mau / Math.max(maxMAU, 1)}%`);
    $('.mau__current').text(mau).toggle(mau > 0);
    $('.mau__max').text(`${maxMAU / 1000}K`);
}

const ogGetUserInfo = getUserInfo;
getUserInfo = () => {
    getApplications();
    ogGetUserInfo()
        .then(result => {
            Object.assign(state, result);
            renderCurrentPlan();
        });
}

jQuery(function () {
    $('#search_application').on('input', function() {
        const query = $(this).val().toLowerCase();
        if (query) {
            $('.application-list').hide();
            $('.app-title').each(function() {
                if ($(this).text().toLowerCase().indexOf(query) > -1) {
                    $(this).closest('.application-list').show();
                }
            });

        } else {
            $('.application-list').show();
        }
    });
    const message = getUrlParameter('message');
    if (message) {
        if (message === 'application_delete') {
            show_toast('success', 'Application deleted');
            window.history.pushState('', '', window.location.origin + window.location.pathname);
        }
    }
});
