# Coronavírus webcrawler
O objetivo deste projeto é buscar notícias na região de São Carlos.

#### Como funciona
O webcrawler realiza uma pesquisa no Google buscando as últimas notícias. Para cada resultado da busca, ele busca mais informações no site onde a notícia foi veiculada.

#### Webcrawlers disponíveis
Atualmente, foi implementado somente o webcrawler para o site da EPTV ([G1](https://g1.globo.com/sp/sao-carlos-regiao/)).


## Como executar o projeto
O projeto foi dividido em duas partes: o **webcrawler**, que busca as informações na web, e uma **demonstração web**, que exibe as notícias encontradas no webcrawler numa página HTML.

### Webcrawler

> É necessário ter o [node](https://nodejs.org/en/) instalado (recomenda-se a versão 12 LTS).

> Recomenda-se o uso do [yarn](https://yarnpkg.com/) ao invés do npm.

Para instalar as dependências do projeto, execute o comando:

```yarn```

Para executar o webcrawler:

```yarn start```

Para executar o webcrawler em modo de desenvolvimento (detecta alteração nos arquivos e atualiza automaticamente o projeto):

```yarn dev```

#### Como o webcrawler funciona
Através do [puppeteer](https://github.com/puppeteer/puppeteer), é aberta uma página do google para buscar as notícias. 
Com os **N** links obtidos nos resultados da busca, uma nova página é aberta com **N** abas, realizando o webcrawling simultâneo das notícias.

Quando o webcrawling é finalizado, todas as notícias são armazenadas num banco de dados interno da aplicação (utilizando [nedb](https://github.com/louischatriot/nedb)), no arquivo `db/news.db`.

Através das notícias persistidas, é gerado um arquivo JSON (`docs/news.json`) para ser consumido em uma página web.

### Demonstração web

Atualmente é possível visualizar as última versão do projeto com as notícias atualizadas em: https://brcambui.github.io/corona-webcrawler/

#### Visualizando no projeto local (ou hospedando)

Para visualizar as notícias obtidas pelo webcrawling numa página HTML, basta hospedar o diretório `docs/` em qualquer servidor web.

> Executar o arquivo HTML direto no navegador pode não funcionar corretamente. Recomenda-se o uso de um servidor HTTP para visualizar a página.
