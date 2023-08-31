function find_selecao_by_id(id_tv, id_internet, id_celular = 0) {
  // var id = tv, internet, 
  var id_selecao = id_tv + '_' + id_internet + '_' + id_celular
  var _selecoes = sessionStorage.getItem('selecoes') || []
  for (const elemento of _selecoes) {
    const elementoChave = Object.keys(elemento)[0]; // Obtém a chave do elemento
    if (elementoChave === id_selecao) {
      return elemento[elementoChave]; // Retorna o valor correspondente à chave encontrada
    }
  }
  return null;
}

function avanca_etapa_3(card_escolhido) {
 if (!card_escolhido.length) {
   $('#loadingspinner').hide(); console.log('card invalido')
  } else {
   // var _plano = btn_plano.closest('[data-card]').attr('data-card');
   // atualiza_plano_no_banco_de_abandonos(_plano);
   sessionStorage.setItem('card_escolhido', card_escolhido[0].outerHTML)
   sessionStorage.setItem('plano_escolhido', card_escolhido.attr("data-nome-plano"))
   sessionStorage.setItem('tipo_plano_escolhido', card_escolhido.attr("data-tipo-plano"))
   sessionStorage.setItem('id_do_plano', card_escolhido.attr('data-id'))
   sessionStorage.setItem('valor_plano_escolhido', card_escolhido.find('.preco-combo').attr('preco-combo'))
   if(!card_escolhido.find('.preco-combo').attr('preco-combo')) { sessionStorage.setItem('valor_plano_escolhido', card_escolhido.find('[data-preco-combo]').text()) }
   sessionStorage.setItem('valor_plano_escolhido_nao_dccfd', card_escolhido.find("[data-preco_nao_dccfd]").text())
   sessionStorage.setItem('plano_sku', card_escolhido.attr("data-sku"))

    if(card_escolhido.attr("data-tipo-plano") == 'internet') {
        sessionStorage.setItem('plano_internet', JSON.stringify({
            sku: card_escolhido.attr("data-sku"),
            providerId: card_escolhido.attr('data-id'),
            name: card_escolhido.attr("data-nome-plano"),
            price: card_escolhido.find('.preco-combo').attr('preco-combo'),
            price_nao_dccfd: card_escolhido.find("[data-preco_nao_dccfd]").text(),
            kind: 'internet',
        }))
    }

    else if(card_escolhido.attr("data-tipo-plano") == 'tv') {
        sessionStorage.setItem('plano_tv', JSON.stringify({
            sku: card_escolhido.attr("data-sku"),
            providerId: card_escolhido.attr('data-id'),
            name: card_escolhido.attr("data-nome-plano"),
            price: card_escolhido.find('.preco-combo').attr('preco-combo'),
            price_nao_dccfd: card_escolhido.find("[data-preco_nao_dccfd]").text(),
            kind: 'tv',
        }))
    }

    else if(card_escolhido.attr("data-tipo-plano") == 'combo') {
        find_selecao_by_id(plano_tv.id, plano_i.id, 0);

        var plano_i = JSON.parse(sessionStorage.getItem('planos')).find(item => item.nome == card_escolhido.attr('data-internet'))
        var plano_tv = JSON.parse(sessionStorage.getItem('planos_tv')).find(item => item.nome == card_escolhido.attr('data-tv'))
        sessionStorage.setItem('plano_internet', JSON.stringify({
            sku: $('[data-nome-plano="'+ card_escolhido.attr("data-internet") +'"]').attr('data-sku'),
            providerId: plano_i.id,
            name: plano_i.nome,
            price: plano_i.preco,
            price_nao_dccfd: plano_i.preco_nao_dccfd,
            kind: 'internet',
        }))
        sessionStorage.setItem('plano_tv', JSON.stringify({
            sku: $('[data-nome-plano="'+ card_escolhido.attr("data-tv") +'"]').attr('data-sku'),
            providerId: plano_tv.id,
            name: plano_tv.nome,
            price: plano_tv.preco,
            price_nao_dccfd: plano_tv.preco_nao_dccfd,
            kind: 'tv',
        }))
        sessionStorage.setItem('preco_combo', card_escolhido.find('[data-preco-combo]').text())
  }

  sessionStorage.removeItem('etapa')
  sessionStorage.setItem('etapa', 'etapa3')
  window.location.href = site + "/pagamento" + window.location.search
 }
}
