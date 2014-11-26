//Criação da variável para guardar o "módulo" imp (image processing)

var imp = imp || {};

//Função para restringir o escopo do módulo
(function() {
    "use strict";

    //-------------------------------------------------------------------------
    //Funções privadas. Como não foram declaradas dentro de imp, não serão
    //visíveis fora do módulo
    //-------------------------------------------------------------------------
    function coordToIndex(pixels, x, y) {
        return (x + y * pixels.width) * 4;
    }

    //Cria o Promise que carrega a imagem do servidor
    //Veja também a função imp.loadImageData
    function requestImage(url) {
        return new Promise(function(resolve) {
            var img = new Image();
            img.onload = function() {
                resolve(img)
            };
            img.src = url;
        });
    }

    imp.getImageData = function(source) {
        var srcCanvas = document.createElement("canvas");
        srcCanvas.width = source.naturalWidth;
        srcCanvas.height = source.naturalHeight;

        var c = srcCanvas.getContext("2d");
        c.drawImage(source, 0, 0);

        return c.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
    };

    /**
     * Retorna um promise que lê a imagem do disco E extrai seus dados.
     */
    imp.requestImageData = function(url) {
        //O then retorna o Promise de todas essas operações juntas.
        return requestImage(url).then(getImageData);
    };

    imp.setRGB = function(pixels, x, y, color) {
        var index = coordToIndex(pixels, x, y);
        pixels.data[index] = color[0];
        pixels.data[index+1] = color[1];
        pixels.data[index+2] = color[2];
        pixels.data[index+3] = 255;
        return pixels;
    };

    imp.setRGBA = function(pixels, x, y, color) {
        var index = coordToIndex(pixels, x, y);
        pixels.data[index] = color[0];
        pixels.data[index+1] = color[1];
        pixels.data[index+2] = color[2];
        pixels.data[index+3] = color[3];
        return pixels;
    };

    imp.getRGB = function(pixels, x, y) {
        var index = coordToIndex(pixels, x, y);
        return vec4.fromValues(
            pixels.data[index],
            pixels.data[index+1],
            pixels.data[index+2],
            pixels.data[index+3]
        );
    };

    imp.getRGBA = function(pixels, x, y) {
        return getRGB(pixels, x, y);
    };

    function createImageData(width, height) {
        var canvas = document.createElement("canvas")
        canvas.width = width;
        canvas.height = height;
        var c = canvas.getContext("2d")
        return c.createImageData(width, height);
    }
})();