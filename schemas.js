function gerarProdutosSchema() {
    // Array para armazenar os dados dos produtos
    let produtos = [];

    // Itera sobre cada card de produto
    $('.claro-slide-cards .claro-div-card-oferta').each(function() {
        // Objeto para armazenar os dados de cada produto
        let produto = {
            "@context": "http://schema.org/",
            "@type": "Product",
            "name": "",
            "description": "",
            "brand": {
                "@type": "Brand",
                "name": "Claro"
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
        produto.name = $(this).find('.div-titulo-card').text().trim();
        produto.description = $(this).find('.div-titulo-card p').text().trim();
        produto.offers.price = $(this).find('.preco-card1').text().trim();
        // produto.image = $(this).find('.claro-div-images-cards img').attr('src');

        // Adiciona detalhes adicionais
        $(this).find('.div-titulo-card .text-block-62').each(function() {
            produto.additionalProperty.push($(this).text().trim());
        });

        // Adiciona o produto ao array de produtos
        produtos.push(produto);
    });

    // Converte os dados dos produtos para o formato JSON
    const jsonProdutos = JSON.stringify(produtos, null, 2);

    // Adiciona os dados JSON-LD dos produtos ao cabeçalho da página
    $('#produtos-schema').text(jsonProdutos);
}

Webflow.push(function () {
    gerarProdutosSchema();
});
