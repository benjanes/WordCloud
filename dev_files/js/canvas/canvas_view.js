WordCloud.module('Canvas', function(Canvas, WordCloud, Backbone, Marionette, $, _){

    Canvas.Instructions1 = Marionette.ItemView.extend({
        template: 'instructions_1'
    });

    Canvas.Instructions2 = Marionette.ItemView.extend({
        template: 'instructions_2'
    });

    Canvas.Wordcloud = Marionette.ItemView.extend({
        template: 'canvas',
        className: 'canvas-container',
        events: {
            'click a#download-image' : 'downloadImage'
        },

        downloadImage: function(){
            var canvas = document.getElementById('word-cloud'); //$('#word-cloud');
            var dataURL = canvas.toDataURL('image/png');
            this.$el.find('a#download-image').attr('href', dataURL);
        }
    });

});
