function get_selecoes_validas() {
    var internets = JSON.parse(sessionStorage.getItem('planos'))
    var tvs = JSON.parse(sessionStorage.getItem('planos_tv'))
    var selecoes_arr = JSON.parse(sessionStorage.getItem('selecoes'))

    combos_validos = selecoes_arr.filter(function(selecao) {
        return (selecao.tvId && selecao.internetId && !selecao.foneId && !selecao.celularId)
        // || (selecao.celularId && selecao.internetId);
    });

    combos_validos.forEach(function(combo, index) {
        var slide_dom_item = $('[data-combo-slide]').first();
        slide_dom_item.removeAttr('aria-label')
        slide_dom_item.removeAttr('style')
        var slider_mask = slide_dom_item.parent();

        var internet = internets.find(function(item) { return item.id == combo.internetId});
        var tv = tvs.find(function(item) { return item.id == combo.tvId});

        // deu ruim
        if(!slide_dom_item) return;

        if(index == 0) {
            var card = slide_dom_item.find('[data-combo-id]')
            card.attr('data-combo-id', combo.id)
            // adicionar outros atributos
            card.find('[data-megas]').text(internet.nome)
            card.find('[data-tv]').text(tv.nome)
            card.find('[data-celular]').hide();
            card.find('[data-celular]').next().hide();
            var valor_total = calcula_valor_total_2(combo, internet, tv)
            card.find('[data-preco-combo]').text(valor_total).attr("data-preco-combo", valor_total);
        } else {
            var clone = slide_dom_item.clone();
            var card = clone.find('[data-combo-id]')
            card.attr('data-combo-id', combo.id)

            card.find('[data-megas]').text(internet.nome)
            card.find('[data-tv]').text(tv.nome)
            card.find('[data-celular]').hide();
            card.find('[data-celular]').next().hide();
            var valor_total = calcula_valor_total_2(combo, internet, tv)
            card.find('[data-preco-combo]').text(valor_total).attr("data-preco-combo", valor_total);
            clone.appendTo(slider_mask);
        }

    });

    Webflow.require('slider').redraw();
}

function get_internets_validas() {
    var internets = JSON.parse(sessionStorage.getItem('planos'))
    var ofertas = JSON.parse(sessionStorage.getItem('ofertas'))
    internets.forEach(function(internet, index) {
        var slide_dom_item = $('[data-internet-slide]').first();
        slide_dom_item.removeAttr('aria-label')
        slide_dom_item.removeAttr('style')
        var slider_mask = slide_dom_item.parent();

        // deu ruim
        if(!slide_dom_item) return;
        if(index == 0) {
            var card = slide_dom_item.find('[data-id]')
            card.attr('data-id', internet.id)
            // adicionar outros atributos
            card.find('[data-titulo]').text(internet.nome)
            monta_preco(internet, ofertas, card)
        } else {
            var clone = slide_dom_item.clone();
            var card = clone.find('[data-id]')
            card.attr('data-id', internet.id)
            card.find('[data-melhor-oferta]').remove();

            card.find('[data-titulo]').text(internet.nome)
            monta_preco(internet, ofertas, card)
            clone.appendTo(slider_mask);
        }

    });

    Webflow.require('slider').redraw();
}

function get_tvs_validas() {
    var tvs = JSON.parse(sessionStorage.getItem('planos_tv'))
    var ofertas = JSON.parse(sessionStorage.getItem('ofertas'))
    tvs.forEach(function(tv, index) {
        var slide_dom_item = $('[data-tv-slide]').first();
        slide_dom_item.removeAttr('aria-label')
        slide_dom_item.removeAttr('style')
        var slider_mask = slide_dom_item.parent();

        // deu ruim
        if(!slide_dom_item) return;
        if(index == 0) {
            var card = slide_dom_item.find('[data-id]')
            card.attr('data-id', tv.id)
            // adicionar outros atributos
            card.find('[data-titulo]').text(tv.nome)
            monta_preco(tv, ofertas, card)
        } else {
            var clone = slide_dom_item.clone();
            var card = clone.find('[data-id]')
            card.attr('data-id', tv.id)
            card.find('[data-melhor-oferta]').remove();

            card.find('[data-titulo]').text(tv.nome)
            monta_preco(tv, ofertas, card)
            clone.appendTo(slider_mask);
        }

    });

    Webflow.require('slider').redraw();
}

function monta_preco(produto, ofertas, card) {
    var preco_normal = (produto.preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    if(produto.ofertaId) {
        var oferta_atual = ofertas.filter(function(oferta) {
            return oferta.id == produto.ofertaId;
        })

        if(oferta_atual && oferta_atual[0] && oferta_atual[0].pfdd) {
            var preco = oferta_atual[0].pfdd.periodo[0].preco
            var meses = oferta_atual[0].pfdd.periodo[0].ate
            var mes_ou_meses;
            if(meses == 1) {
                mes_ou_meses = ' mês';
            } else {
                mes_ou_meses = ' meses';
            }
            if (preco == 0) {
                // mostro o preço normal com a mensagem que é grátis no primeiro mês
                card.find('[data-valor-preco]').text(preco_normal).attr("data-valor-preco", preco_normal);
                var obs = "Grátis por " + meses + mes_ou_meses
                card.find('[data-oferta-obs]').html('<strong>'+ obs +'</strong>');
            } else {
                // mostro o preço da promoção
                preco = (preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                card.find('[data-valor-preco]').text(preco).attr("data-valor-preco", preco);
                var obs = "Valor promocional por " + meses + mes_ou_meses
                card.find('[data-oferta-obs]').text(obs);
            }
        } else {
            card.find('[data-valor-preco]').text(preco_normal).attr("data-valor-preco", preco_normal);
        }
    } else {
        card.find('[data-valor-preco]').text(preco_normal).attr("data-valor-preco", preco_normal);
    }
}

function calcula_valor_total_2(combo, internet, tv) {
    var valorTotal = 0;
    if (combo.tv && combo.tv.preco) {
      valorTotal += combo.tv.preco;
    } else {
      valorTvCheio = tv.preco
      valorTotal += valorTvCheio;
    }
    if (combo.internet && combo.internet.preco) {
      valorTotal += combo.internet.preco;
    } else {
      valorInternetCheio = internet.preco
      valorTotal += valorInternetCheio;
    }
    if(valorTotal == 0) return false
    return (valorTotal / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
