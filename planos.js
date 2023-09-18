function find_selecao_by_id(id_tv, id_internet, id_celular = 0) {
  var id_selecao = id_tv + '_' + id_internet + '_' + id_celular
  var _selecoes = JSON.parse(sessionStorage.getItem('selecoes'))
  for (let i = 0; i < _selecoes.length; i++) {
    if (_selecoes[i].key === id_selecao) {
        return _selecoes[i];
    }
}
  return null;
}


function atualiza_plano_no_banco_de_abandonos(plano, valores = []) {
    var telefone = sessionStorage.getItem('telefone_')
    var cep = sessionStorage.getItem('cep_')

    $.ajax({
        url: "https://formularios.proteina.digital/escale/claro_checkout/claro_abandono_v2.php",
        dataType: 'text',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        async: false,
        data: {
            plano: plano,
            cep: cep,
            telefone: telefone,
            action: 'update',
            receber_ligacao: 0,
            valores: JSON.stringify(valores)
        },
        success: function (dados) {
            console.log('sucesso')
        },
        error: function (jqxhr, status, exception) {
            console.log(jqxhr);
            console.log(status);
            console.log(exception);
        }
    });
}

function avanca_etapa_3(card_escolhido) {
    if (!card_escolhido.length) {
        $('#loadingspinner').hide(); console.log('card invalido')
    } else {
        sessionStorage.setItem('card_escolhido', card_escolhido[0].outerHTML)
        sessionStorage.setItem('plano_escolhido', card_escolhido.attr("data-nome-plano"))
        sessionStorage.setItem('tipo_plano_escolhido', card_escolhido.attr("data-tipo-plano"))
        sessionStorage.setItem('id_do_plano', card_escolhido.attr('data-id'))
        sessionStorage.setItem('valor_plano_escolhido', card_escolhido.find('.preco-combo').attr('preco-combo'))
        if (!card_escolhido.find('.preco-combo').attr('preco-combo')) { sessionStorage.setItem('valor_plano_escolhido', card_escolhido.find('[data-preco-combo]').text()) }
        sessionStorage.setItem('valor_plano_escolhido_nao_dccfd', card_escolhido.find("[data-preco_nao_dccfd]").text())
        sessionStorage.setItem('plano_sku', card_escolhido.attr("data-sku"))

        if (card_escolhido.attr("data-tipo-plano") == 'internet') {
            var promotions = [];
            var plano_i_session = JSON.parse(sessionStorage.getItem('planos')).find(item => item.nome == card_escolhido.attr('data-nome-plano'))
            var oferta = JSON.parse(sessionStorage.getItem('ofertas')).find(item => item.id == plano_i_session.ofertaid)

            if (oferta && oferta.pfdd) {
                promotions.push({
                    price: oferta.pfdd.periodo[0].preco,
                    validity: oferta.pfdd.periodo[0].ate
                })
            }

            sessionStorage.setItem('plano_internet', JSON.stringify({
                sku: card_escolhido.attr("data-sku"),
                providerId: card_escolhido.attr('data-id'),
                name: card_escolhido.attr("data-nome-plano"),
                price: card_escolhido.find('.preco-combo').attr('preco-combo'),
                price_nao_dccfd: card_escolhido.find("[data-preco_nao_dccfd]").text(),
                kind: 'internet',
                promotions: promotions
            }))
            var valores = [card_escolhido.find('.preco-combo').attr('preco-combo'), card_escolhido.find("[data-preco_nao_dccfd]").text()]
            atualiza_plano_no_banco_de_abandonos(card_escolhido.attr("data-nome-plano").replace(/\D/g, ''), valores)
        }

        else if (card_escolhido.attr("data-tipo-plano") == 'tv') {
            var promotions = [];
            var plano_tv_session = JSON.parse(sessionStorage.getItem('planos_tv')).find(item => item.nome == card_escolhido.attr('data-nome-plano'))
            var oferta = JSON.parse(sessionStorage.getItem('ofertas')).find(item => item.id == plano_tv_session.ofertaid)

            if (oferta && oferta.pfdd) {
                promotions.push({
                    price: oferta.pfdd.periodo[0].preco,
                    validity: oferta.pfdd.periodo[0].ate
                })
            }

            sessionStorage.setItem('plano_tv', JSON.stringify({
                sku: card_escolhido.attr("data-sku"),
                providerId: card_escolhido.attr('data-id'),
                name: card_escolhido.attr("data-nome-plano"),
                price: card_escolhido.find('.preco-combo').attr('preco-combo'),
                price_nao_dccfd: card_escolhido.find("[data-preco_nao_dccfd]").text(),
                kind: 'tv',
                promotions: promotions
            }))
            var valores = [card_escolhido.find('.preco-combo').attr('preco-combo'), card_escolhido.find("[data-preco_nao_dccfd]").text()]
            atualiza_plano_no_banco_de_abandonos(card_escolhido.attr("data-nome-plano").replace(/\D/g, ''), valores)
        }

        else if (card_escolhido.attr("data-tipo-plano") == 'combo') {
            var plano_i = JSON.parse(sessionStorage.getItem('planos')).find(item => item.nome == card_escolhido.attr('data-internet'))
            var plano_tv = JSON.parse(sessionStorage.getItem('planos_tv')).find(item => item.nome == card_escolhido.attr('data-tv'))
            var selecao = find_selecao_by_id(plano_tv.id, plano_i.id, 0)
            var plano_i_formatted = {
                sku: $('[data-nome-plano="' + card_escolhido.attr("data-internet") + '"]').attr('data-sku'),
                providerId: plano_i.id,
                name: plano_i.nome,
                price: plano_i.preco,
                price_nao_dccfd: (plano_i.preco_nao_dccfd && plano_i.preco_nao_dccfd != 'undefined') ? plano_i.preco_nao_dccfd : plano_i.price_nao_dccfd,
                kind: 'internet',
                promotions: []
            }
            var plano_tv_formatted = {
                sku: $('[data-nome-plano="' + card_escolhido.attr("data-tv") + '"]').attr('data-sku'),
                providerId: plano_tv.id,
                name: plano_tv.nome,
                price: plano_tv.preco,
                price_nao_dccfd: (plano_i.preco_nao_dccfd && plano_i.preco_nao_dccfd != 'undefined') ? plano_i.preco_nao_dccfd : plano_i.price_nao_dccfd,
                kind: 'tv',
                promotions: []
            }

            if (selecao) {
                if (selecao.internet) {
                    plano_i_formatted.promotions = [{
                        price: selecao.internet.preco,
                        validity: selecao.internet.adesaoParcelas
                    }]
                }

                if (selecao.tv) {
                    plano_tv_formatted.promotions = [{
                        price: selecao.tv.preco,
                        validity: selecao.tv.adesaoParcelas
                    }]
                }
            }

            sessionStorage.setItem('plano_internet', JSON.stringify(plano_i_formatted))
            sessionStorage.setItem('plano_tv', JSON.stringify(plano_tv_formatted))
            sessionStorage.setItem('preco_combo', card_escolhido.find('[data-preco-combo]').text())

            // var valores = [plano_i_formatted.preco, plano_i_formatted.price_nao_dccfd]
            // atualiza_plano_no_banco_de_abandonos(plano_i_formatted.sku, valores)
        }

        sessionStorage.removeItem('etapa')
        sessionStorage.setItem('etapa', 'etapa3')
        window.location.href = site + "/pagamento" + window.location.search
    }
}
