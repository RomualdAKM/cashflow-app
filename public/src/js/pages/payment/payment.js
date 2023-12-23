var selectedPlan = {};

var priceMap = {
    'growth_month': 14370,
    'starter_month': 8370,
    'growth_year': 12210,
    'starter_year': 7110
}

var paymentState = {
    paymentType: 1,
    name: '',
    phone: '',
    email: '',
    uniformInvoiceNumbers: '',
    agreePolicy: false,
    canGetPrime: false
}

function initTapPaySDK() {
    TPDirect.setupSDK(12005, 'app_InhPb6oISSVynEzXfqBeDHLyolh0DkehiWci937VpXLYLsHSL98XOGfsSYAN', 'production');
    TPDirect.card.setup({
      fields: {
        number: {
            element: '#credit-card-number',
            placeholder: 'Card number'
        },
        expirationDate: {
            element: '#credit-card-date',
            placeholder: 'MM/YY'
        },
        ccv: {
            element: '#credit-card-cvc',
            placeholder: 'CVC'
        }
      },
      styles: {
          'input': {
            'color': 'black',
            'font-size': '14px',
            'font-family': 'Avenir',
            '-webkit-font-smoothing': 'antialiased'
          },
          '::placeholder': {
            'color': '#b7b7b7',
            'font-size': '14px',
            'font-family': 'Avenir',
            '-webkit-font-smoothing': 'antialiased'
          },
          '.valid': {
            'color': 'black'
          },
          '.invalid': {
            'color': 'red'
          },
      },
    });
  
    TPDirect.card.onUpdate(function (update) {
        paymentState.canGetPrime = update.canGetPrime;
        renderSubmitButton();
    })
}

var periodMap = {
    month: 'monthly',
    year: 'annually'
}

var userCreditCardPhone = document.querySelector('#user-credit-card-phone');

var itiUserCreditCardPhone = intlTelInput(userCreditCardPhone, {
    preferredCountries: ['tw', 'us'],
});

function priceFormatting (price = 0) {
    const priceStrs = [...`${price}`]
    priceStrs.reverse();
    return priceStrs.reduce((prev, curr, index) => {
        return index > 0 && index % 3 === 0 ? `${curr},${prev}` : `${curr}${prev}`
    }, '')
}

$('.tab-button').on('change', function () {
    convertPlan([selectedPlan.plan, this.id].join('_'));
    $('#change-plan-price').text(`NT$ ${priceFormatting(Math.floor(selectedPlan.price))}`); // 選擇方案價格
    $('#total').text(`NT$ ${priceFormatting(Math.floor(selectedPlan.total))}`); // 選擇方案總價格
    if (this.id === 'year') {
        $('#payment-method-line-pay').toggle(false);
        $('label[for=payment-method-line-pay]').toggle(false);
        $('#payment-method-credit-card').prop('checked', true).trigger('change');
    } else {
        $('#payment-method-line-pay').toggle(true);
        $('label[for=payment-method-line-pay]').toggle(true);
    }
})

$('input[name=method]').on('change', function () {
    const isCreidtCard = this.value === 'credit-card';
    $('.card-info').toggle(isCreidtCard);
    paymentState.paymentType = isCreidtCard ? 1 : 0;
    renderSubmitButton();
});

$('#payment-submit').on('click', function() {
    $(this).find('.submit-text').toggle(false);
    $(this).find('.loading-icon').toggle(true);
    $(this).prop('disabled', true);
    if (paymentState.paymentType === 0) {
      TPDirect.linePay.getPrime(function(result){
        tapPayPaymentApi(result.prime);
      });
    } else if (paymentState.paymentType === 1) {
      TPDirect.card.getPrime((result) => {
        tapPayPaymentApi(result.card.prime);
      })
    }
})

$('#linepay-submit').on('click', function() {
    const { link } = this.dataset;
    if (link) {
        TPDirect.redirect(link);
    }
})

function getUserInfo() {
    const apiConfig = getRequestConfig({
      url: BASE_CONFIG.APP_URL + '/user',
    });
    return $.ajax(apiConfig)
        .done(function(data = {}) {
            const { id, planPeriod, planId, planStartAt, planEndAt } = data
            if (id) {
                const userInfo = {
                    plan: planId,
                    period: planPeriod,
                    price: priceMap[`${planId}_${planPeriod}`] || 0
                }
                const isPlanValid = planEndAt && (new Date(planEndAt) > new Date())
                const isFreeTrial = planId === 'growth' && planPeriod === 'none' && isPlanValid
                $('.payment').toggleClass('not-logged-in', false);
                $('.payment').toggleClass('logged-in', true);
                $('#current-period').text(periodMap[isFreeTrial ? 'month' : userInfo.period]); // 目前方案週期
                if (isFreeTrial) {
                    $('#current-plan').css('white-space', 'nowrap').text('Growth (14-Day Free Trial）'); // 目前方案類型
                    $('#current-plan-price').toggle(false); // 目前方案價格
                    $('#current-plan-price-period').toggle(false);
                } else {
                    $('#current-plan').text(userInfo.period === 'none' ? 'free' : userInfo.plan); // 目前方案類型
                    $('#current-plan-price').text(`NT$ ${priceFormatting(Math.floor(userInfo.price))}`); // 目前方案價格
                }
                $('#change-plan').text(selectedPlan.plan); // 選擇方案
                $('#change-plan-price').text(`$${Math.floor(selectedPlan.price)}`); // 選擇方案價格
                $(`#${selectedPlan.plan}-usage`).toggle(); // 選擇方案內容說明
                $(`#total`).text(`$ ${Math.floor(selectedPlan.total)}`); // 選擇方案總價格

                const isCurrentPlan = selectedPlan.plan === userInfo.plan; // 是否相同方案類型 starter, growth
                const isDisableMonthly = isCurrentPlan && userInfo.period === 'month'; // 相同方案類型無法選擇相同週期選項 
                const isDisableAnnually = isCurrentPlan && userInfo.period === 'year';
                $('#month').prop('disabled', isDisableMonthly);
                $('#year').prop('disabled', isDisableAnnually);
                $(`#${selectedPlan.period}`).prop('checked', true).trigger('change');
            }
        })
}

function tapPayPaymentApi(prime) {
    const params = new URLSearchParams(window.location.search);
    const [planId] = params.get('plan').split('_');
    const period = $('.tab-button:checked').attr('id');
    const apiConfig = getRequestConfig({
        method: 'POST',
        url: BASE_CONFIG.APP_URL + '/payment',
        data: JSON.stringify({
            payType: 'tappay',
            phone: paymentState.phone,
            name: paymentState.name,
            email: paymentState.email,
            prime, // tappay prime
            invoiceTitle: '',
            invoiceAddress: '',
            uniformInvoiceNumbers: paymentState.uniformInvoiceNumbers || undefined,
            paymentType: paymentState.paymentType, //0: line、1: 信用卡
            invoiceType: paymentState.uniformInvoiceNumbers ? 1 : 0, // 發票類型 0: 二聯式、1: 三聯式
            products: [[planId, 1]], // planId, 1 是數量，目前寫死，備註: 為了相容多商品，是陣列中的陣列哦
            period, // 付費週期 month、year
        })
    });

    return $.ajax(apiConfig)
        .done(function(response) {
            if (paymentState.paymentType === 1) {
                $('#payment-submit').find('.submit-text').toggle(true);
                $('#payment-submit').find('.loading-icon').toggle(false);
                $('#payment-submit').prop('disabled', false);
                TPDirect.redirect(response.payment_url)
            } else {
                $('#payment-submit').find('.submit-text').toggle(true);
                $('#payment-submit').find('.loading-icon').toggle(false);
                $('#payment-submit').prop('disabled', false);
                $('#linepay-submit').attr('data-link', response.payment_url)
                cash('#linepay-redirect').modal('show');
            }
        })
        .catch(function() {
            $('#payment-submit').find('.submit-text').toggle(true);
            $('#payment-submit').find('.loading-icon').toggle(false);
            $('#payment-submit').prop('disabled', false);
        })
}

function convertPlan (id = '') {
    const [plan, period] = id.split('_'); // starter_month
    selectedPlan = {
        id,
        plan,
        period,
        price: priceMap[id],
        total: priceMap[id] * (['year'].includes(period) ? 12 : 1)
    };
}

function renderSubmitButton () {
    const { canGetPrime, name, email, phone, agreePolicy } = paymentState
    const buttonValid = paymentState.paymentType === 1
        ? [canGetPrime, name, email, phone, agreePolicy].every(Boolean)
        : [name, email, phone, agreePolicy].every(Boolean)
    $('#payment-submit').prop('disabled', !buttonValid);
}

jQuery(function() {
    const params = new URLSearchParams(window.location.search);
    initTapPaySDK();
    convertPlan(params.get('plan'));
    getUserInfo();
    renderSubmitButton();
    $('#user-credit-card-name').on('input', function () {
        paymentState.name = this.value;
        renderSubmitButton();
    });

    $('#user-credit-card-phone').on('input', function () {
        paymentState.phone = this.value;
        renderSubmitButton();
    });

    $('#user-credit-card-email').on('input', function () {
        paymentState.email = this.value;
        renderSubmitButton();
    });

    $('#user-tax-id-number').on('input', function () {
        paymentState.uniformInvoiceNumbers = this.value;
        renderSubmitButton();
    });

    $('#agree-user-credit-card-terms').on('change', function () {
        paymentState.agreePolicy = this.checked;
        renderSubmitButton();
    });
});
