      function _GETURL(variavel) {
        var url = window.location.search.replace("?", "");
        var itens = url.split("&");
        for (n in itens) {
          if (itens[n].match(variavel)) {
            return decodeURIComponent(itens[n].replace(variavel + "=", ""));
          }
        }
        return null;
      }
      
      function SAVE_UTM_DATA() {
        if (_GETURL("utm_campaign")) {
          window.sessionStorage.setItem("utm_campaign", _GETURL("utm_campaign"));
        }
    
        if (_GETURL("utm_medium")) {
          window.sessionStorage.setItem("utm_medium", _GETURL("utm_medium"));
        }
    
        if (_GETURL("utm_source")) {
          window.sessionStorage.setItem("utm_source", _GETURL("utm_source"));
        }
    
        if (_GETURL("utm_term")) {
          window.sessionStorage.setItem("utm_term", _GETURL("utm_term"));
        }
    
        if (_GETURL("utm_content")) {
          window.sessionStorage.setItem("utm_content", _GETURL("utm_content"));
        }
      }
      function monta_location_search() {
        // '?utm_source=teste&utm_medium=teste&utm_campaign=teste&utm_id=teste&utm_term=teste&utm_content=teste'
    
        const obj = {};
        if (window.sessionStorage.getItem("utm_campaign")) {
          obj["utm_campaign"] = window.sessionStorage.getItem("utm_campaign");
        }
        if (window.sessionStorage.getItem("utm_medium")) {
          obj["utm_medium"] = window.sessionStorage.getItem("utm_medium");
        }
        if (window.sessionStorage.getItem("utm_source")) {
          obj["utm_source"] = window.sessionStorage.getItem("utm_source");
        }
        if (window.sessionStorage.getItem("utm_term")) {
          obj["utm_term"] = window.sessionStorage.getItem("utm_term");
        }
        if (window.sessionStorage.getItem("utm_content")) {
          obj["utm_content"] = window.sessionStorage.getItem("utm_content");
        }
        return $.param(obj);
      }

    function getUrlParams(urlOrQueryString) {
      if (typeof urlOrQueryString !== 'undefined' && urlOrQueryString !== null) {
          if ((i = urlOrQueryString.indexOf("?")) >= 0) {
              const queryString = urlOrQueryString.substring(i + 1);
              if (queryString) {
                  return _mapUrlParams(queryString);
              }
          }
      }

      return {};
    }
  
    function _mapUrlParams(queryString) {
      return queryString.split("&").reduce(function (urlParams, urlParam) {
        urlParam = urlParam.split("=");
        if (
          Number.isInteger(parseInt(urlParam[1])) &&
          parseInt(urlParam[1]) == urlParam[1]
        ) {
          urlParams[urlParam[0]] = parseInt(urlParam[1]);
        } else {
          urlParams[urlParam[0]] = decodeURI(urlParam[1]);
        }
        return urlParams;
      }, {});
    }
  
    function updateQueryStringParameter(uri, key, value) {
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf("?") !== -1 ? "&" : "?";
      if (uri.match(re)) {
        return uri.replace(re, "$1" + key + "=" + value + "$2");
      } else {
        return uri + separator + key + "=" + value;
      }
    }

function palavraExisteNaString(string, palavra) {
    var regex = new RegExp('\\b' + palavra + '\\b', 'i');
    return regex.test(string);
}

function gerarProdutosSchema() {
    // Array para armazenar os dados dos produtos
    let produtos = [];

    // Itera sobre cada card de produto
    if( $('.claro-div-card-oferta').length ){
      $('.claro-div-card-oferta').each(function() {
          // Objeto para armazenar os dados de cada produto
          let produto = {
              "@context": "http://schema.org/",
              "@type": "Product",
              "name": "",
              "description": "",
              "brand": {
                  "@type": "Brand",
                  "name": "Claro" // Você pode ajustar o nome da marca conforme necessário
              },
              "offers": {
                  "@type": "Offer",
                  "priceCurrency": "BRL",
                  "price": "",
                  "availability": "http://schema.org/InStock"
              },
              "image": "",
              "additionalProperty": []
          };

          // Extrai os dados do nome, velocidade, preço e imagem do produto
          let product_name = $(this).find('.text-block-25').eq(0).text()+' ';
          product_name += $(this).find('p.paragraph').eq(0).text();
          produto.name = product_name;
          produto.description = $(this).find('.div-titulo-card p').text().trim();
          
          // Convertendo o preço para o formato xx.xx
          let precoText = $(this).find('.preco-card1').text().trim();
          let precoNumerico = parseFloat(precoText.replace('R$', '').replace(',', '.'));
          produto.offers.price = precoNumerico.toFixed(2);

          let img_src = '';

          if (palavraExisteNaString(product_name, '1 GIGA')) {
            img_src = 'https://images.prismic.io/combo-mult-net/65673fc0531ac2845a257157_claro-internet-1-giga-new.avif?auto=format%2Ccompress&rect=0%2C371%2C2000%2C1258&w=283&h=178';
          }else if( palavraExisteNaString(product_name, '500 MEGA') ){
            img_src = 'https://images.prismic.io/combo-mult-net/65673fc2531ac2845a25715b_claro-internet-500-new.avif?auto=format%2Ccompress&rect=0%2C371%2C2000%2C1258&w=283&h=178';
          }else if( palavraExisteNaString(product_name, '750 MEGA') ){
            img_src = 'https://images.prismic.io/combo-mult-net/65673fc1531ac2845a257159_claro-internet-750-new.avif?auto=format%2Ccompress&rect=0%2C371%2C2000%2C1258&w=283&h=178';
          }else if( palavraExisteNaString(product_name, '350 MEGA') ){
            img_src = 'https://images.prismic.io/combo-mult-net/65673fc3531ac2845a25715c_claro-internet-350-new.avif?auto=format%2Ccompress&rect=0%2C371%2C2000%2C1258&w=283&h=178';
          }else{
            img_src = $(this).find('.claro-div-images-cards img').attr('src');
          }

          produto.image = img_src;

          // Adiciona detalhes adicionais
          $(this).find('.div-titulo-card .text-block-62').each(function() {
              produto.additionalProperty.push($(this).text().trim());
          });

          // Adiciona o produto ao array de produtos
          produtos.push(produto);
      });
    }

    // Converte os dados dos produtos para o formato JSON
    const jsonProdutos = JSON.stringify(produtos, null, 2);

    // Adiciona os dados JSON-LD dos produtos ao cabeçalho da página
    $('#produtos-schema').text(jsonProdutos);
}

  
Webflow.push(function () {

    setTimeout(function () {
      var link = $(".chat-whatsapp").find("a").attr("href");
      var text = getUrlParams(link).text;

      $('[href^="https://api.whatsapp.com"], [href^="https://whatsapp.escale.com.br"]').each(function (anchor) {
        var $anchor = $(this);
        var href = $anchor.attr("href");
        $anchor.attr("href", updateQueryStringParameter(href, "text", text));
      });

      $('#kv-novo-claro').addClass('kv-novo-claro');
      $('body').removeClass('not-ready');

      $('[href^="https://carrinho.ofertasclaro.com.br"]').each(function(index, button) {
          var link = $(button).attr("href");

          if (
            link.indexOf("utm_campaign") === -1 &&
            location.search.indexOf("utm_campaign") !== -1
          ) {
            var params = window.location.search.replace("?", "");

            if (params === "") {
              params = monta_location_search();
            }

            if (link.indexOf("?") !== -1) {
              link = link + "&" + params;
            } else {
              link = link + "?" + params;
            }
            $(button).attr("href", link);
          }
        });

        gerarProdutosSchema();

    }, 1500);
});
