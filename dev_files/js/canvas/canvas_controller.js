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
            var cloudSpread = settings.cloudSpread;

            var fontRGB = hexToRgb(settings.fontColor);
            var fontColor = 'rgb('+fontRGB.r+','+fontRGB.g+','+fontRGB.b+')';

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

            // helper functions
            function checkValue(value, array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].word === value) {
                        return true;
                    }
                }
                return false;
            }

            function hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
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
                        if (omits.indexOf(val) !== -1) {
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

            var findDrawingCoords = function(array, spread){
                // an array of objects, with minX, minY, maxX(= minX + fillWidth), maxY(= minY + fontHeight)
                var occupiedZones = [];
                var spreadVal = spread;
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
                    var randRot, dimensionSpan, SPAN;
                    // random numbers based around centering the image at 0,0
                    randRot = (1 - Math.floor(Math.random() * 3)) * 90;

                    SPAN = spreadVal;
                    dimensionSpan = SPAN;

                    var newXY = function(){
                        var randX = Math.floor((0.5 - Math.random()) * dimensionSpan);
                        var randY = Math.floor((0.5 - Math.random()) * dimensionSpan);

                        return calcTestCoords(randX, randY);
                    };

                    var calcTestCoords = function(testX, testY) {
                        var testCoords = {};

                        testCoords.x = testX;
                        testCoords.y = testY;

                        if (randRot === -90) {
                            testCoords.minX = testX - val.fontHeight;
                            testCoords.maxX = testX;
                            testCoords.minY = testY - val.fillWidth;
                            testCoords.maxY = testY;
                        } else if (randRot === 90) {
                            testCoords.minX = testX;
                            testCoords.maxX = testX + val.fontHeight;
                            testCoords.minY = testY;
                            testCoords.maxY = testY + val.fillWidth;
                        } else {
                            testCoords.minX = testX;
                            testCoords.maxX = testX + val.fillWidth;
                            testCoords.minY = testY - val.fontHeight;
                            testCoords.maxY = testY;
                        }

                        testCoords.mid1 = { x: testCoords.minX, y: (testCoords.maxY - testCoords.minY) / 2 };
                        testCoords.mid2 = { x: (testCoords.maxX - testCoords.minX) / 2, y: testCoords.minY };
                        testCoords.mid3 = { x: testCoords.maxX, y: (testCoords.maxY - testCoords.minY) / 2 };
                        testCoords.mid4 = { x: (testCoords.maxX - testCoords.minX) / 2, y: testCoords.maxY };

                        return testCoords;
                    };

                    var addOccupiedZone = function(x, y){
                        if (randRot === -90) {
                            occupiedZones.push(new OccupiedZone(
                                x - val.fontHeight,
                                x,
                                y - val.fillWidth,
                                y,
                                val.word
                            ));
                        } else if (randRot === 90) {
                            occupiedZones.push(new OccupiedZone(
                                x,
                                x + val.fontHeight,
                                y,
                                y + val.fillWidth,
                                val.word
                            ));
                        } else {
                            occupiedZones.push(new OccupiedZone(
                                x,
                                x + val.fillWidth,
                                y - val.fontHeight,
                                y,
                                val.word
                            ));
                        }
                    };

                    var testCoordinate = function(testArea, occupiedArea) {

                        if (testArea.minX > occupiedArea.maxX || testArea.minX < occupiedArea.minX || testArea.maxY > occupiedArea.maxY || testArea.maxY < occupiedArea.minY &&
                            testArea.minX > occupiedArea.maxX || testArea.minX < occupiedArea.minX || testArea.minY > occupiedArea.maxY || testArea.minY < occupiedArea.minY &&
                            testArea.maxX > occupiedArea.maxX || testArea.maxX < occupiedArea.minX || testArea.maxY > occupiedArea.maxY || testArea.maxY < occupiedArea.minY &&
                            testArea.maxX > occupiedArea.maxX || testArea.maxX < occupiedArea.minX || testArea.minY > occupiedArea.maxY || testArea.minY < occupiedArea.minY &&
                            testArea.mid1.x > occupiedArea.maxX || testArea.mid1.x < occupiedArea.minX || testArea.mid1.y > occupiedArea.maxY || testArea.mid1.y < occupiedArea.minY &&
                            testArea.mid2.x > occupiedArea.maxX || testArea.mid2.x < occupiedArea.minX || testArea.mid2.y > occupiedArea.maxY || testArea.mid2.y < occupiedArea.minY &&
                            testArea.mid3.x > occupiedArea.maxX || testArea.mid3.x < occupiedArea.minX || testArea.mid3.y > occupiedArea.maxY || testArea.mid3.y < occupiedArea.minY &&
                            testArea.mid4.x > occupiedArea.maxX || testArea.mid4.x < occupiedArea.minX || testArea.mid4.y > occupiedArea.maxY || testArea.mid4.y < occupiedArea.minY
                        ){

                            // if these conditions are met,
                            // 1. stash the passing values
                            // 2. increment a test value
                            // 3. pass this to the test loop function

                        } else {

                            testIncrementer++;
                            if (testIncrementer >= 10) {
                                dimensionSpan += 60;
                            }
                            //newXY();
                            return testLoop();
                        }

                    };

                    var testLoop = function(){
                        var testCoords = newXY();

                        if (occupiedZones.length > 0) {

                            //newXY();

                            for (var i = 0; i < occupiedZones.length; i++) {

                                testCoordinate(testCoords, occupiedZones[i]);

                                if (i === occupiedZones.length - 1) {

                                    val.xCoord = testCoords.x;
                                    val.yCoord = testCoords.y;
                                    val.rot = randRot;

                                    addOccupiedZone(testCoords.x, testCoords.y);
                                    dimensionSpan = SPAN;
                                    break;
                                }
                            }

                        } else {

                            //newXY();

                            val.xCoord = testCoords.x;
                            val.yCoord = testCoords.y;
                            val.rot = randRot;

                            addOccupiedZone(testCoords.x, testCoords.y);
                        }
                    };

                    testLoop();

                };

                array.forEach(selectPoint);

                // find smallest x in occupied area
                occupiedZones.sort(function(a, b) { return a.minX - b.minX; });
                var xCanvasOrigin = Math.floor(occupiedZones[0].minX);

                // find smallest y in occupied area
                occupiedZones.sort(function(a, b){ return a.minY - b.minY; });
                var yCanvasOrigin = Math.floor(occupiedZones[0].minY);

                // find largest x, calculate width of canvas
                occupiedZones.sort(function(a, b){ return b.maxX - a.maxX; });
                var canvasWidth = Math.ceil(occupiedZones[0].maxX) - xCanvasOrigin;

                // find largest y, calculate height of canvas
                occupiedZones.sort(function(a, b){ return b.maxY - a.maxY; });
                var canvasHeight = Math.ceil(occupiedZones[0].maxY) - yCanvasOrigin;

                canvasDimensions = {
                    minX: xCanvasOrigin,
                    minY: yCanvasOrigin,
                    width: canvasWidth,
                    height: canvasHeight
                };

                return array;
            };

            // use the drawing coordinates to draw the word cloud
            var drawWordCloud = function(coordsArray, canvasSizingObj, fontColor) {

                var drawWord = function(word) {
                    ctx.translate( word.xCoord, word.yCoord ); // the x, y coords for this word
                    ctx.rotate( word.rot * Math.PI / 180 ); // the rot
                    ctx.font = word.font;
                    //ctx.fillStyle = fontColor;
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
                ctx.fillStyle = fontColor;
                ctx.save();
                coordsArray.forEach(drawWord);
            };


            var transformedList = transformData(wordList, textSize, wordLimit, omits, font);
            var drawingCoords = findDrawingCoords(transformedList, cloudSpread);
            drawWordCloud(drawingCoords, canvasDimensions, fontColor);

            //console.log(drawingCoords);
        }
    };

});
