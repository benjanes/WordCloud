WordCloud.module('Canvas', function(Canvas, WordCloud, Backbone, Marionette, $, _){

    Canvas.Instructions1 = Marionette.ItemView.extend({
        template: 'instructions_1'
    });

    Canvas.Instructions2 = Marionette.ItemView.extend({
        template: 'instructions_2'
    });

    Canvas.Wordcloud = Marionette.ItemView.extend({
        template: 'canvas',

        events: {
            'click button.js-redraw' : 'redrawCanvas'
        },

        redrawCanvas: function(){
            // trigger a redrawing of the canvas with the same model and settings
            console.log('redraw triggered');
        }
    });

});
