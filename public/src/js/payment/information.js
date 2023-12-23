var linePayPhone = document.querySelector('#line-pay-phone');
var creditCardPhone = document.querySelector('#credit-card-phone');
var userCreditCardPhone = document.querySelector('#user-credit-card-phone');
var paymentPhone = document.querySelector('#payment-phone');
var state = {};


var priceMap = {
    'month_growth': 14370,
    'month_starter': 8370,
    'year_growth': 12210,
    'year_starter': 7110,
    'growth_month': 14370,
    'starter_month': 8370,
    'growth_year': 12210,
    'starter_year': 7110
}

// var itiLinePayPhone = intlTelInput(linePayPhone, {
//     preferredCountries: ['tw', 'us'],
// });

// var itiCreditCardPhone = intlTelInput(creditCardPhone, {
//     preferredCountries: ['tw', 'us'],
// });

var itiUserCreditCardPhone = intlTelInput(userCreditCardPhone, {
    preferredCountries: ['tw', 'us'],
});

var itiPaymentPhone = intlTelInput(paymentPhone, {
    preferredCountries: ['tw', 'us'],
});

function initTapPaySDK() {
    TPDirect.setupSDK(12005, 'app_InhPb6oISSVynEzXfqBeDHLyolh0DkehiWci937VpXLYLsHSL98XOGfsSYAN', 'production')
    TPDirect.card.setup({
        fields: {
            number: {
                // element: '#payment-credit-card-number',
                element: document.getElementById('payment-credit-card-number'),
                placeholder: '**** **** **** ****'
            },
            expirationDate: {
                // element: '#payment-credit-card-date',
                element: document.getElementById('payment-credit-card-date'),
                placeholder: 'MM / YY'
            },
            ccv: {
                // element: '#payment-credit-card-cvc',
                element: document.getElementById('payment-credit-card-cvc'),
                placeholder: 'ccv'
            }
        },
        styles: {
            'input': {
                'color': 'initial'
            },
            '::placeholder': {
                'color': '#bcbdbd'
            },
            '.valid': {
                'color': 'initial'
            },
            '.invalid': {
                'color': 'red'
            },
        },
    });

    TPDirect.card.onUpdate(function (update) {
        updatePaymentButtonState(update.canGetPrime)
    })
}

function validCreditCardNumber(num) {
    let result = {
        valid: false,
        company: ''
    };

    if (num.length !== 16)
        return result;
    
    if (num[0] == 5)
        result.company = 'Master';
    if (num[0] == 4)
        result.company = 'VISA';
    if (num[0] == 3)
        result.company = 'JCB';
    
    let total = 0;

    for (let i = 0; i < (num.length - 1); i++) {
        let value = 0;
        if (i%2 === 0) {
            value = +num[i] * 2;
            if (value >= 10)
                value -= 9;
        } else {
            value = +num[i];
        }
        total += +value;
    }

    if (total % 10 !== 0)
        result.valid = +num[num.length - 1] === (10 - total % 10);
    else
        result.valid = +num[num.length - 1] === 0;


    return result;
}
function checkCreditCardFormFilled() {
    if (
        $('#user-credit-card-number').val() &&
        $('#user-credit-card-date').val() &&
        $('#user-credit-card-cvc').val() &&
        $('#user-credit-card-name').val() &&
        $('#user-credit-card-phone').val() &&
        $('#user-credit-card-email').val() &&
        $('#agree-user-credit-card-terms:checked').length > 0
    ) {
        return true;
    } else {
        return false;
    }
}
function checkPaymentFormFilled() {
    // if ($('input[name="payment_method"]:checked').val() === 'creditcard') {
    //     if (!(
    //         $('#payment-credit-card-number').val() &&
    //         $('#payment-credit-card-date').val() &&
    //         $('#payment-credit-card-cvc').val()
    //     )) {
    //         console.log('cred false')
    //         return false;
    //     }
    // }
    if (
        $('#payment-name').val() &&
        $('#payment-phone').val() &&
        $('#payment-email').val() &&
        $('#agree-payment-terms:checked').length > 0
    ) {
        return true;
    } else {
            // console.log('pay false')
        return false;
    }
}
function updateCreditCardButtonState() {
    if (checkCreditCardFormFilled())
        $('#user-credit-card-save-btn').prop('disabled', false);
    else
        $('#user-credit-card-save-btn').prop('disabled', true);
}
function updatePaymentButtonState(canGetPrime) {
    if (checkPaymentFormFilled() && canGetPrime)
        $('#payment-send-btn').prop('disabled', false);
    else
        $('#payment-send-btn').prop('disabled', true);
}

$('#add-credit-card-btn').click(function() {
    cash("#credit-card-modal").modal('show');
});

$('#credit-card-modal input').on('input', updateCreditCardButtonState);
$('#payment-modal input').on('input', updatePaymentButtonState);


$('#user-credit-card-save-btn').click(function() {
    let cardNumber = $('#user-credit-card-number').val().replace(/\s/g, '');;

    // check valid credit card
    let cardValid = validCreditCardNumber(cardNumber);
    // console.log(cardValid);
    if (!cardValid.valid){
        $('#user-credit-card-number').addClass('error');
        $('#user-credit-card-date').addClass('error');
        $('#user-credit-card-cvc').addClass('error');
        $('#credit-card-error-message').show();
        return;
    }

    let expdate = $('#user-credit-card-date').val().split('/');

    if (expdate[0] > 12 || expdate[1] < 21) {
        return;
    }

    expdate = expdate[0] + '/20' + expdate[1];
    
    $('#no-credit-card-text').hide();

    cash("#credit-card-modal").modal('hide');

    let length = cardNumber.length;
    let formatCardNumber = '';
    for (let i = 0; i < length; i++) {
        let char = '';
        if (i < 12)
            char = '*';
        else
            char = cardNumber[i];

        if (i !== 0 && i % 4 === 0)
            char = ' ' + char;

        formatCardNumber += char;
    }

    $('#user-credit-card-number-td').text(formatCardNumber);
    $('#user-credit-card-date-td').text(expdate);
    $('#user-credit-card-type-td').text(cardValid.company);

    $('#user-credit-card-table').show();
    $('#add-credit-card-btn').text('Edit card');

    $('#user-credit-card-number').removeClass('error');
    $('#user-credit-card-date').removeClass('error');
    $('#user-credit-card-cvc').removeClass('error');
    $('#credit-card-error-message').hide();

    show_toast('success', 'Changes saved', 5000);
});

function paymentCall(prime, paymentType) {
    let token = localStorage.getItem("token");
    $.ajax({
        "url": BASE_CONFIG.APP_URL + "/payment",
        "method": "POST",
        "contentType": "application/json",
        "dataType" : "json",
        "headers": {
            "x-access-token": token
        },
        "data": JSON.stringify({
            payType: 'ecpay',
            phone: $('#payment-phone').val(),
            name: $('#payment-name').val(),
            prime: prime,
            email: $('#payment-email').val(),
            payType: 'tappay',
            products: [['A', 1]],
            paymentType,
            invoiceType: 0,
    })})
        .done(function(data, status, xhr) {
            cash("#payment-modal").modal('hide');
            TPDirect.redirect(data.payment_url)
            $('#payment-modal input').val('');
        })
        .fail(function() {
            // console.log('fail');
        });
}

$('#payment-send-btn').click(function() {
    // $('#payment-credit-card-number').removeClass('error');
    // $('#payment-credit-card-date').removeClass('error');
    // $('#payment-credit-card-cvc').removeClass('error');
    // $('#payment-credit-card-error-message').hide();

    // let cardNumber = $('#payment-credit-card-number').val().replace(/\s/g, '');;

    // // check valid credit card
    // let cardValid = validCreditCardNumber(cardNumber);
    // console.log(cardValid);
    // if (!cardValid.valid){
    //     $('#payment-credit-card-number').addClass('error');
    //     $('#payment-credit-card-date').addClass('error');
    //     $('#payment-credit-card-cvc').addClass('error');
    //     $('#payment-credit-card-error-message').show();
    //     return;
    // }

    // let expdate = $('#user-credit-card-date').val().split('/');

    // if (expdate[0] > 12 || expdate[1] < 21) {
    //     return;
    // }
    if ($('#payment-by-line-pay').is(':checked')) {
        TPDirect.linePay.getPrime(function(result){
            paymentCall(result.prime, 0);
        });
    } else {
        TPDirect.card.getPrime((result) => {
            paymentCall(result.card.prime, 1)
        })
    }
});

$(document).ready(function() {
    $('#user-credit-card-number').mask('0000 0000 0000 0000');
    $('#user-credit-card-phone').mask('#');
    $('#user-credit-card-date').mask('00/00'); 
    $('#payment-credit-card-number').mask('0000 0000 0000 0000');
    $('#payment-credit-card-phone').mask('#');
    $('#payment-credit-card-date').mask('00/00'); 
    // initTapPaySDK()
});

function priceFormatting (price = 0) {
    const priceStrs = [...`${price}`]
    priceStrs.reverse();
    return priceStrs.reduce((prev, curr, index) => {
        return index > 0 && index % 3 === 0 ? `${curr},${prev}` : `${curr}${prev}`
    }, '')
}

function renderCurrentPlan () {
    const { planId = 'free', planPeriod, mau, maxMAU, planStartAt, planEndAt, overUsedPrice } = state
    const endDate = new Date(planEndAt);
    const today = new Date();
    const isFreePlan = planId === 'free';
    const isOverDate = isFreePlan || today > endDate;
    const isFreeTrial = !isFreePlan && 'none' === planPeriod;
    const endAt = new Date(planEndAt).toLocaleDateString(navigator.language, { hour12: false });
    const startAt = new Date(planStartAt).toLocaleDateString(navigator.language, { hour12: false });
    const periodMap = {
        month: 'Monthly payment',
        year: 'Annually payment',
        none: '14-Day Free Trial'
    }
    $('.plan-unsubscribed').toggle(isOverDate);
    if (!isFreePlan && endDate > today) {
        $('#plan-id').text(planId);
        $('#plan-status').text(`(${periodMap[planPeriod]})`);
    }
    if (planStartAt && planEndAt) {
        $('#plan-duration').text(`${startAt} - ${endAt}`);
    }
    if (today > endDate) {
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

    $('#upcoming-payment').toggle(!isOverDate && !isFreeTrial);

    const count = planPeriod !== 'month' ? 12 : 1;
    const amount = priceMap[`${planPeriod}_${planId}`] * count;
    $('#upcoming-payment__name').text(`${planId} (${periodMap[planPeriod]})`);
    $('#upcoming-payment__additional-payment').text(`NT$ ${priceFormatting(overUsedPrice)}`);
    $('#upcoming-payment__next-amount').text(`NT$ ${priceFormatting(overUsedPrice + amount)}`);
    $('#upcoming-payment__next-date').text(endAt);
}

function showModal() {
    var paymentStatus = parseInt(getUrlParameter('status'), 10);
    var orderNumber = getUrlParameter('order_number');
    if (paymentStatus === 0) {
      cash('#payment-success').modal('show');
    } else if (!isNaN(paymentStatus)) {
      $('#order-number').text(orderNumber);
      cash('#payment-fail').modal('show');
    }
}

const ogGetUserInfo = getUserInfo;
getUserInfo = () => {
    ogGetUserInfo()
        .then(result => {
            Object.assign(state, result);
            renderCurrentPlan();
        });
}

showModal();
