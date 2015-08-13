WordCloud.module('Canvas', function(Canvas, WordCloud, Backbone, Marionette, $, _){

    Canvas.Controller = {
        drawCloud: function(model, settings) {
            var canvasView = new Canvas.Wordcloud({
                model: model
            });

            WordCloud.regions.canvas.show(canvasView);

            //console.log(settings);
            var textSize = settings.textSize;
            var wordLimit = settings.wordLimit;
            var omittedWords = settings.omittedWords.split(' ');

            console.log(model.attributes.fileWords);
        }
    };

});
