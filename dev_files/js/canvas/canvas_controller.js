WordCloud.module('Canvas', function(Canvas, WordCloud, Backbone, Marionette, $, _){

    Canvas.Controller = {
        drawCloud: function(model, settings) {
            var canvasView = new Canvas.Wordcloud({model: model});

            WordCloud.regions.canvas.show(canvasView);

            var textSize = settings.textSize;
            var wordLimit = settings.wordLimit;
            var userOmits = settings.omittedWords.split(' ');
            var defaultOmits = ['a', 'the', 'and'];
            var omits = $.merge(defaultOmits, userOmits);
            var font = settings.fontType;

            var wordList;
            if ( typeof model.attributes.fileWords === 'string' ){
                wordList = model.attributes.fileWords.split(',');
            } else {
                wordList = model.attributes.fileWords;
            }

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

            function checkArray(value, array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === value) {
                        return true;
                    }
                }
                return false;
            }

            // transform the array of words into frequency data set
            var transformData = function(array, fontPx, limit, omits, font) {
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
                        if (checkArray(val, omits)) {
                            return false;
                        } else {
                            var newWord = new Word(val);
                            wordFreqData.push(newWord);
                            wordList.push(val);
                        }
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

            var findDrawingCoords = function(array){
                // an array of objects, with minX, minY, maxX(= minX + fillWidth), maxY(= minY + fontHeight)
                var occupiedZones = [];

                var testIncrementer = 0;

                function OccupiedZone(minX, maxX, minY, maxY, word){
                    this.word = word;
                    this.minX = minX;
                    this.maxX = maxX;
                    this.minY = minY;
                    this.maxY = maxY;
                }

                // 1. select a random point for which to draw from that isn't in the occupied space
                var selectPoint = function(val, ind, arr){
                    var randX, randY, randRot, dimensionSpan, SPAN;
                    // random numbers based around centering the image at 0,0
                    randRot = (1 - Math.floor(Math.random() * 3)) * 90;

                    SPAN = 150;
                    dimensionSpan = SPAN;

                    var newXY = function(){
                        randX = Math.floor((0.5 - Math.random()) * dimensionSpan);
                        randY = Math.floor((0.5 - Math.random()) * dimensionSpan);
                    };

                    var testCoordinate = function(testX, testY, obj) {
                        var minX, maxX, minY, maxY;

                        if (randRot === -90) {
                            minX = testX - val.fontHeight;
                            maxX = testX;
                            minY = testY - val.fillWidth;
                            maxY = testY;
                        } else if (randRot === 90) {
                            minX = testX;
                            maxX = testX + val.fontHeight;
                            minY = testY;
                            maxY = testY + val.fillWidth;
                        } else {
                            minX = testX;
                            maxX = testX + val.fillWidth;
                            minY = testY - val.fontHeight;
                            maxY = testY;
                        }

                        var mid1 = { x: minX, y: (maxY - minY) / 2 };
                        var mid2 = { x: (maxX - minX) / 2, y: minY };
                        var mid3 = { x: maxX, y: (maxY - minY) / 2 };
                        var mid4 = { x: (maxX - minX) / 2, y: maxY };

                        if ( minX > obj.maxX || minX < obj.minX || maxY > obj.maxY || maxY < obj.minY &&
                            minX > obj.maxX || minX < obj.minX || minY > obj.maxY || minY < obj.minY &&
                            maxX > obj.maxX || maxX < obj.minX || maxY > obj.maxY || maxY < obj.minY &&
                            maxX > obj.maxX || maxX < obj.minX || minY > obj.maxY || minY < obj.minY &&
                            mid1.x > obj.maxX || mid1.x < obj.minX || mid1.y > obj.maxY || mid1.y < obj.minY &&
                            mid2.x > obj.maxX || mid2.x < obj.minX || mid2.y > obj.maxY || mid2.y < obj.minY &&
                            mid3.x > obj.maxX || mid3.x < obj.minX || mid3.y > obj.maxY || mid3.y < obj.minY &&
                            mid4.x > obj.maxX || mid4.x < obj.minX || mid4.y > obj.maxY || mid4.y < obj.minY
                        ){

                            /*val.xCoord = randX;
                            val.yCoord = randY;
                            val.rot = randRot;*/

                        } else {

                            testIncrementer++;
                            if (testIncrementer >= 30) {
                                dimensionSpan += 30;
                            }
                            return testLoop();
                        }


                    };


                    var addOccupiedZone = function(){
                        if (randRot === -90) {
                            occupiedZones.push(new OccupiedZone(
                                randX - val.fontHeight,
                                randX,
                                randY - val.fillWidth,
                                randY,
                                val.word
                            ));
                        } else if (randRot === 90) {
                            occupiedZones.push(new OccupiedZone(
                                randX,
                                randX + val.fontHeight,
                                randY,
                                randY + val.fillWidth,
                                val.word
                            ));
                        } else {
                            occupiedZones.push(new OccupiedZone(
                                randX,
                                randX + val.fillWidth,
                                randY - val.fontHeight,
                                randY,
                                val.word
                            ));
                        }
                    };

                    var testLoop = function(){
                        newXY();

                        if (occupiedZones.length > 0) {

                            //newXY();

                            for (var i = 0; i < occupiedZones.length; i++) {

                                testCoordinate(randX, randY, occupiedZones[i]);

                                if (i === occupiedZones.length - 1) {

                                    val.xCoord = randX;
                                    val.yCoord = randY;
                                    val.rot = randRot;

                                    addOccupiedZone();
                                    dimensionSpan = SPAN;
                                    break;
                                }
                            }

                        } else {

                            //newXY();

                            val.xCoord = randX;
                            val.yCoord = randY;
                            val.rot = randRot;

                            addOccupiedZone();
                        }
                    };

                    testLoop();

                };

                array.forEach(selectPoint);

                occupiedZones.sort(function(a, b){
                    return a.minX - b.minX;
                });

                var xCanvasOrigin = Math.floor(occupiedZones[0].minX);

                occupiedZones.sort(function(a, b){
                    return a.minY - b.minY;
                });

                var yCanvasOrigin = Math.floor(occupiedZones[0].minY);

                occupiedZones.sort(function(a, b){
                    return b.maxX - a.maxX;
                });

                var canvasWidth = Math.ceil(occupiedZones[0].maxX) - xCanvasOrigin;

                occupiedZones.sort(function(a, b){
                    return b.maxY - a.maxY;
                });

                var canvasHeight = Math.ceil(occupiedZones[0].maxY) - yCanvasOrigin;

                canvasDimensions = {
                    minX: xCanvasOrigin,
                    minY: yCanvasOrigin,
                    width: canvasWidth,
                    height: canvasHeight
                };

                //console.log(occupiedZones);

                return array;
            };

            // use the drawing coordinates to draw the word cloud
            var drawWordCloud = function(coordsArray, canvasSizingObj) {

                var drawWord = function(word) {
                    ctx.translate( word.xCoord, word.yCoord ); // the x, y coords for this word
                    ctx.rotate( word.rot * Math.PI / 180 ); // the rot
                    ctx.font = word.font;
                    ctx.fillText(word.word, 0, 0);
                    ctx.rotate( -(word.rot) * Math.PI / 180 );
                    ctx.translate( -(word.xCoord), -(word.yCoord) );
                    //console.log('word: ' + word.word + '; translate: ' + word.xCoord + ', ' + word.yCoord + '; rotation: ' + word.rot);
                    //ctx.restore(); // undo the translation, rotation, and font style
                };

                var xTrans = Math.abs(canvasSizingObj.minX) + 5;
                var yTrans = Math.abs(canvasSizingObj.minY) + 5;

                canvas.height = canvasSizingObj.height + 10;
                canvas.width = canvasSizingObj.width + 10;

                ctx.translate(xTrans, yTrans);
                ctx.save();
                coordsArray.forEach(drawWord);
            };


            var transformedList = transformData(wordList, textSize, wordLimit, omits, font);
            var drawingCoords = findDrawingCoords(transformedList);
            drawWordCloud(drawingCoords, canvasDimensions);

            //console.log(drawingCoords);
        }
    };

});
