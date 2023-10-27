// novos_metodos_planos.js
// novos_metodos_planos.js
var extras = JSON.parse(sessionStorage.getItem('extras'))

function transformString(input) {
    if(!input) return '';
  var withoutSpaces = input.replace(/\s/g, '');
  var withUnderscores = withoutSpaces.replace(/ /g, '_');
  var withMAIS = withUnderscores.replace(/\+/g, 'MAIS');
  var upperCase = withMAIS.toUpperCase();
  return upperCase.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  
  function get_selecoes_validas() {
    var internets = JSON.parse(sessionStorage.getItem('planos'))
    var tvs = JSON.parse(sessionStorage.getItem('planos_tv'))
    var selecoes_arr = JSON.parse(sessionStorage.getItem('selecoes'))
    var extras = JSON.parse(sessionStorage.getItem('extras'))
  
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
            card.attr('data-cod-plano', transformString(tv.nome) + '_' + transformString(internet.nome))
            card.attr('data-combo-id', combo.id)
            card.attr('data-internet', internet.nome)
            card.attr('data-tv', tv.nome)
            // adicionar outros atributos
            card.find('[data-megas]').text(internet.nome)
            card.find('[data-tv]').text(tv.nome)
            card.find('[data-celular]').hide();
            card.find('[data-celular]').next().hide();
            var valor_total = calcula_valor_total_2(combo, internet, tv)
            card.find('[data-preco-combo]').text(valor_total[0]).attr("data-preco-combo", valor_total[0]);
            card.attr('data-preco-combo-internet', valor_total[1]);
            card.attr('data-preco-combo-tv', valor_total[2]);
        } else {
            var clone = slide_dom_item.clone();
            var card = clone.find('[data-combo-id]')
            card.attr('data-cod-plano', transformString(tv.nome) + '_' + transformString(internet.nome))
            card.attr('data-combo-id', combo.id)
            card.attr('data-internet', internet.nome)
            card.attr('data-tv', tv.nome)
  
            card.find('[data-megas]').text(internet.nome)
            card.find('[data-tv]').text(tv.nome)
            card.find('[data-celular]').hide();
            card.find('[data-celular]').next().hide();
            var valor_total = calcula_valor_total_2(combo, internet, tv)
            card.find('[data-preco-combo]').text(valor_total[0]).attr("data-preco-combo", valor_total[0]);
            card.attr('data-preco-combo-internet', valor_total[1]);
            card.attr('data-preco-combo-tv', valor_total[2]);
            clone.appendTo(slider_mask);
        }
  
    });
  
    if($('[data-combo-slide]').length <= 3) {
        $('[data-combo-slide]').parent().next('.left-arrow-2').removeClass('show')
        $('[data-combo-slide]').parent().next('.left-arrow-2').next('.right-arrow-2').removeClass('show')
    }
  
    if (combos_validos.length == 0) {
        $("[data-tab-for='combo']").hide();
        $("[data-tab='combo']").hide();
    }
  
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
            card.attr('data-nome-plano', internet.nome)
            card.attr('data-cod-plano', transformString(internet.nome))
            card.find('[data-titulo]').text(internet.nome)
            if(internet.nome) { card.find('[data-plano]').attr('data-plano', internet.nome.replace(/\D/g,'')) }
            monta_preco(internet, ofertas, card)
        } else {
            var clone = slide_dom_item.clone();
            var card = clone.find('[data-id]')
            card.attr('data-id', internet.id)
            card.attr('data-nome-plano', internet.nome)
            card.attr('data-cod-plano', transformString(internet.nome))
            card.find('[data-melhor-oferta]').remove();
  
            card.find('[data-titulo]').text(internet.nome)
            if(internet.nome) { card.find('[data-plano]').attr('data-plano', internet.nome.replace(/\D/g,'')) }
            monta_preco(internet, ofertas, card)
            clone.appendTo(slider_mask);
        }
    });
  
  
    if($('[data-internet-slide]').length <= 3) {
        $('[data-internet-slide]').parent().next('.left-arrow-2').removeClass('show')
        $('[data-internet-slide]').parent().next('.left-arrow-2').next('.right-arrow-2').removeClass('show')
    }
  
    if (internets.length == 0) {
        $("[data-tab-for='internet']").hide();
        $("[data-tab='internet']").hide();
    }
  
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
            card.attr('data-nome-plano', tv.nome)
            card.attr('data-cod-plano', transformString(tv.nome))
            // adicionar outros atributos
            card.find('[data-titulo]').text(tv.nome)
            monta_preco(tv, ofertas, card)
        } else {
            var clone = slide_dom_item.clone();
            var card = clone.find('[data-id]')
            card.attr('data-id', tv.id)
            card.attr('data-nome-plano', tv.nome)
            card.attr('data-cod-plano', transformString(tv.nome))
            card.find('[data-melhor-oferta]').remove();
  
            card.find('[data-titulo]').text(tv.nome)
            monta_preco(tv, ofertas, card)
            clone.appendTo(slider_mask);
        }
  
    });
  
    if($('[data-tv-slide]').length <= 3) {
        $('[data-tv-slide]').parent().next('.left-arrow-2').removeClass('show')
        $('[data-tv-slide]').parent().next('.left-arrow-2').next('.right-arrow-2').removeClass('show')
    }
  
    if (tvs.length == 0) {
        $("[data-tab-for='tv']").hide();
        $("[data-tab='tv']").hide();
    }
  
    Webflow.require('slider').redraw();
  }
  
  function monta_preco(produto, ofertas, card) {
    var preco_normal = (produto.preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    var preco_nao_dccfd = (produto.preco_nao_dccfd / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    if(produto.ofertaId) {
        var oferta_atual = ofertas.filter(function(oferta) {
            return oferta.id == produto.ofertaId;
        })
  
        if(oferta_atual && oferta_atual[0] && oferta_atual[0].pfdd) {
            // var preco_sem_promo = preco_normal
            // var preco_sem_promo_dccfd = preco_nao_dccfd
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
                card.find('[data-valor-preco]').text(preco_normal).attr("data-valor-preco", preco_normal.replace(/[^0-9,]/g,''));
                card.find('[data-preco_nao_dccfd]').text(preco_nao_dccfd).attr("data-preco_nao_dccfd", preco_nao_dccfd.replace(/[^0-9,]/g,''));
                var obs = "Grátis por " + meses + mes_ou_meses
                card.find('[data-oferta-obs]').html('<strong>'+ obs +'</strong>');
            } else {
                // mostro o preço da promoção
                preco_nao_dccfd = (preco + 500)
                preco_nao_dccfd = (preco_nao_dccfd / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                preco = (preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                card.find('[data-valor-preco]').text(preco).attr("data-valor-preco", preco.replace(/[^0-9,]/g,''));
                card.find('[data-preco_nao_dccfd]').text(preco_nao_dccfd).attr("data-preco_nao_dccfd", preco_nao_dccfd.replace(/[^0-9,]/g,''));
                var obs = "Valor promocional por " + meses + mes_ou_meses
                card.find('[data-oferta-obs]').text(obs);
            }
        } else {
            card.find('[data-valor-preco]').text(preco_normal).attr("data-valor-preco", preco_normal.replace(/[^0-9,]/g,''));
            card.find('[data-preco_nao_dccfd]').text(preco_nao_dccfd).attr("data-preco_nao_dccfd", preco_nao_dccfd.replace(/[^0-9,]/g,''));
        }
    } else {
        card.find('[data-valor-preco]').text(preco_normal).attr("data-valor-preco", preco_normal.replace(/[^0-9,]/g,''));
        card.find('[data-preco_nao_dccfd]').text(preco_nao_dccfd).attr("data-preco_nao_dccfd", preco_nao_dccfd.replace(/[^0-9,]/g,''));
        card.find('[data-oferta-obs]').text('');
  
    }
  }
  
  function preco_produto(prod_combo, prod, preco_inicial){
  
    var ofertas = JSON.parse(sessionStorage.getItem('ofertas'))
      
      var preco_final = preco_inicial;
      var preco_oferta = preco_inicial;
  
      if( prod_combo && prod_combo.hasOwnProperty("ofertaId")){
          var oferta_produto = ofertas.find(function(i) {
              return i.id === prod_combo.ofertaId.toString();
          });
      
          if( oferta_produto === undefined ){
      
              if(prod.hasOwnProperty('ofertaId')){
                  oferta_produto = ofertas.find(function(iii) {
                      return iii.id === prod.ofertaId.toString();
                  });
      
      
                  if( oferta_produto !== undefined ){
                      preco_oferta = oferta_produto.pfdd.periodo[0].preco;
                  }else{
                      preco_oferta = preco_final;
                  }
              }else{
                  preco_oferta = preco_final;
              }
          }else{
              preco_oferta = oferta_produto.pfdd.periodo[0].preco;
          } 
      }else{
        if(prod.hasOwnProperty('ofertaId')){
            oferta_produto = ofertas.find(function(iii) {
                return iii.id === prod.ofertaId.toString();
            });


            if( oferta_produto !== undefined ){
                preco_oferta = oferta_produto.pfdd.periodo[0].preco;
            }else{
                preco_oferta = preco_final;
            }
        }else{
            preco_oferta = preco_final;
        }
      }
  
      preco_final = preco_oferta;
  
      return preco_final;
  }
  
  function calcula_valor_total_2(combo, internet, tv, retorna_numero = false) {
    var valorTotal = 0;
    var valor_internet = 0;
    var valor_tv = 0;
    if (combo.tv && combo.tv.preco) {
      valorTotal += preco_produto(combo.tv, tv, combo.tv.preco);
      valor_tv = preco_produto(combo.tv, tv, combo.tv.preco);
    } else {
      valorTvCheio = preco_produto(combo.tv, tv, tv.preco);
      valor_tv = valorTvCheio;
      valorTotal += valorTvCheio;
    }
    if (combo.internet && combo.internet.preco) {
      valorTotal += preco_produto(combo.internet, internet, combo.internet.preco);
      valor_internet = preco_produto(combo.internet, internet, combo.internet.preco);
    } else {
      valorInternetCheio = preco_produto(combo.internet, internet, internet.preco);
      valor_internet = valorInternetCheio;
      valorTotal += valorInternetCheio;
    }
    if(valorTotal == 0) return false
    if(retorna_numero) return [valorTotal, valor_internet, valor_tv]
    return [(valorTotal / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), valor_internet, valor_tv]
  }
  
  function avanca_etapa_3_novo(card_escolhido) {
  if (!card_escolhido.length) {
      $('#loadingspinner').hide(); console.log('card invalido')
  } else {
      sessionStorage.setItem('card_escolhido', card_escolhido[0].outerHTML)
      sessionStorage.setItem('plano_escolhido', card_escolhido.attr("data-nome-plano"))
      sessionStorage.setItem('tipo_plano_escolhido', card_escolhido.attr("data-tipo-plano"))
      sessionStorage.setItem('id_do_plano', card_escolhido.attr('data-id'))
      sessionStorage.setItem('valor_plano_escolhido', card_escolhido.find('[data-valor-preco]').attr('data-valor-preco'))
    //   if (!card_escolhido.find('[data-valor-preco]').attr('data-valor-preco')) { sessionStorage.setItem('valor_plano_escolhido', card_escolhido.find('[data-preco-combo]').text()) }
      sessionStorage.setItem('valor_plano_escolhido_nao_dccfd', card_escolhido.find("[data-preco_nao_dccfd]").attr('data-preco_nao_dccfd'))
      sessionStorage.setItem('plano_sku', card_escolhido.attr("data-sku"))
  
      if (card_escolhido.attr("data-tipo-plano") == 'internet') {
          var promotions = [];
          var additionalProducts = [];
          var plano_i_session = JSON.parse(sessionStorage.getItem('planos')).find(item => item.nome == card_escolhido.attr('data-nome-plano'))
          var oferta = JSON.parse(sessionStorage.getItem('ofertas')).find(item => item.id == plano_i_session.ofertaId)
  
          if(plano_i_session.recursosIds) {
            plano_i_session.recursosIds.forEach(function(recurso_id) {
              var recurso = extras.find(function(item) { return recurso_id == item.id });
              additionalProducts.push(recurso);
            })
          }

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
              price: card_escolhido.find('[data-valor-preco]').attr('data-valor-preco'),
              price_nao_dccfd: card_escolhido.find("[data-preco_nao_dccfd]").attr('data-preco_nao_dccfd'),
              kind: 'internet',
              promotions: promotions,
              additionalProducts: additionalProducts
          }))
          var valores = [card_escolhido.find('[data-valor-preco]').attr('data-valor-preco'), card_escolhido.find("[data-preco_nao_dccfd]").attr('data-preco_nao_dccfd')]
          atualiza_plano_no_banco_de_abandonos(card_escolhido.attr("data-nome-plano").replace(/\D/g, ''), valores)
      }
  
      else if (card_escolhido.attr("data-tipo-plano") == 'tv') {
          var promotions = [];
          var additionalProducts = [];
          var plano_tv_session = JSON.parse(sessionStorage.getItem('planos_tv')).find(item => item.nome == card_escolhido.attr('data-nome-plano'))
          var oferta = JSON.parse(sessionStorage.getItem('ofertas')).find(item => item.id == plano_tv_session.ofertaId)

          if(plano_tv_session.recursosIds) {
            plano_tv_session.recursosIds.forEach(function(recurso_id) {
              var recurso = extras.find(function(item) { return recurso_id == item.id });
              additionalProducts.push(recurso);
            })
          }

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
              price: card_escolhido.find('[data-valor-preco]').attr('data-valor-preco'),
              price_nao_dccfd: card_escolhido.find("[data-preco_nao_dccfd]").attr('data-preco_nao_dccfd'),
              kind: 'tv',
              promotions: promotions
          }))
          var valores = [card_escolhido.find('[data-valor-preco]').attr('data-valor-preco'), card_escolhido.find("[data-preco_nao_dccfd]").attr('data-preco_nao_dccfd')]
          atualiza_plano_no_banco_de_abandonos(card_escolhido.attr("data-nome-plano").replace(/\D/g, ''), valores)
      }
  
      else if (card_escolhido.attr("data-tipo-plano") == 'combo') {
        // AQUI
          var additionalProductsInternet = [];
          var additionalProductsTv = [];
          var plano_i = JSON.parse(sessionStorage.getItem('planos')).find(item => item.nome == card_escolhido.attr('data-internet'))
          var plano_tv = JSON.parse(sessionStorage.getItem('planos_tv')).find(item => item.nome == card_escolhido.attr('data-tv'))
          var selecao = find_selecao_by_id(plano_tv.id, plano_i.id, 0)

          if(plano_i.recursosIds) {
            plano_i.recursosIds.forEach(function(recurso_id) {
              var recurso = extras.find(function(item) { return recurso_id == item.id });
              additionalProductsInternet.push(recurso);
            })
          }

          if(plano_tv.recursosIds) {
            plano_tv.recursosIds.forEach(function(recurso_id) {
              var recurso = extras.find(function(item) { return recurso_id == item.id });
              additionalProductsTv.push(recurso);
            })
          }

          var plano_i_formatted = {
              sku: $('[data-nome-plano="' + card_escolhido.attr("data-internet") + '"]').attr('data-sku'),
              providerId: plano_i.id,
              name: plano_i.nome,
              price: card_escolhido.attr('data-preco-combo-internet'), 
              price_nao_dccfd: parseInt(card_escolhido.attr('data-preco-combo-internet')) > 0 ? parseInt(card_escolhido.attr('data-preco-combo-internet')) + 500 : 0,
              kind: 'internet',
              promotions: [],
              additionalProducts: additionalProductsInternet
          }
          var plano_tv_formatted = {
              sku: $('[data-nome-plano="' + card_escolhido.attr("data-tv") + '"]').attr('data-sku'),
              providerId: plano_tv.id,
              name: plano_tv.nome,
              price: card_escolhido.attr('data-preco-combo-tv'), 
              price_nao_dccfd: parseInt(card_escolhido.attr('data-preco-combo-tv')) > 0 ? parseInt(card_escolhido.attr('data-preco-combo-tv')) + 500 : 0,
              kind: 'tv',
              promotions: [],
              additionalProducts: additionalProductsTv
          }

          if (selecao) {
              if (selecao.internet) {
                  plano_i_formatted.promotions = [{
                      price: selecao.internet.preco,
                      validity: selecao.internet.adesaoParcelas
                  }]
                //   plano_i_formatted.price = selecao.internet.preco
                //   plano_i_formatted.price_nao_dccfd = selecao.internet.preco + 500
              }
              if (selecao.tv) {
                  plano_tv_formatted.promotions = [{
                      price: selecao.tv.preco,
                      validity: selecao.tv.adesaoParcelas
                  }]
                //   plano_tv_formatted.price = selecao.tv.preco
                //   plano_tv_formatted.price_nao_dccfd = selecao.tv.preco + 500
              }
          }
          sessionStorage.setItem('plano_internet', JSON.stringify(plano_i_formatted))
          sessionStorage.setItem('plano_tv', JSON.stringify(plano_tv_formatted))
          sessionStorage.setItem('preco_combo', card_escolhido.find('[data-preco-combo]').text())
  
          var valores = [plano_i_formatted.preco, plano_i_formatted.price_nao_dccfd]
          atualiza_plano_no_banco_de_abandonos(plano_i_formatted.sku, valores)
      }
      sessionStorage.removeItem('etapa')
      sessionStorage.setItem('etapa', 'etapa3')
      window.location.href = site + "/pagamento" + window.location.search
  }
  }
