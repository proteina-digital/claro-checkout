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

    	var controle_autorizados = 0;

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

				if (typeof planos_autorizados === 'function') {
					var combosautorizados = planos_autorizados(tipo);

					if(combosautorizados.length > 0){
						if( !combosautorizados.includes(plano.id) ){
							continue;
						}else{
							controle_autorizados++;
						}
					}
				}

				if( controle_autorizados > 0){
					card_clonado.addClass('novo-slide-menor');

					if (i === 0 && controle_autorizados < 4) {
						data_cards.find(".novos-cards-mascara").addClass("novos-cards-mascara-menor");
					}
				}

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

					card_clonado.find("[data-btn-contratar]").attr('target', '_blank').attr('href', 'https://carrinho.ofertasclaro.com.br/'+url_params+url_plano);

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

				periodo_oferta = 0;

				cc++;

				data_cards.find(".novos-cards-mascara").append(card_clonado.clone());
			}

			var alturaMaxima = 0;
		    data_cards.find(".novo-card-header").each(function() {
		        alturaMaxima = Math.max(alturaMaxima, $(this).outerHeight());
		    });

		    var alturaMaximaap = 0;
		    data_cards.find(".novo-card-area-preco").each(function() {
		        alturaMaximaap = Math.max(alturaMaximaap, $(this).outerHeight());
		    });

		    // Atribuir a altura máxima a todos os filhos
		    data_cards.find(".novo-card-header").css('height', alturaMaxima + 'px');
		    data_cards.find(".novo-card-area-preco").css('min-height', alturaMaximaap + 'px');

			Webflow.require('slider').redraw();
			Webflow.require('slider').ready();
			Webflow.require('dropdown').ready();
		}

	}

}


function create_cards_combo(){
	var selecoes = JSON.parse(sessionStorage.getItem("selecoes"));
	var ofertas = JSON.parse(sessionStorage.getItem("ofertas"));
	var recursos = JSON.parse(sessionStorage.getItem("recursos"));
	var planos_internet = JSON.parse(sessionStorage.getItem("planos_internet"));
    var planos_tv = JSON.parse(sessionStorage.getItem("planos_tv"));
    var planos_celular = JSON.parse(sessionStorage.getItem("planos_celular"));
    var planos_fixo = JSON.parse(sessionStorage.getItem("planos_fixo"));

	var preco_tv = 0;
    var preco_internet = 0;
    var preco_celular = 0;
    var preco_fixo = 0;

    var nome_tv = '';
    var nome_internet = '';
    var nome_cel = '';
    var nome_tel = '';

	var preco_final = 0;
    var preco_oferta = 0;
    var preco_boleto_final = 0;
    var tempo_desconto = 0;
    var preco_pos = 0;
    var mensagem = "";
    var url_params = "";
    var url_plano = 'plano=COMBO-';

    var data_card = "combos";

    var titulo_combo = '';
    var controle_autorizados = 0;

	

	if( selecoes !== null ){

		if( $('[data-cards="'+data_card+'"]').length > 0 ){
			var data_cards = $('[data-cards="'+data_card+'"]');
			var card_clonado = data_cards.find('.novo-slide').eq(0).clone();

			// remove todos os cards desse tipo
			data_cards.find('.novo-slide').remove();

			var qtd_planos = selecoes.length;
			var cc = 1;

			selecoes.reverse();

			for (var i = selecoes.length - 1; i >= 0; i--) {
				var plano_combo = selecoes[i];

				if (i === 0) {
					data_cards.find(".novos-cards-mascara").addClass("novos-cards-mascara-menor");
				}

				if (typeof combos_autorizados === 'function') {
					var combosautorizados = combos_autorizados();
					if(combosautorizados.length > 0){
						if( !combosautorizados.includes(plano_combo.id) ){
							continue;
						}else{
							controle_autorizados++;
						}
					}
				}

				if( controle_autorizados > 0){
					card_clonado.addClass('novo-slide-menor');

					if (i === 0 && controle_autorizados < 4) {
						data_cards.find(".novos-cards-mascara").addClass("novos-cards-mascara-menor");
					}
				}

			
				card_clonado.removeAttr('aria-label');
				card_clonado.attr('aria-label', cc+' of '+qtd_planos);
				card_clonado.attr('data-card-id', plano_combo.id);


				// INICIO TRATAMENTO DE COMBOS
				var ids_combos = formata_combos(plano_combo.id);

				var selecao_combo = selecoes.find(function(item) {
                    return item.id === plano_combo.id;
                });


				// FORMATAR NOMES DE TV E/OU INTERNET
                if( ids_combos[0] != 0 && ids_combos[0] !== undefined && ids_combos[1] != 0 && ids_combos[1] !== undefined ){
                	var plano_tv = planos_tv.find(function(i) {
	                    return i.id === ids_combos[0].toString();
	                });


	                var plano_internet = planos_internet.find(function(i) {
	                    return i.id === ids_combos[1].toString();
	                });

                	titulo_combo = removerTermoDaPrimeiraString(plano_internet.nome, plano_tv.nome, 'Globoplay') +' + '+ plano_tv.nome; // INTERNET + TV

                }else if( ids_combos[0] != 0 && ids_combos[1] != 1 ){

                	var plano_tv = planos_tv.find(function(i) {
	                    return i.id === ids_combos[0].toString();
	                });

                	titulo_combo = plano_tv.nome.nome; // TV

                }else{
                	var plano_internet = planos_internet.find(function(i) {
	                    return i.id === ids_combos[1].toString();
	                });

                	titulo_combo = plano_internet.nome; // INTERNET

                }


                card_clonado.find(".novo-card-dropdown-list").find(".novo-dropdown-iitem").remove();


				// TV
				if(ids_combos[0] != 0 && ids_combos[0] !== undefined){
                    ret_tv = preco_combo("tv", selecao_combo, planos_tv, ofertas);
                    preco_tv = ret_tv[0];
                    preco_tv_sdesconto = ret_tv[1];

                    if(ret_tv[2] != 0){
                        tempo_desconto = ret_tv[2];
                    }else{
                        preco_tv_sdesconto = preco_tv;
                    }

                    titulo_combo = titulo_combo;

                    if( plano_tv.hasOwnProperty('recursosIds') ){

						plano_tv.recursosIds.forEach(function(el) {
							if( recursos[el] ){
								card_clonado.find(".novo-card-dropdown-list").append('<div class="novo-dropdown-iitem"><strong>TV</strong>: '+recursos[el].descricao+'</div>')
							}
						});
					}

                }

                // INTERNET
                if(ids_combos[1] != 0 && ids_combos[1] !== undefined){
                    ret_net = preco_combo("internet", selecao_combo, planos_internet, ofertas);
                    preco_internet = ret_net[0];
                    preco_internet_sdesconto = ret_net[1];


                    if(ret_net[2] != 0){
                        tempo_desconto = ret_net[2];
                    }else{
                        preco_internet_sdesconto = preco_internet;
                    }

                    titulo_combo = titulo_combo;

                    if( plano_internet.hasOwnProperty('recursosIds') ){

						plano_internet.recursosIds.forEach(function(el) {
							if( recursos[el] ){
								card_clonado.find(".novo-card-dropdown-list").append('<div class="novo-dropdown-iitem"><strong>INTERNET</strong>: '+recursos[el].descricao+'</div>')
							}
						});
					}
                }


                // CELULAR
                if(ids_combos[3] != 0 && ids_combos[3] !== undefined){
                    ret_cel = preco_combo("celular", selecao_combo, planos_celular, ofertas);
                    preco_celular = ret_cel[0];
                    preco_cel_sdesconto = ret_cel[1];

                    var plano_celular = planos_celular.find(function(i) {
	                    return i.id === ids_combos[3];
	                });

                    titulo_combo += titulo_combo != '' ? ' + '+plano_celular.nome : plano_celular.nome;

                    if(ret_cel[2] != 0){
                        tempo_desconto = ret_cel[2];
                    }else{
                        preco_cel_sdesconto = preco_celular;
                    }

                    if( plano_celular.hasOwnProperty('recursosIds') ){

						plano_celular.recursosIds.forEach(function(el) {
							if( recursos[el] ){
								card_clonado.find(".novo-card-dropdown-list").append('<div class="novo-dropdown-iitem"><strong>MÓVEL</strong>: '+recursos[el].descricao+'</div>')
							}
						});
					}
                }


                // TELEFONE FIXO
                if(ids_combos[2] != 0 && ids_combos[2] !== undefined){
                    ret_tel = preco_combo("fone", selecao_combo, planos_fixo, ofertas);
                    preco_fixo = ret_tel[0];
                    preco_fixo_sdesconto = ret_tel[1];

                    var plano_fixo = planos_fixo.find(function(i) {
	                    return i.id === ids_combos[2];
	                });

                    titulo_combo += titulo_combo != '' ? ' + '+plano_fixo.nome : plano_fixo.nome;

                    if(ret_tel[2] != 0){
                        tempo_desconto = ret_tel[2];
                    }else{
                        preco_fixo_sdesconto = preco_fixo;
                    }

                    if( plano_fixo.hasOwnProperty('recursosIds') ){

						plano_fixo.recursosIds.forEach(function(el) {
							if( recursos[el] ){
								card_clonado.find(".novo-card-dropdown-list").append('<div class="novo-dropdown-iitem"><strong>TEL</strong>: '+recursos[el].descricao+'</div>')
							}
						});
					}
                }


   
			    url_plano = url_plano+plano_combo.id;


				card_clonado.find(".novo-card-titulo").text(titulo_combo.toUpperCase());
				card_clonado.find(".novo-card-preco").text(formatarValor(preco_tv + preco_internet + preco_celular + preco_fixo));



				if (location.search.length) {
					url_params = location.search+"&";
				}else{
					url_params = '?';
				}


				var textos = textos_obs_planos(plano_combo.id, 'combo');

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

				card_clonado.find("[data-btn-contratar]").attr('target', '_blank').attr('href', 'https://carrinho.ofertasclaro.com.br/'+url_params+url_plano);

				// zerando novamente
				url_plano = 'plano=COMBO-';



				if( tempo_desconto > 0 ){
                    if(tempo_desconto > 1){
                        mensagem = "Nos "+tempo_desconto+" primeiros meses.";
                    }else{
                        mensagem = "No primeiro mês.";
                    }

                    var valor_final_sem_desconto = preco_tv_sdesconto + preco_internet_sdesconto + preco_cel_sdesconto + preco_fixo_sdesconto;

                    card_clonado.find(".novo-card-area-preco").append('<p data-card-aviso-promo="" class="novo-card-preco-promocional">'+mensagem+'<br>Valor a partir do '+parseInt(tempo_desconto+1)+'º mês: '+formatarValor(valor_final_sem_desconto));
                }else{
                	card_clonado.find("[data-card-aviso-promo]").remove();
                }

                tempo_desconto = 0;

				cc++;

				data_cards.find(".novos-cards-mascara").append(card_clonado.clone());

				preco_tv = 0
				preco_internet = 0
				preco_celular = 0
				preco_fixo = 0

				preco_tv_sdesconto = 0
				preco_internet_sdesconto = 0
				preco_cel_sdesconto = 0
				preco_fixo_sdesconto = 0
			}

			var alturaMaxima = 0;
		    data_cards.find(".novo-card-header").each(function() {
		        alturaMaxima = Math.max(alturaMaxima, $(this).outerHeight());
		    });

		    var alturaMaximaap = 0;
		    data_cards.find(".novo-card-area-preco").each(function() {
		        alturaMaximaap = Math.max(alturaMaximaap, $(this).outerHeight());
		    });

		    // Atribuir a altura máxima a todos os filhos
		    data_cards.find(".novo-card-header").css('height', alturaMaxima + 'px');
		    data_cards.find(".novo-card-area-preco").css('min-height', alturaMaximaap + 'px');

			Webflow.require('slider').redraw();
			Webflow.require('slider').ready();
			Webflow.require('dropdown').ready();

			// if( controle_autorizados == 3 ){
			// 	data_cards.find(".novos-cards-mascara").addClass("novos-cards-mascara-menor");
			// 	break;
			// }
		}

	}

}


function removerTermoDaPrimeiraString(string1, string2, termo) {
  // Cria uma expressão regular com o termo e a flag 'i' para case-insensitive
  const regex = new RegExp(termo, 'i');

  // Testa se o termo existe em ambas as strings
  const existeNaString1 = regex.test(string1);
  const existeNaString2 = regex.test(string2);

  var str1 = string1;

  if( existeNaString1 && existeNaString2 ){
  	str1 = string1.replace(regex, '');
  }

  return str1;
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
