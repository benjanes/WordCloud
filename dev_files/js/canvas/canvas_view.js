WordCloud.module('Canvas', function(Canvas, WordCloud, Backbone, Marionette, $, _){

    Canvas.Instructions1 = Marionette.ItemView.extend({
        template: 'instructions_1'
    });

    Canvas.Instructions2 = Marionette.ItemView.extend({
        template: 'instructions_2',

        events: {
            'click button.js-draw-cloud' : 'drawCloud'
        },

        drawCloud: function(){
            WordCloud.trigger('cloud:draw', this.model);
        }
    });

    Canvas.Wordcloud = Marionette.ItemView.extend({
        template: 'canvas',
        className: 'canvas-container',
        events: {
            'click a#download-image' : 'downloadImage',
            'click button.js-draw-cloud' : 'drawNewCloud'
        },

        downloadImage: function(){
            var canvas = document.getElementById('word-cloud');
            var dataURL = canvas.toDataURL('image/png');
            this.$el.find('a#download-image').attr('href', dataURL);
        },

        drawNewCloud: function(){
            WordCloud.trigger('cloud:draw', this.model);
        }
    });

});
