var state = {}

$('.tab-button').on('change', function () {
    const selectPlan = this.id
    const plans = ['starter', 'growth'];
    const periods = ['month', 'year'];
    const tabs = ['month', 'year'];

    plans.flatMap(plan => periods.map(period => `.${plan}-${period}`))
        .flatMap(planPeriod => tabs.map(tab => `${planPeriod}--${tab}`))
        .forEach(clx => {
            $(clx).toggle(false);
        })
    
    $('.free-none--year').toggle(false);
    $('.free-none--month').toggle(false);
    $('.period-month').toggle(false);
    $('.period-year').toggle(false);
    $(`.period-${selectPlan}`).toggle(true);
    $(`.${state.planId}-${state.planPeriod}--${selectPlan}`).toggle(true);
})

function getUserInfo() {
    const apiConfig = getRequestConfig({
      url: BASE_CONFIG.APP_URL + '/user',
    });
    return $.ajax(apiConfig)
        .done(function(data = {}) {
            let { id, planPeriod, planId } = data
            planPeriod = planPeriod === '' ? 'none' : planPeriod;
            Object.assign(state, { id, planPeriod, planId })
            if (id) {
                if (planPeriod === 'none') {
                    state.planId = 'free'
                }
                $('.guest').toggle(false);
                $('.user').toggle(true);
                const currentPeriod = $('.tab-button:checked').attr('id');
                $(`.${state.planId}-${planPeriod}--${currentPeriod}`).toggle(true);
                console.log(`.${state.planId}-${planPeriod}--${currentPeriod}`);
            }
        })
        .catch(() => {
            $('.guest').toggle(true);
            $('.user').toggle(false);
        })
}

jQuery(function() {
    getUserInfo();
});
