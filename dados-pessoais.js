var Webflow = Webflow || [];
var cpf_valido = false;

function consulta_cpf(cpf) {
    $.ajax({
        dataType: "json",
        url: "https://formularios.proteina.digital/escale/consulta_cpf.php?cpf=" + cpf,
        type: 'get',
        // async: false,
        timeout: 5000,
        success: function (dados) {
            console.log(dados.erro)
            if (dados.erro === 'CPF inválido!') {
                cpf_valido = false;
                $("input[name='cpf']").focus();
                $("input[name='cpf']").css("border-color", "red");
                return;
            } else if (dados.erro || dados.erroCodigo) {
                cpf_valido = true;
                $("input[name='nome_completo']").parent().removeClass('hide')
                $("input[name='nome_mae']").parent().removeClass('hide')
                $("input[name='data_nascimento']").parent().removeClass('hide')
                
                alert('Você deixou algumas informações pessoais em branco, preencha por favor.');
                $('#hidden_button').trigger('click');
                window.setTimeout(function () { 
                    document.querySelector("input[name='nome_completo']") = "";
                    document.querySelector("input[name='nome_completo']").focus(); 
                }, 0); 
                return;
            } else {
                cpf_valido = true;
                $("input[name='nome_completo']").val(dados.nome)
                $("input[name='nome_mae']").val(dados.mae)
                $("input[name='data_nascimento']").val(dados.nascimento)
                return false;
            }
        },
        error: function (jqxhr, status, exception) {
            cpf_valido = true;
            $("input[name='nome_completo']").parent().removeClass('hide')
            $("input[name='nome_mae']").parent().removeClass('hide')
            $("input[name='data_nascimento']").parent().removeClass('hide')

            console.log(jqxhr);
            console.log(status);
            console.log(exception);

            alert('Você deixou algumas informações pessoais em branco, preencha por favor.');
            $('#hidden_button').trigger('click');
            window.setTimeout(function () { 
                document.querySelector("input[name='nome_completo']") = "";
                document.querySelector("input[name='nome_completo']").focus(); 
            }, 0); 
            return false;
        }
    });
}

function get_endereco() {
    var cep_viabilidade = sessionStorage.getItem('cep');
    var numero_viabilidade = sessionStorage.getItem('numero');

    $.ajax({
        dataType: "json",
        url: "https://viacep.com.br/ws/" + cep_viabilidade + "/json/?callback=?",
        type: 'get',
        contentType: 'application/json',
        async: false,
        success: function (dados) {
            var endereco_fornecido = dados.logradouro + ', ' + numero_viabilidade + ' - ' + cep_viabilidade + ', ' + dados.bairro + ', ' + dados.localidade + ' - ' + dados.uf;
            sessionStorage.removeItem('endereco_fornecido');
            sessionStorage.setItem('endereco_fornecido', endereco_fornecido);
            sessionStorage.setItem('bairro', dados.bairro);
            sessionStorage.setItem('cidade', dados.localidade);
            sessionStorage.setItem('uf', dados.uf);
            sessionStorage.removeItem('campo_endereco1');
            sessionStorage.setItem('campo_endereco1', dados.logradouro);

            var endereco_fornecido = sessionStorage.getItem('endereco_fornecido');
            if (!endereco_fornecido) {
                $(".endereco_instalacao").text('Endereço não encontrado!');
            } else {
                $("#endereco_instalacao").val(sessionStorage.getItem('campo_endereco1')); //input
                // $("#endereco_instalacao").val(endereco_fornecido); //input
                $(".endereco_instalacao").text(endereco_fornecido); //h3
                // novos campos
                $("input[name='cep']").val(sessionStorage.getItem('cep'));
                $("input[name='uf']").val(sessionStorage.getItem('uf'));
                $("input[name='numero']").val(sessionStorage.getItem('numero'));
                $("input[name='bairro']").val(sessionStorage.getItem('bairro'));
                $("input[name='cidade']").val(sessionStorage.getItem('cidade'));

                if ($("#finish_order").length) {
                    console.log('finish order');
                    $('#finish_order').removeAttr('disabled');
                    $('#finish_order').val('FINALIZAR');
                }
            }
        },
        error: function (jqxhr, status, exception) {
            console.log(jqxhr);
            console.log(status);
            console.log(exception);
        }
    });
}

function carrega_card_selecionado() {
    var card_escolhido = sessionStorage.getItem("card_escolhido");
    $("#card_escolhido").empty();
    var card_escolhido_el = document.getElementById("card_escolhido");
    card_escolhido_el.insertAdjacentHTML("beforeend", card_escolhido);

    if ($(window).width() > 991) {
  	    document.getElementById("dropdown-card-list").classList.add("w--open");
    }
    

    var plano_escolhido = sessionStorage.getItem("plano_escolhido");
    var valor_plano_escolhido = sessionStorage.getItem("valor_plano_escolhido");
    var id_do_plano = sessionStorage.getItem("id_do_plano");
    $(".dropdown-card-text").text(plano_escolhido);
    $(".dropdown-card-text-preco").text("R$ " + valor_plano_escolhido);
    $("input[name='plano_escolhido']").val(plano_escolhido);
    $("input[name='valor_plano_escolhido']").val(valor_plano_escolhido);
    $("input[name='id_plano_fixo']").val(id_do_plano);
}

function inputs_on_changes() {
    $('input[name="user_agent"]').val(navigator.userAgent);

    $("input[name='pagamento']").change(function () {
        var radio = $("input[name='pagamento']:checked").val();
        var input_dcc = $("div[data-opcional='dcc']");

        if (radio == "dcc") {
            input_dcc.removeClass("hide");
            input_dcc.find("input").attr("required", "true");
            // dataLayer.push({ event: "evento_escolher_pagamento", v_evento: "evento_escolher_pagamento", v_etapa: "Etapa 5", v_valor: valor_plano_escolhido, v_plano: plano_escolhido, v_tipo_pagto: "Débito", v_tipo: sessionStorage.getItem("portabilidade_nome"), });
        } else {
            input_dcc.addClass("hide");
            input_dcc.find("input").removeAttr("required");
            $("input[value='dcc']").removeAttr("checked");
            // dataLayer.push({ event: "evento_escolher_pagamento", v_evento: "evento_escolher_pagamento", v_etapa: "Etapa 5", v_valor: valor_plano_escolhido, v_plano: plano_escolhido, v_tipo_pagto: "Boleto", v_tipo: sessionStorage.getItem("portabilidade_nome"), });
        }

        sessionStorage.setItem("pagamento", radio);
        console.log(radio);
    });

    $("input[name='portabilidade']").change(function () {
        var radio = $("input[name='portabilidade']:checked").val();
        var input_portabilidade = $("div[data-opcional='portabilidade']");

        if (radio == "Sim") {
            input_portabilidade.removeClass("hide");
            input_portabilidade.find("input").attr("required", "true");
            // dataLayer.push({ event: "evento_escolher_telefone", v_evento: "evento_escolher_telefone", v_etapa: "Etapa 3", v_valor: valor_plano_escolhido, v_plano: plano_escolhido, v_tipo: "atual", });
            sessionStorage.setItem("portabilidade_nome", "atual");
        } else {
            input_portabilidade.addClass("hide");
            input_portabilidade.find("input").removeAttr("required");
            // dataLayer.push({ event: "evento_escolher_telefone", v_evento: "evento_escolher_telefone", v_etapa: "Etapa 3", v_valor: valor_plano_escolhido, v_plano: plano_escolhido, v_tipo: "novo", });
            sessionStorage.setItem("portabilidade_nome", "novo");
        }
        sessionStorage.setItem("portabilidade", radio);
        console.log(radio);
    });

    $(document).on("click", ".nv-data-nascimento", function (e) {
        e.preventDefault();
        console.log('dia vencimento')
        var dia_vencimento = $(this);
        $(".nv-data-nascimento").removeClass("selecionado");
        dia_vencimento.addClass("selecionado");

        $("input[name='dia_vencimento']").val(
            dia_vencimento.attr("data-vencimento")
        );

        sessionStorage.setItem(
            "dia_vencimento",
            dia_vencimento.attr("data-vencimento")
        );
    });
}

function init_on_clicks() {
    $(document).on("click", ".link-endereco", function (e) {
        e.preventDefault();
        sessionStorage.clear();
        window.location = '/';   
    });
}


Webflow.push(function () {
    setTimeout(function () {
        $("#finish_order").removeAttr("disabled", true);
        $("#finish_order").val("FINALIZAR");
    }, 5000);

    $('input[name="cpf"]').change(function () {
        var input = $(this).val();
        if (input.length) {
            var input_clean = input.replace(/\D/g, '');
            sessionStorage.setItem('identifier', input_clean);
            // consulta_cpf(input_clean);
            cpf_valido = true;
        }
    });

    $('input[name="cpf"]').mask("000.000.000-00", { reverse: true });

    var RGMaskBehavior = function (val) {
        return val.replace(/\D/g, "").length === 9
            ? "00.000.000-0"    
            : "00.000.000-9";
    },
        rgOptions = {
            onKeyPress: function (val, e, field, options) {
                field.mask(RGMaskBehavior.apply({}, arguments), options);
            },
        };
    $("input[name='rg']").mask(RGMaskBehavior, rgOptions);
    
    
    $('input[name="user_agent"]').val(navigator.userAgent);
    $("#finish_order").attr("disabled", true);
    $("#finish_order").val("CARREGANDO...");

    $("[name='celular']").val(sessionStorage.getItem('telefone'))
    $("[data-vencimento='11']").addClass('selecionado')
    $("input[name='dia_vencimento']").val(11)

    var SPMaskBehavior = function (val) {
        return val.replace(/\D/g, "").length === 11
            ? "(00) 00000-0000"
            : "(00) 0000-00009";
    },
        spOptions = {
            onKeyPress: function (val, e, field, options) {
                field.mask(SPMaskBehavior.apply({}, arguments), options);
            },
        };

    $("input[name='celular']").mask(SPMaskBehavior, spOptions);
    // $("input[name='outro_telefone']").mask(SPMaskBehavior, spOptions);
    $("input[name='telefone_atual']").mask(SPMaskBehavior, spOptions);
    $("input[name='data_nascimento']").mask("00/00/0000");

    inputs_on_changes()
    init_on_clicks()
    carrega_card_selecionado()
    get_endereco()

    var form = $("#wf-form-Email-Form");
    form.find("input").each(function () {
        $(this).on("click", function (e) {
            $(this).removeAttr("style");
        });
    });

    form.on("submit", function (e) {
        e.preventDefault(e);

        // if (!cpf_valido) return false;

        var inputs = [form.find("input[name='celular']"), form.find("input[name='outro_telefone']"), form.find("input[name='telefone_atual']"), form.find("input[name='email']"), form.find("input[name='cpf']"), form.find("input[name='nome_completo']"), form.find("input[name='data_nascimento']")];
        let invalid = false;
        inputs.forEach(function (item) {
            let expre;
            const input_name = item.attr("name");
            let val =
                input_name === "email" ? item.val() : item.val().replace(/\D/g, "");

            sessionStorage.setItem("form_input_" + input_name, item.val());

            switch (input_name) {

                case "celular":
                    expre = !telefone_validation(val);
                    break;
                case "outro_telefone":
                    expre = val !== "" && !telefone_validation(val);
                    break;
                case "telefone_atual":
                    if (item.attr("required")) {
                        expre = !telefone_validation(val);
                    }
                    break;
                case "email":
                    expre = !validEmail(val);
                    break;
                case "cpf":
                    expre = val.length !== 11;
                    break;
                case "data_nascimento":
                    expre = !/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i.test(item.val());
                    break;
                default:
                    true;
            }

            if (expre) {
                item.focus();
                item.css("border-color", "red");
                invalid = true;
            }
        });
        if (invalid) return false;
    });
});

$(document).ajaxComplete(function (e, x, config) { if (config.url.indexOf('https://webflow.com/api/v1/form/') !== -1) { window.location.href = site + '/confirmacao' + window.location.search } });
