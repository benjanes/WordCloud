WordCloud.module('Canvas', function(Canvas, WordCloud, Backbone, Marionette, $, _){

    Canvas.Controller = {
        drawCloud: function(model, settings) {
            var canvasView, canvas, canvasDimensions,
                wordList,
                textSize, wordLimit, omits, font, cloudSpread, fontColor, allowOverlap, randomizeColors,
                transformData, findDrawingCoords, drawWordCloud,
                transformedData, drawingCoords;

            // new canvas with the selected model
            canvasView = new Canvas.Wordcloud({model: model});
            // render the canvas template on the page
            WordCloud.regions.canvas.show(canvasView);
            // get context on the canvas element
            canvas = document.getElementById('word-cloud');
            ctx = canvas.getContext('2d');

            // the raw list of words used to draw the word cloud, provided as an array
            if ( typeof model.attributes.fileWords === 'string' ){
                wordList = model.attributes.fileWords.split(',');
            } else {
                wordList = model.attributes.fileWords;
            }

            // user defined settings
            textSize = settings.textSize;
            wordLimit = settings.wordLimit;
            omits = settings.omittedWords.split(' ');
            font = settings.fontType;
            cloudSpread = settings.cloudSpread;
            // set font color as either RGB or RGBA depending on what is passed in
            if(settings.fontColor.indexOf('#') !== -1){
                var fontRGB = hexToRgb(settings.fontColor);
                fontColor = 'rgb('+fontRGB.r+','+fontRGB.g+','+fontRGB.b+')';
            } else {
                fontColor = settings.fontColor;
            }
            // boolean user settings
            allowOverlap = settings.allowOverlap;
            randomizeColors = settings.randomColors;

            // object used to size canvas when drawing
            canvasDimensions = {
                minX: 0,
                minY: 0,
                width: 0,
                height: 0
            };

            // Transform the array of words into an array of objects, one object per unique word.
            // The limit argument determines the number of word objects returned. The omits argument
            // leaves out the given words from the accounting.
            // Each word object returned will have a font size (proportional to its relative count
            // in the data [word list]), a font, a height, a width, and a color.
            transformData = function(array, fontSize, limit, omits, fontName, fontColor, randomColors) {
                var wordFreqData, wordList,
                    calcFontSize, toCountData, toRelSizing, calcDimensions, assignColor,
                    maxCount;

                // array to be returned
                wordFreqData = [];
                // list of unique words
                wordList = [];

                function Word(val){
                    this.word = val;
                    this.count = 1;
                    this.font = 0;
                    this.fontHeight = 0;
                }

                calcFontSize = function(relSize, fontPx) {
                    return Math.floor(relSize * fontPx);
                };

                // populate the wordFreqData array with unique words and get their counts
                toCountData = function(val, ind, arr) {
                    if (!checkValue(val, wordFreqData)) {
                        // if the word is in the omits array, don't include it
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

                // use the counts and the maxCount to determine the font size for each word
                toRelSizing = function(val, ind, arr) {
                    var thisCount = val.count;
                    val.count = thisCount / maxCount;
                    val.fontHeight = calcFontSize(val.count, fontSize);
                    val.font = val.fontHeight + 'px ' + fontName;
                };

                // calc the dimensions taken up by each word based on font size and string length
                calcDimensions = function(val, ind, arr) {
                    ctx.font = val.font;
                    val.fillWidth = ctx.measureText(val.word).width;
                };

                assignColor = function(val, ind, arr) {
                    function newColor(){
                        return Math.floor((Math.random() * 256));
                    }

                    if (!randomColors) {
                        val.color = fontColor;
                    } else {
                        val.color = 'rgb('+newColor()+','+newColor()+','+newColor()+')';
                    }
                };

                array.map(toCountData);

                // sort the frequency data to determine the max count
                wordFreqData.sort(function(a, b){
                    return b.count - a.count;
                });
                maxCount = wordFreqData[0].count;

                // if limit provided, use it to slice the freq data
                wordFreqData = ! limit ? wordFreqData : wordFreqData.slice(0, limit);

                wordFreqData.map(toRelSizing);
                wordFreqData.map(calcDimensions);
                wordFreqData.map(assignColor);

                return wordFreqData;
            };

            // Use the transformed data array and user-defined 'spread' var to find drawing
            // coordinates for each word object. This function adds the drawing coordinates to the
            // word objects in the passed array and returns that array. If allowOverlap===false,
            // loop through random coordinates for each word until an unoccupied space is found.
            // This function also sets the canvasDimensions based on the space that will be
            // occupied when each word is drawn on the canvas.
            findDrawingCoords = function(array, spread){
                var spreadVal, testIncrementer,
                    occupiedZones,
                    selectPoint;

                spreadVal = spread;
                testIncrementer = 0;

                // an array of objects, with minX, minY, maxX(= minX + fillWidth), maxY(= minY + fontHeight)
                occupiedZones = [];

                function OccupiedZone(minX, maxX, minY, maxY, word){
                    this.word = word;
                    this.minX = minX;
                    this.maxX = maxX;
                    this.minY = minY;
                    this.maxY = maxY;
                }

                // select a random point to draw from that isn't in the occupied space
                selectPoint = function(val, ind, arr){
                    var randRot,
                        dimensionSpan, SPAN,
                        newXY, calcTestCoords, addOccupiedZone, testLoop;

                    // set the rotation value for a word
                    randRot = (1 - Math.floor(Math.random() * 3)) * 90;

                    SPAN = spreadVal;
                    dimensionSpan = SPAN;

                    // select a new point on the canvas
                    newXY = function(){
                        var randX = Math.floor((0.5 - Math.random()) * dimensionSpan);
                        var randY = Math.floor((0.5 - Math.random()) * dimensionSpan);
                        return calcTestCoords(randX, randY);
                    };

                    // Given a 2d point, return an object that can be used to approximate the canvas
                    // space occupied when the given word is drawn at that point with the rotation
                    // that has been set at the beginning of the function.
                    calcTestCoords = function(testX, testY) {
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

                    // Once an origin point has been selected for a word, use the coordinates to
                    // add to add a new object to the occupiedZones array.
                    addOccupiedZone = function(x, y){
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

                    // If allowOverlap===false, test a potential drawing area against the objects in
                    // the occupiedZones array to minimize word overlap. Otherwise, just add the
                    // drawing area to the occupiedZones array.
                    testLoop = function(){
                        var testArea = newXY();

                        if(!allowOverlap) {
                            if (occupiedZones.length > 0) {
                                for (var i = 0; i < occupiedZones.length; i++) {
                                    if ((testArea.minX > occupiedZones[i].maxX || testArea.minX < occupiedZones[i].minX || testArea.maxY > occupiedZones[i].maxY || testArea.maxY < occupiedZones[i].minY) &&
                                        (testArea.minX > occupiedZones[i].maxX || testArea.minX < occupiedZones[i].minX || testArea.minY > occupiedZones[i].maxY || testArea.minY < occupiedZones[i].minY) &&
                                        (testArea.maxX > occupiedZones[i].maxX || testArea.maxX < occupiedZones[i].minX || testArea.maxY > occupiedZones[i].maxY || testArea.maxY < occupiedZones[i].minY) &&
                                        (testArea.maxX > occupiedZones[i].maxX || testArea.maxX < occupiedZones[i].minX || testArea.minY > occupiedZones[i].maxY || testArea.minY < occupiedZones[i].minY) &&
                                        (testArea.mid1.x > occupiedZones[i].maxX || testArea.mid1.x < occupiedZones[i].minX || testArea.mid1.y > occupiedZones[i].maxY || testArea.mid1.y < occupiedZones[i].minY) &&
                                        (testArea.mid2.x > occupiedZones[i].maxX || testArea.mid2.x < occupiedZones[i].minX || testArea.mid2.y > occupiedZones[i].maxY || testArea.mid2.y < occupiedZones[i].minY) &&
                                        (testArea.mid3.x > occupiedZones[i].maxX || testArea.mid3.x < occupiedZones[i].minX || testArea.mid3.y > occupiedZones[i].maxY || testArea.mid3.y < occupiedZones[i].minY) &&
                                        (testArea.mid4.x > occupiedZones[i].maxX || testArea.mid4.x < occupiedZones[i].minX || testArea.mid4.y > occupiedZones[i].maxY || testArea.mid4.y < occupiedZones[i].minY)
                                    ) {
                                        if (i === occupiedZones.length - 1) {
                                            val.xCoord = testArea.x;
                                            val.yCoord = testArea.y;
                                            val.rot = randRot;
                                            addOccupiedZone(testArea.x, testArea.y);
                                            dimensionSpan = SPAN;
                                            break;
                                        } else {
                                            continue;
                                        }
                                    } else {
                                        // grow out the span of the randomized point selection if
                                        // an unoccupied space cannot be found at the provided spread
                                        testIncrementer++;
                                        if (testIncrementer >= 10000) {
                                            dimensionSpan += 10;
                                        }
                                        return testLoop();
                                    }
                                }
                            } else {
                                val.xCoord = testArea.x;
                                val.yCoord = testArea.y;
                                val.rot = randRot;
                                addOccupiedZone(testArea.x, testArea.y);
                            }
                        } else {
                            val.xCoord = testArea.x;
                            val.yCoord = testArea.y;
                            val.rot = randRot;
                            addOccupiedZone(testArea.x, testArea.y);
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
            drawWordCloud = function(coordsArray, canvasSizingObj) {

                var drawWord = function(word) {
                    ctx.translate( word.xCoord, word.yCoord ); // the x, y coords for this word
                    ctx.rotate( word.rot * Math.PI / 180 ); // the rot
                    ctx.font = word.font;
                    ctx.fillStyle = word.color;
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

            transformedData = transformData(wordList, textSize, wordLimit, omits, font, fontColor, randomizeColors);
            drawingCoords = findDrawingCoords(transformedData, cloudSpread);
            drawWordCloud(drawingCoords, canvasDimensions);

        }
    };

});
