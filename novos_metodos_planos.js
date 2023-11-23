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
            var valor_total = calcula_valor_total_2(combo, internet, tv, card)
            card.find('[data-preco-combo]').text(valor_total[0]).attr("data-preco-combo", valor_total[0]);
            card.attr('data-preco-combo-internet', valor_total[1]);
            card.attr('data-preco-combo-tv', valor_total[2]);
            monta_texto_promocional(card, combo, internet, tv, valor_total)
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
            var valor_total = calcula_valor_total_2(combo, internet, tv, card)
            card.find('[data-preco-combo]').text(valor_total[0]).attr("data-preco-combo", valor_total[0]);
            card.attr('data-preco-combo-internet', valor_total[1]);
            card.attr('data-preco-combo-tv', valor_total[2]);
            monta_texto_promocional(card, combo, internet, tv, valor_total)
            clone.appendTo(slider_mask);
        }

        txt_obs_planos(card, combo.id, 'combo');
  
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

  function monta_texto_promocional(card, combo, internet, tv, valor_total) {
    var qtt_meses = card.find('[data-promo-meses]').attr('data-promo-meses');
    var valor_apos = '';
    var valor_boleto = '';

    if(combo.tv && combo.internet) {
        valor_apos = ((combo.tv.preco + combo.internet.preco) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        valor_boleto = ((combo.tv.preco + combo.internet.preco + 1000) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else if (combo.internet) {
        valor_apos = ((tv.preco + combo.internet.preco) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        valor_boleto = ((tv.preco + combo.internet.preco + 1000) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else if (combo.tv) {
        valor_apos = ((combo.tv.preco + internet.preco) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        valor_boleto = ((combo.tv.preco + internet.preco + 1000) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    card.find('[data-valor-apos]').removeClass('destaque-combo');

    if(qtt_meses){
        card.find('[data-valor-apos]').html('Valor a partir do  ' + (Number(qtt_meses) + 1) + '° mês ' + valor_apos);
    }else{
        card.find('[data-valor-apos]').html('Com pagamento no débito e fatura digital ou R$ '+valor_boleto+' no boleto bancário');
    }

    card.attr('data-preco-combo-internet', valor_total[1]);
    card.attr('data-preco-combo-tv', valor_total[2]);
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

        txt_obs_planos(card, internet.id, 'internet');
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

        txt_obs_planos(card, tv.id, 'tv');
  
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
            } else {
                // mostro o preço da promoção
                preco_nao_dccfd = (preco + 500)
                preco_nao_dccfd = (preco_nao_dccfd / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                preco = (preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                card.find('[data-valor-preco]').text(preco).attr("data-valor-preco", preco.replace(/[^0-9,]/g,''));
                card.find('[data-preco_nao_dccfd]').text(preco_nao_dccfd).attr("data-preco_nao_dccfd", preco_nao_dccfd.replace(/[^0-9,]/g,''));
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
      var gratis_meses = false;
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
                      gratis_meses = oferta_produto.pfdd.periodo[0].ate
                      preco_oferta = oferta_produto.pfdd.periodo[0].preco;
                  }else{
                      preco_oferta = preco_final;
                  }
              }else{
                  preco_oferta = preco_final;
              }
          }else{
              gratis_meses = oferta_produto.pfdd.periodo[0].ate
              preco_oferta = oferta_produto.pfdd.periodo[0].preco;
          } 
      }else{
        if(prod.hasOwnProperty('ofertaId')){
            oferta_produto = ofertas.find(function(iii) {
                return iii.id === prod.ofertaId.toString();
            });


            if( oferta_produto !== undefined ){
                gratis_meses = oferta_produto.pfdd.periodo[0].ate
                preco_oferta = oferta_produto.pfdd.periodo[0].preco;
            }else{
                preco_oferta = preco_final;
            }
        }else{
            preco_oferta = preco_final;
        }
      }
  
      preco_final = preco_oferta;
      return [preco_final, gratis_meses];
  }
  
  function calcula_valor_total_2(combo, internet, tv, card, retorna_numero = false) {
    var valorTotal = 0;
    var valor_internet = 0;
    var valor_tv = 0;
    if (combo.tv && combo.tv.preco) {
      valorTotal += preco_produto(combo.tv, tv, combo.tv.preco)[0];
      valor_tv = preco_produto(combo.tv, tv, combo.tv.preco)[0];

      if(valor_tv == 0) {
        var mes_str;
        if (preco_produto(combo.tv, tv, combo.tv.preco)[1] == 1) {
          mes_str = 'mês'
        } else if (preco_produto(combo.tv, tv, combo.tv.preco)[1] > 1) {
          mes_str = 'meses'
        }

        var obs = "Grátis por " + preco_produto(combo.tv, tv, combo.tv.preco)[1] + ' '  + mes_str
        card.find('[data-oferta-obs-tv').attr('data-promo-meses',  preco_produto(combo.tv, tv, combo.tv.preco)[1]).html('<strong>'+ obs +'</strong>')
      } else if (preco_produto(combo.tv, tv, combo.tv.preco)[1]) {
        var mes_str;
        if (preco_produto(combo.tv, tv, combo.tv.preco)[1] == 1) {
          mes_str = 'mês'
        } else if (preco_produto(combo.tv, tv, combo.tv.preco)[1] > 1) {
          mes_str = 'meses'
        }
         // mostro o preço da promoção
          var obs = "Valor promocional por " + preco_produto(combo.tv, tv, combo.tv.preco)[1] + ' ' + mes_str
          card.find('[data-oferta-obs-tv]').attr('data-promo-meses',  preco_produto(combo.tv, tv, combo.tv.preco)[1]).html('<strong>'+ obs +'</strong>')
      }
    } else {
      valorTvCheio = preco_produto(combo.tv, tv, tv.preco)[0];
      valor_tv = valorTvCheio;
      valorTotal += valorTvCheio;
    }


    if (combo.internet && combo.internet.preco) {
      valorTotal += preco_produto(combo.internet, internet, combo.internet.preco)[0];
      valor_internet = preco_produto(combo.internet, internet, combo.internet.preco)[0];

      if(valor_internet == 0) {
        var mes_str;
        if (preco_produto(combo.internet, internet, combo.internet.preco)[1] == 1) {
          mes_str = 'mês'
        } else if (preco_produto(combo.internet, internet, combo.internet.preco)[1] > 1) {
          mes_str = 'meses'
        }
        
        var obs = "Grátis por " + mes_str        
        card.find('[data-oferta-obs-internet').html('<strong>'+ obs +'</strong>')
      }  else if (preco_produto(combo.internet, internet, combo.internet.preco)[1]) {
        var mes_str;
        if (preco_produto(combo.tv, tv, combo.tv.preco)[1] == 1) {
          mes_str = 'mês'
        } else if (preco_produto(combo.tv, tv, combo.tv.preco)[1] > 1) {
          mes_str = 'meses'
        }
         // mostro o preço da promoção
          var obs = "Valor promocional por " + preco_produto(combo.internet, internet, combo.internet.preco)[1] + ' ' + mes_str
          card.find('[data-oferta-obs-internet]').html('<strong>'+ obs +'</strong>');
      }
      
    } else {
      valorInternetCheio = preco_produto(combo.internet, internet, internet.preco)[0];
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
              var recurso_formatado = {
                id: recurso.id,
                name: recurso.nome,
                price: 0
              }
              additionalProducts.push(recurso_formatado);
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
              var recurso_formatado = {
                id: recurso.id,
                name: recurso.nome,
                price: 0
              }
              additionalProducts.push(recurso_formatado);
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
              promotions: promotions,
              additionalProducts: additionalProducts
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
              var recurso_formatado = {
                id: recurso.id,
                name: recurso.nome,
                price: 0
              }
              additionalProductsInternet.push(recurso_formatado);
            })
          }

          if(plano_tv.recursosIds) {
            plano_tv.recursosIds.forEach(function(recurso_id) {
              var recurso = extras.find(function(item) { return recurso_id == item.id });
              var recurso_formatado = {
                id: recurso.id,
                name: recurso.nome,
                price: 0
              }
              additionalProductsTv.push(recurso_formatado);
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


  function txt_obs_planos(card, id, tipo){
    if(tipo == 'tv'){
        if(card.find(".plano-destaque-txt.tv")){
            var plano_tv_obs = card.find(".plano-destaque-txt.tv");
        }else{
            return;
        }

        switch (id) {
            case 594:
            case '594':
                plano_tv_obs.text('Mais de cem canais ao vivo quando e onde você quiser');
                break;
            case 595:
            case '595':
                plano_tv_obs.text('Conexão Wi-Fi: leve seu BOX para onde quiser');
                break;
            case 639:
            case '639':
                plano_tv_obs.text('A melhor imagem na sua casa + Claro TV+');
                break;
            case 674:
            case '674':
                plano_tv_obs.text('Conexão Wi-Fi: Leve seu BOX para onde quiser + Telecine');
                break;
            case 597:
            case '597':
                plano_tv_obs.text('A melhor imagem na sua casa + Claro TV e Paramount');
                break;
            case 647:
            case '647':
                plano_tv_obs.text('Tenha som e imagem de cinema em casa + Claro TV+');
                break;
            default:
                plano_tv_obs.parent().hide();
                break;
        }
    }else if(tipo == 'internet'){

        if(card.find(".plano-destaque-txt.internet")){
            var plano_internet_obs = card.find(".plano-destaque-txt.internet");
        }else{
            return;
        }

        switch (id) {
            case 434: // 250 mega
            case '434':
                plano_internet_obs.text('Ideal para home office, jogar online e assistir vídeos com alta qualidade.');
                break;
            case 1181: // 350 mega
            case '1181':
                plano_internet_obs.text('Ideal para assistir streaming de vídeo em 4K, jogar online ou trabalho remoto');
                break;
            case 435: // 500 mega
            case '435':
                plano_internet_obs.text('Conecte mais de 10 aparelhos ao mesmo tempo sem perder a velocidade.');
                break;
            case 1078: // 750 mega
            case '1078':
                plano_internet_obs.text('Mais velocidade de conexão para sua família.');
                break;
            case 796: // 500 Mega Netflix
            case '796':
                plano_internet_obs.text('Conecte mais de 10 aparelhos ao mesmo tempo + Netflix');
                break;
            case 436: // 1 giga
            case '436':
                plano_internet_obs.text('Mais velocidade para assistir streaming de vídeo em 4K, jogar online ou trabalho remoto.');
                break;
            default:
                plano_internet_obs.parent().hide();
                break;
        }

    }else{

      if(card.find(".plano-destaque-txt")){
        var plano_obs = card.find(".plano-destaque-txt");
      }else{
          return;
      }

      switch (id) {
          case '594_1181_0': // 350 mega + app claro tv
              plano_obs.text('Contrate o Combo e tenha 350MB de internet + App Claro TV+');
              break;
          case '595_435_0': // 500 mega +box claro tv+
              plano_obs.text('Contrate o Combo e tenha 500MB de internet + Box Claro TV+');
              break;
          case '595_1181_0': // 350 mega + box claro tv
              plano_obs.text('Contrate o Combo e tenha 350MB de internet + Box Claro TV+');
              break;
          case '639_1078_0': // 750 mega + 4k claro tv+:
              plano_obs.text('Contrate o Combo e tenha 750MB de internet + 4K Claro TV+');
              break;
          default:
              plano_obs.parent().hide();
              break;
      }

    }
}
