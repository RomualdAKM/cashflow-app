var orderList = [];
var perPage = +localStorage.getItem('order_per_page') || 5;
var page = 1;

$('#add-email-link').click(function() {
    $('#add-email-wrapper').hide();
    $('#edit-email-wrapper').show();
});

$('#save-email-btn').click(function() {
    let email = $('#email-address').val();
    $('#email-text').val(email);
    
    // call API save email 

    $('#edit-email-wrapper').hide();
    $('#show-email-wrapper').show();
    $('#show-email-wrapper').css('display', 'flex');

    $('#email-address').val('');
});

$('#cancel-email-btn').click(function() {
    $('#edit-email-wrapper').hide();
    $('#add-email-wrapper').show();

    $('#email-address').val('');
});

$('#delete-email-btn').click(function() {
    $('#email-text').val('');
    $('#show-email-wrapper').hide();
    $('#add-email-wrapper').show();
});

$('#email-address').on('input', function() {
    if ($("#email-address").val())
        $('#save-email-btn').prop('disabled', false);
    else
        $('#save-email-btn').prop('disabled', true);
});

function priceFormatting (price = 0) {
    const priceStrs = [...`${price}`]
    priceStrs.reverse();
    return priceStrs.reduce((prev, curr, index) => {
        return index > 0 && index % 3 === 0 ? `${curr},${prev}` : `${curr}${prev}`
    }, '')
}

function renderOrderList () {
    const startIndex = (page - 1) * perPage;
    const fragment = document.createDocumentFragment();
    const planMap = {
        'starter_month': 'Starter (Monthly payment)',
        'starter_year': 'Starter (Annually payment)',
        'growth_month': 'Growth (Monthly payment)',
        'growth_year': 'Growth (Annually payment)',
    }
    orderList
        .slice(startIndex, startIndex + perPage)
        .forEach(order => {
            const tr = document.createElement('tr');
            const billingDate = new Date(order.createdAt).toLocaleDateString(navigator.language, { hour12: false });
            const planName = planMap[`${order.productDetail.product}_${order.productDetail.period}`];
            const overPrice = (order.productDetail.other && order.productDetail.other.price) || 0
            const tdPlan = document.createElement('td');
            tdPlan.classList = ['text-left'];
            tdPlan.appendChild(document.createTextNode(planName));
            const tdAdditionalPayment = document.createElement('td');
            tdAdditionalPayment.appendChild(document.createTextNode(`NT$ ${priceFormatting(+overPrice)}`));

            const tdTotal = document.createElement('td');
            tdTotal.appendChild(document.createTextNode(`NT$ ${priceFormatting(+order.totalPrice)}`));

            const tdBillingDate = document.createElement('td');
            tdBillingDate.appendChild(document.createTextNode(billingDate));

            tr.appendChild(tdPlan);
            tr.appendChild(tdAdditionalPayment);
            tr.appendChild(tdTotal);
            tr.appendChild(tdBillingDate);
            fragment.appendChild(tr);
        })
    $('#payment-order-list').empty().append(fragment);
    $('#order-list-page-number').text(page);
    renderOrderPagination();
}

function renderOrderPagination() {
    const totalPages = Math.ceil(orderList.length / perPage);
    const isShowPagination = totalPages > 1;
    $('#order-list-pagination').toggle(totalPages > 1);
    $('#order-list-page-select').toggleClass('opacity-0', !isShowPagination);
    $('#page-left-button').prop('disabled', page <= 1);
    $('#page-right-button').prop('disabled', page >= totalPages);
    $('#order-list-page-number').text(page);
}

function getUserOrder () {
    const apiConfig = getRequestConfig({
        "url": `${BASE_CONFIG.APP_URL}/user/order`
    });
    $.ajax(apiConfig)
        .then(response => {
            if (response.length) {
                orderList = response;
                $('#billing-contact').toggle(true);
                $('#order-list').toggle(true);
                $('#payment-email').text(response[0].email);
                renderOrderList();
            } else {
                $('#billing-contact').toggle(false);
                $('#no-billing-yet').toggle(true);
            }
        })
}

$(document).ready(function() {
    getUserOrder();
    $('#order-list-per-page').val(perPage);
    $('#order-list-per-page').on('change', function () {
        page = 0;
        perPage = +this.value;
        localStorage.setItem('order_per_page', this.value);
        renderOrderList();
    })
    $('#page-left-button').on('click', function () {
        page -= 1;
        renderOrderList();
    })

    $('#page-right-button').on('click', function () {
        page += 1;
        renderOrderList();
    })
});