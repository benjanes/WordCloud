WordCloud.module('Canvas', function(Canvas, WordCloud, Backbone, Marionette, $, _){

    Canvas.Controller = {
        drawCloud: function(model, settings) {
            var canvasView = new Canvas.Wordcloud();

            WordCloud.regions.canvas.show(canvasView);

            var textSize = settings.textSize;
            var wordLimit = settings.wordLimit;
            var omittedWords = settings.omittedWords.split(' ');
            var wordList = model.attributes.fileWords.split(',');

            var canvas = document.getElementById('word-cloud'),
                ctx = canvas.getContext('2d');

            var canvasDimensions = {
                minX: 0,
                minY: 0,
                width: 0,
                height: 0
            };

            // helper function
            function checkValue(value, array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].word === value) {
                        return true;
                    }
                }
                return false;
            }

            // transform the array of words into frequency data set
            var transformData = function(array, fontPx, limit, font) {
                var wordFreqData = [];
                var wordList = [];
                var fontSize = fontPx ? fontPx : 30;
                var fontName = font ? font : 'Arial';

                function Word(val){
                    this.word = val;
                    this.count = 1;
                    this.font = 0;
                    this.fontHeight = 0;
                }

                var calcFontSize = function(relSize, fontPx) {
                    return Math.floor(relSize * fontPx);
                };

                var toCountData = function(val, ind, arr) {
                    if (!checkValue(val, wordFreqData)) {
                        var newWord = new Word(val);
                        wordFreqData.push(newWord);
                        wordList.push(val);
                    } else {
                        var index = wordList.indexOf(val);
                        wordFreqData[index].count += 1;
                    }
                };

                var toRelSizing = function(val, ind, arr) {
                    var thisCount = val.count;
                    val.count = thisCount / maxCount;
                    val.fontHeight = calcFontSize(val.count, fontSize);
                    val.font = val.fontHeight + 'px ' + fontName;
                };

                // calc the dimensions taken up by each word based on font size and string length
                var calcDimensions = function(val, ind, arr){
                    ctx.font = val.font;
                    val.fillWidth = ctx.measureText(val.word).width;
                };

                // Convert the array of objects with a word value and
                // count value. Store each new word in a wordList array
                // for ease of finding that word's index
                array.map(toCountData);

                // --->> this is where word omissions should be performed, before the sorting and calculations

                // sort the frequency data
                wordFreqData.sort(function(a, b){
                    return b.count - a.count;
                });

                var maxCount = wordFreqData[0].count;

                // if limit provided, use it to slice the freq data
                wordFreqData = ! limit ? wordFreqData : wordFreqData.slice(0, limit);

                // convert to relative count, use to calc font size
                wordFreqData.map(toRelSizing);
                // calc the dimensions for each word
                wordFreqData.map(calcDimensions);

                return wordFreqData;
            };

            var transformedList = transformData(wordList, textSize, wordLimit);

            console.log(transformedList);
        }
    };

});
