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


function hubspotQualification(){

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
            action: 'qualification'
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


function hubspotSegment(){

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
            action: 'segment'
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

function hubspotViability(address_type_viability){

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
