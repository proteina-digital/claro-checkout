function hubspot_lead(telefone){

    if( !_getCookie('escaleLead') ){
        return false;
    }

    var acquisition_campaign = sessionStorage.getItem('form_campaign');
    var acquisition_source = sessionStorage.getItem('form_source');
    var acquisition_term = sessionStorage.getItem('form_term');
    var acquisition_midia = sessionStorage.getItem('form_medium');
    var acquisition_gclid = sessionStorage.getItem('form_gclid');
    var checkout_date_time = sessionStorage.getItem('checkout_date_time');

    $.ajax({
        url: 'https://formularios.proteina.digital/escale/claro_checkout/hubspot.php',
        dataType: 'text',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        async: false,
        data: {
            lead_id: _getCookie('escaleLead'),
            phone: telefone,
            session_id: _getCookie('escaleLead'),
            checkout_date_time: checkout_date_time,
            checkout_phone: telefone,
            checkout_session_id: _getCookie('escaleLead'),
            acquisition_midia: acquisition_midia,
            acquisition_campaign: acquisition_campaign,
            acquisition_source: acquisition_source,
            acquisition_page: location.href,
            acquisition_group: null,
            acquisition_term: acquisition_term,
            acquisition_domain: location.protocol+'//'+location.host,
            acquisition_gclid: acquisition_gclid,
            action: 'lead'
        },
        success: function(res){

            if (res != 'error') {
                console.log("Contato Enviado");
            }else{
                console.log("Contato não Enviado");
            }

        }, 
        error: function(jqxhr, status, exception){
            console.log(jqxhr);
            console.log(status);
            console.log(exception);
        }
    });
}

function hubspotEtapa2(address_type_viability){

    if( !_getCookie('escaleLead') ){
        return false;
    }

    $.ajax({
        url: 'https://formularios.proteina.digital/escale/claro_checkout/hubspot.php',
        dataType: 'text',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        async: false,
        data: {
            lead_id: _getCookie('escaleLead'),
            address_type_viability: address_type_viability,
            action: 'viability'
        },
        success: function(res){

            if (res != 'error') {
                console.log("Contato Enviado");
            }else{
                console.log("Contato não Enviado");
            }

        }, 
        error: function(jqxhr, status, exception){
            console.log(jqxhr);
            console.log(status);
            console.log(exception);
        }
    });
}


function hubspotOrder() {

    if (!_getCookie('escaleLead')) {
        return false;
    }

    var payment_due_date = sessionStorage.getItem('dia_vencimento') || '';
    var payment_type_monthly = sessionStorage.getItem('pagamento') || 'dcc';
    var payment_value_monthly = sessionStorage.getItem('valor_plano_escolhido') || '';
    if( payment_type_monthly != 'dcc' ){
        payment_value_monthly = sessionStorage.getItem('valor_plano_escolhido_nao_dccfd') || '';
    }
    
    var product_internet_package = '';
    var product_internet_date_scheduling_primary = '';
    var product_internet_date_scheduling_secondary = '';
    var product_internet_period_primary = '';
    var product_internet_period_secondary = '';
    var product_internet_period_promotional = '';
    var product_internet_value_promotional = '';
    var product_internet_value = '';

    var planoInternetStorage = sessionStorage.getItem('plano_internet');
    if (planoInternetStorage) {
        var plano_internet = JSON.parse(planoInternetStorage);

        product_internet_package = plano_internet.name || '';
        product_internet_date_scheduling_primary = sessionStorage.getItem('primeira_data') || '';
        product_internet_date_scheduling_secondary = sessionStorage.getItem('segunda_data') || '';
        product_internet_period_primary = sessionStorage.getItem('periodo_primeira_data') || '';
        product_internet_period_secondary = sessionStorage.getItem('periodo_segunda_data') || '';
        product_internet_period_promotional = (plano_internet.promotions && plano_internet.promotions[0] && typeof plano_internet.promotions[0].validity !== 'undefined') ? plano_internet.promotions[0].validity : '';
        product_internet_value_promotional = (plano_internet.promotions && plano_internet.promotions[0] && typeof plano_internet.promotions[0].price !== 'undefined') ? plano_internet.promotions[0].price : '';
        product_internet_value = plano_internet.price || '';
        if(payment_type_monthly != 'dcc'){
            product_internet_value = plano_internet.price_nao_dccfd || '';
        }
    }

    var product_tv_package = '';
    var product_tv_date_scheduling_primary = '';
    var product_tv_date_scheduling_secondary = '';
    var product_tv_period_primary = '';
    var product_tv_period_secondary = '';
    var product_tv_period_promotional = '';
    var product_tv_value_promotional = '';
    var product_tv_value = '';

    var planoTvStorage = sessionStorage.getItem('plano_tv');
    if (planoTvStorage) {
        var plano_tv = JSON.parse(planoTvStorage);

        product_tv_package = plano_tv.name || '';
        product_tv_date_scheduling_primary = sessionStorage.getItem('primeira_data') || '';
        product_tv_date_scheduling_secondary = sessionStorage.getItem('segunda_data') || '';
        product_tv_period_primary = sessionStorage.getItem('periodo_primeira_data') || '';
        product_tv_period_secondary = sessionStorage.getItem('periodo_segunda_data') || '';
        product_tv_period_promotional = (plano_tv.promotions && plano_tv.promotions[0] && typeof plano_tv.promotions[0].validity !== 'undefined') ? plano_tv.promotions[0].validity : '';
        product_tv_value_promotional = (plano_tv.promotions && plano_tv.promotions[0] && typeof plano_tv.promotions[0].price !== 'undefined') ? plano_tv.promotions[0].price : '';
        product_tv_value = plano_tv.price || '';
        if(payment_type_monthly != 'dcc'){
            product_tv_value = plano_tv.price_nao_dccfd || '';
        }
    }

    var formdados = JSON.parse(sessionStorage.getItem('formData') || '{}');

    $.ajax({
        url: 'https://formularios.proteina.digital/escale/claro_checkout/hubspot.php',
        dataType: 'text',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        async: false,
        data: {
            lead_id: _getCookie('escaleLead'),
            payment_due_date: payment_due_date,
            payment_type_monthly: payment_type_monthly,
            payment_value_monthly: payment_value_monthly,
            product_internet_package: product_internet_package,
            product_internet_date_scheduling_primary: product_internet_date_scheduling_primary,
            product_internet_date_scheduling_secondary: product_internet_date_scheduling_secondary,
            product_internet_period_primary: product_internet_period_primary,
            product_internet_period_secondary: product_internet_period_secondary,
            product_internet_period_promotional: product_internet_period_promotional,
            product_internet_value_promotional: product_internet_value_promotional,
            product_internet_value: product_internet_value,
            product_tv_package: product_tv_package,
            product_tv_date_scheduling_primary: product_tv_date_scheduling_primary,
            product_tv_date_scheduling_secondary: product_tv_date_scheduling_secondary,
            product_tv_period_primary: product_tv_period_primary,
            product_tv_period_secondary: product_tv_period_secondary,
            product_tv_period_promotional: product_tv_period_promotional,
            product_tv_value_promotional: product_tv_value_promotional,
            product_tv_value: product_tv_value,
            address_zipcode: sessionStorage.getItem('cep') || '',
            address_street: sessionStorage.getItem('campo_endereco1') || '',
            address_number: sessionStorage.getItem('numero') || '',
            address_neighborhood: sessionStorage.getItem('bairro') || '',
            address_complement: sessionStorage.getItem('complemento') || '',
            address_state: sessionStorage.getItem('uf') || '',
            address_city: sessionStorage.getItem('cidade') || '',
            customer_name: formdados.nome_completo || '',
            customer_individual_registration: formdados.cpf || '',
            customer_national_registration: formdados.rg || '',
            customer_birth_date: formdados.data_nascimento || '',
            customer_mother_name: formdados.nome_mae || '',
            contact_main_phone: formdados.celular || '',
            contact_additional_phone: null,
            contact_main_email: formdados.email || '',
            action: 'order'
        },
        success: function (res) {
            if (res !== 'error') {
                console.log("Contato Enviado");
            } else {
                console.log("Contato não Enviado");
            }
        },
        error: function (jqxhr, status, exception) {
            console.log(jqxhr);
            console.log(status);
            console.log(exception);
        }
    });
}
