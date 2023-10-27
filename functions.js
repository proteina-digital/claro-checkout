function extrairNomeCidade(nomeArquivo) {
    const regex = /assine_v3_(.*?)\.json/;
    const match = nomeArquivo.match(regex);
  
    if (match) {
      const nomeCidade = match[1];
      return nomeCidade;
    } else {
      return false;
    }
}

function formatarValor(valor) {
    var valorEmReais = (valor / 100).toFixed(2); 
    valorEmReais = valorEmReais.toString();
    var partes = valorEmReais.split('.');
    var parteInteiraFormatada = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    var valorFormatado = "R$ " + parteInteiraFormatada + "," + partes[1];
    return valorFormatado;
}


function formata_ofertas(resposta) {
  var todas_ofertas = resposta.ofertas

  var todas_ofertas_array = [];
  
  for (const chave in todas_ofertas) {
      const elemento = {};
      elemento[chave] = todas_ofertas[chave]
      todas_ofertas_array.push(elemento);
  }


  var ofertas_encontradas = [];
  var ofertas_autorizadas = [];

  var planos_tv = JSON.parse(sessionStorage.getItem('planos_tv'))
  planos_tv.forEach(function(plano) {
      ofertas_autorizadas.push(plano.ofertaId)
  })

  var ofertas_encontradas = [];
  ofertas_autorizadas.forEach(function(oferta_autorizada) {
      var oferta = encontrar_elemento_por_ids(todas_ofertas_array, oferta_autorizada, false)
      if(oferta) {
          ofertas_encontradas.push(oferta);
      }
  })

  return ofertas_encontradas;
}

function formata_ofertas2(resposta) {
  var todas_ofertas = resposta.ofertas

  var todas_ofertas_array = [];

  var ofertas_autorizadas = [];

  jQuery.each(todas_ofertas, function (indexInArray, valueOfElement) { 
    ofertas_autorizadas.push(valueOfElement)
  });

  return ofertas_autorizadas;
}

function encontrar_elemento_por_ids(array, ids, ids_combinados = true) {
    var chave;
    if(ids_combinados) { chave = ids.join('_');
    } else { chave = ids; }
    for (const elemento of array) {
        const elementoChave = Object.keys(elemento)[0];
        if (elementoChave == chave) {
        return elemento[elementoChave];
        }
    }
    return null;
}

function formata_combos(combo){
    var ids = combo.split('_');
    return ids;
}

function formata_resposta(resposta, somente_autorizados = true) {
    var produtos = resposta.produtos
    var ofertas = resposta.ofertas
    var internets = produtos.internet
    var tvs = produtos.tv
    var celulares = produtos.celular
    var telefones = produtos.fone
    var internets_autorizados = ['125 Mega', '250 Mega', '350 Mega', '500 Mega', '1 Giga']
    var tv_autorizados = ['BOX CLARO TV+', 'APP CLARO TV+', '4K CLARO TV+']
    var celulares_autorizados = ['Controle 15 GB', 'Controle 20 GB', 'Pós 50 GB', 'Pós 200 GB']

    var array_controle = []
    var internet = []
    var tv_lista = []
    var celular_lista = []
    var telefone_lista = []

    var internets_array = Object.entries(internets)
    var tvs_array = Object.entries(tvs)
    var celulares_array = Object.entries(celulares)
    var telefones_array = Object.entries(telefones)

    for (let i = 0; i < internets_array.length; i++) {
        var key = internets_array[i][0];
        var plano_internet = internets_array[i][1];
        if(!plano_internet.exibir) {
            continue;
        }

        var nome_nao_autorizado = internets_autorizados.indexOf(plano_internet.nome) === -1
        if(nome_nao_autorizado && somente_autorizados) {
            continue;
        }
        var preco_nao_dccfd = plano_internet.preco + plano_internet.acrescimoNaoDCCFD
        internet.push({
            id: plano_internet.id,
            tipo: 'internet',
            nome: plano_internet.nome,
            preco: plano_internet.preco,
            preco_nao_dccfd: preco_nao_dccfd,
            key: key,
            adesaoParcelas: plano_internet.adesaoParcelas,
            adesao: plano_internet.adesao,
            ofertaId: plano_internet.ofertaId
        })
    }

    for (let i = 0; i < tvs_array.length; i++) {
        var key = tvs_array[i][0];
        var plano_tv = tvs_array[i][1];
        if(!plano_tv.exibir) {
            continue;
        }

        var nome_nao_autorizado = tv_autorizados.indexOf(plano_tv.nome) === -1

        if(nome_nao_autorizado && somente_autorizados) {
            continue;
        }

        var preco_nao_dccfd = plano_tv.preco + plano_tv.acrescimoNaoDCCFD
        tv_lista.push({
            id: plano_tv.id,
            tipo: 'tv',
            nome: plano_tv.nome,
            preco: plano_tv.preco,
            preco_nao_dccfd: preco_nao_dccfd,
            key: key,
            adesaoParcelas: plano_tv.adesaoParcelas,
            adesao: plano_tv.adesao,
            ofertaId: plano_tv.ofertaId
        })
    }

    for (let i = 0; i < celulares_array.length; i++) {
        var key = celulares_array[i][0];
        var plano_celular = celulares_array[i][1];
        if(!plano_celular.exibir) {
            continue;
        }

        var nome_nao_autorizado = celulares_autorizados.indexOf(plano_celular.nome) === -1
        if(nome_nao_autorizado && somente_autorizados) {
            continue;
        }

        var preco_nao_dccfd = plano_celular.preco + plano_celular.acrescimoNaoDCCFD
        celular_lista.push({
            id: plano_celular.id,
            tipo: 'celular',
            nome: plano_celular.nome,
            preco: plano_celular.preco,
            preco_nao_dccfd: preco_nao_dccfd,
            key: key,
            adesaoParcelas: plano_celular.adesaoParcelas,
            adesao: plano_celular.adesao,
            ofertaId: plano_celular.ofertaId
        })
    }

    for (let i = 0; i < telefones_array.length; i++) {
        var key = telefones_array[i][0];
        var plano_telefone = telefones_array[i][1];
        if(!plano_telefone.exibir) {
            continue;
        }

        var preco_nao_dccfd = plano_telefone.preco + plano_telefone.acrescimoNaoDCCFD
        telefone_lista.push({
            id: plano_telefone.id,
            tipo: 'telefone',
            nome: plano_telefone.nome,
            preco: plano_telefone.preco,
            preco_nao_dccfd: preco_nao_dccfd,
            key: key,
            adesaoParcelas: plano_telefone.adesaoParcelas,
            adesao: plano_telefone.adesao,
            ofertaId: plano_telefone.ofertaId
        })
    }
    return [internet, tv_lista, celular_lista, telefone_lista];
}

function popula_cards(tipo){
    if(tipo == 'planos_internet'){
    	var data_card = "data-card-internet";
    } else if (tipo == 'planos_tv') {
    	var data_card = "data-card-tv";
    } else if (tipo == 'planos_celular') {
    	var data_card = "data-card-cel";
    } else if (tipo == 'planos_fixo') {
    	var data_card = "data-card-fixo";
    }else{
    	return;
    }
    
    if( sessionStorage.getItem(tipo) !== null ){
    	var planos = JSON.parse(sessionStorage.getItem(tipo));
    
    
    	if( jQuery("div["+data_card+"]").length > 0 ){
    		jQuery("div["+data_card+"]").each(function (index, element) {
    			var card = $(this);
    			var controle_ids = false;
    
    			card.show();
    			Webflow.require('slider').redraw();
    
    			if(card.attr(data_card)){
    				var card_prod_ids = card.attr(data_card);
    				var card_prod_id_splitted = card_prod_ids.split("-");
    
    				for (let index = 0; index < card_prod_id_splitted.length; index++) {
    					var card_prod_id = card_prod_id_splitted[index];
    
    					var objetoEncontrado = planos.find(function(item) {
    						return item.id === card_prod_id;
    					});
    
    					if(!objetoEncontrado){
    						continue;
    					}
    
    					controle_ids = true;
    
    					card.find("[data-card-nome]").text(objetoEncontrado.nome);
    					card.find("[data-card-preco]").text(formatarValor(objetoEncontrado.preco));
    					card.find(".preco-boleto").text(formatarValor(objetoEncontrado.preco_nao_dccfd));
    				}
    			}else{
    				card.hide();
    				Webflow.require('slider').redraw();
    			}
    
    			if(!controle_ids){
    				card.hide();
    				Webflow.require('slider').redraw();
    			}
    		});
    	}
    }
}


function preco_combo(tipo, objetoEncontrado, plano_produto, ofertas){
    var preco_sem_desconto = 0;
    var preco_final = 0;
    var periodo_oferta = 0;

    if(tipo == "internet"){
        var objencontrado = objetoEncontrado.internetId;
        var objencontrado_prod = objetoEncontrado.internet;
    }else if(tipo == "tv"){
        var objencontrado = objetoEncontrado.tvId;
        var objencontrado_prod = objetoEncontrado.tv;
    }else if(tipo == "celular"){
        var objencontrado = objetoEncontrado.celularId;
        var objencontrado_prod = objetoEncontrado.celular;
    }else{
        var objencontrado = objetoEncontrado.foneId;
        var objencontrado_prod = objetoEncontrado.fone;
    }

    if(objencontrado != 0){

        var p = plano_produto.find(item => item.id === objencontrado.toString());

        preco_final = p.preco;
        preco_sem_desconto = p.preco;

        if(objetoEncontrado.hasOwnProperty(tipo)){

            preco_final = objencontrado_prod.preco;

            if(objencontrado_prod.hasOwnProperty("ofertaId")){
                var oferta_produto = ofertas.find(function(i) {
                    return i.id === objencontrado_prod.ofertaId.toString();
                });

                if( oferta_produto === undefined ){
            
                    if(p.hasOwnProperty('ofertaId')){
                        oferta_produto = ofertas.find(function(iii) {
                            return iii.id === p.ofertaId.toString();
                        });


						if( oferta_produto !== undefined ){
							preco_oferta = oferta_produto.pfdd.periodo[0].preco;
                        	periodo_oferta = oferta_produto.pfdd.periodo[0].ate;
						}else{
							preco_oferta = preco_final;
						}
                    }
                }else{
                    preco_oferta = oferta_produto.pfdd.periodo[0].preco;
                    periodo_oferta = oferta_produto.pfdd.periodo[0].ate;
                }

                preco_final = preco_oferta;
            }
        }else{
            
            if(p.hasOwnProperty('ofertaId')){
                oferta_produto = ofertas.find(function(iii) {
                    return iii.id === p.ofertaId.toString();
                });

				if( oferta_produto !== undefined ){
					preco_oferta = oferta_produto.pfdd.periodo[0].preco;
					periodo_oferta = oferta_produto.pfdd.periodo[0].ate;
				}else{
					preco_oferta = preco_final;
				}

                preco_final = preco_oferta;
            }
        }

    }

    return [preco_final, preco_sem_desconto, periodo_oferta, "tipo:"+tipo+" - "+objencontrado];
}
