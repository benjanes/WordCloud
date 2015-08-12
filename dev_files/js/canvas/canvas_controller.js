WordCloud.module('Canvas', function(Canvas, WordCloud, Backbone, Marionette, $, _){

    Canvas.Controller = {
        showCanvas: function(){
            var canvasView = new WordCloud.Canvas.View();

            WordCloud.regions.canvas.show(canvasView);
        }
    };

});
