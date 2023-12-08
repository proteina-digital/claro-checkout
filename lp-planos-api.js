function create_cards(tipo){
	var preco_final = 0;
    var preco_oferta = 0;
    var preco_boleto_final = 0;
    var periodo_oferta = 0;
    var preco_pos = 0;
    var mensagem = "";
    var url_params = "";
    var url_plano = "";

	if(tipo == 'planos_internet'){
    	var data_card = "internet";
    	url_plano = 'plano=INTERNET-';
    } else if (tipo == 'planos_tv') {
    	var data_card = "tv";
    	url_plano = 'plano=TV-';
    } else if (tipo == 'planos_celular') {
    	var data_card = "celular";
    } else if (tipo == 'planos_fixo') {
    	var data_card = "fixo";
    }else{
    	return;
    }


	if( sessionStorage.getItem(tipo) !== null ){
    	var planos = JSON.parse(sessionStorage.getItem(tipo));
    	var ofertas = JSON.parse(sessionStorage.getItem("ofertas"));
    	var recursos = JSON.parse(sessionStorage.getItem("recursos"));

		if( $('[data-cards="'+data_card+'"]').length > 0 ){
			var data_cards = $('[data-cards="'+data_card+'"]');
			var card_clonado = data_cards.find('.novo-slide').eq(0).clone();

			// remove todos os cards desse tipo
			data_cards.find('.novo-slide').remove();

			var qtd_planos = planos.length;
			var cc = 1;

			planos.reverse();

			for (var i = planos.length - 1; i >= 0; i--) {
				var plano = planos[i];

				card_clonado.removeAttr('aria-label');
				card_clonado.attr('aria-label', cc+' of '+qtd_planos);

				preco_final = plano.preco;
			    preco_boleto_final = plano.preco_nao_dccfd;

			    if(plano.hasOwnProperty("ofertaId")){
			        var oferta_produto = ofertas.find(function(i) {
			            return i.id === plano.ofertaId.toString();
			        });

			        if( oferta_produto !== undefined ){
			            preco_final = oferta_produto.pfdd.periodo[0].preco;
			            periodo_oferta = oferta_produto.pfdd.periodo[0].ate;
			            preco_boleto_final = preco_final + 500;
			            preco_pos = plano.preco;
			        }

			    }

			    url_plano = url_plano+plano.id;


				card_clonado.find(".novo-card-titulo").text(plano.nome);
				card_clonado.find(".novo-card-preco").text(formatarValor(preco_final));



				if (location.search.length) {
					url_params = location.search+"&";
				}else{
					url_params = '?';
				}


				if( data_card != 'celular' || data_card != 'fixo'){
					var textos = textos_obs_planos(plano.id, data_card);

					if( textos ){

						if( card_clonado.find("[data-card-obs-destaque]").length > 0 ){
							card_clonado.find("[data-card-obs-destaque]").text(textos);
						}else{
							card_clonado.find(".novos-cards-mascara").append('<p data-card-obs-destaque="" class="novo-card-chamada">'+textos+'</p>');
						}
					}else{
						if( card_clonado.find("[data-card-obs-destaque]").length > 0 ){
							card_clonado.find("[data-card-obs-destaque]").remove();
						}
					}

					card_clonado.find(".novo-card-botao").attr('target', '_blank').attr('href', 'https://carrinho.ofertasclaro.com.br/'+url_params+url_plano);

				}


				if( periodo_oferta > 0 ){
                    if(periodo_oferta > 1){
                        mensagem = "Nos "+periodo_oferta+" primeiros meses.";
                    }else{
                        mensagem = "No primeiro mês.";
                    }

                    card_clonado.find(".novo-card-area-preco").append('<p data-card-aviso-promo="" class="novo-card-preco-promocional">'+mensagem+'<br>Valor a partir do '+parseInt(periodo_oferta+1)+'º mês: '+formatarValor(preco_pos));
                }else{
                	card_clonado.find("[data-card-aviso-promo]").remove();
                }

                card_clonado.find(".novo-card-dropdown-list").find(".novo-dropdown-iitem").remove();

				if( plano.hasOwnProperty('recursosIds') ){

					plano.recursosIds.forEach(function(el) {
						if( recursos[el] ){
							card_clonado.find(".novo-card-dropdown-list").append('<div class="novo-dropdown-iitem">'+recursos[el].descricao+'</div>')
						}
					});
				}

				cc++;

				data_cards.find(".novos-cards-mascara").append(card_clonado.clone());
			}

			var alturaMaxima = 0;
		    data_cards.find(".novo-card-header").each(function() {
		        alturaMaxima = Math.max(alturaMaxima, $(this).outerHeight());
		    });

		    // Atribuir a altura máxima a todos os filhos
		    data_cards.find(".novo-card-header").css('height', alturaMaxima + 'px');

			Webflow.require('slider').redraw();
			Webflow.require('slider').ready();
			Webflow.require('dropdown').ready();
		}

	}

}



function textos_obs_planos(id, tipo){
	var resultado = false;

    if(tipo == 'tv'){
        switch (id) {
            case 594:
            case '594':
                resultado = 'Mais de cem canais ao vivo quando e onde você quiser';
                break;
            case 595:
            case '595':
                resultado = 'Conexão Wi-Fi: leve seu BOX para onde quiser';
                break;
            case 639:
            case '639':
                resultado = 'A melhor imagem na sua casa + Claro TV+';
                break;
            case 674:
            case '674':
                resultado = 'Conexão Wi-Fi: Leve seu BOX para onde quiser + Telecine';
                break;
            case 597:
            case '597':
                resultado = 'A melhor imagem na sua casa + Claro TV e Paramount';
                break;
            case 647:
            case '647':
                resultado = 'Tenha som e imagem de cinema em casa + Claro TV+';
                break;
            default:
                break;
        }
    }else if(tipo == 'internet'){

        switch (id) {
            case 434: // 250 mega
            case '434':
                resultado = 'Ideal para home office, jogar online e assistir vídeos com alta qualidade.';
                break;
            case 1181: // 350 mega
            case '1181':
                resultado = 'Ideal para assistir streaming de vídeo em 4K, jogar online ou trabalho remoto';
                break;
            case 435: // 500 mega
            case '435':
                resultado = 'Conecte mais de 10 aparelhos ao mesmo tempo sem perder a velocidade.';
                break;
            case 1078: // 750 mega
            case '1078':
                resultado = 'Mais velocidade de conexão para sua família.';
                break;
            case 796: // 500 Mega Netflix
            case '796':
                resultado = 'Conecte mais de 10 aparelhos ao mesmo tempo + Netflix';
                break;
            case 436: // 1 giga
            case '436':
                resultado = 'Mais velocidade para assistir streaming de vídeo em 4K, jogar online ou trabalho remoto.';
                break;
            default:
                break;
        }

    }else{

      switch (id) {
          case '594_1181_0': // 350 mega + app claro tv
             resultado = 'Contrate o Combo e tenha 350MB de internet + App Claro TV+';
              break;
          case '595_435_0': // 500 mega +box claro tv+
             resultado = 'Contrate o Combo e tenha 500MB de internet + Box Claro TV+';
              break;
          case '595_1181_0': // 350 mega + box claro tv
             resultado = 'Contrate o Combo e tenha 350MB de internet + Box Claro TV+';
              break;
          case '639_1078_0': // 750 mega + 4k claro tv+:
             resultado = 'Contrate o Combo e tenha 750MB de internet + 4K Claro TV+';
              break;
          default:
              break;
      }

    }

    return resultado;
}	
