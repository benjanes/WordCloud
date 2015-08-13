WordCloud.module('Canvas', function(Canvas, WordCloud, Backbone, Marionette, $, _){

    Canvas.Instructions1 = Marionette.ItemView.extend({
        template: 'instructions_1'
    });

    Canvas.Instructions2 = Marionette.ItemView.extend({
        template: 'instructions_2'
    });

    Canvas.Wordcloud = Marionette.ItemView.extend({
        template: 'canvas',

        onRender: function(){
            console.log('rendered');
        }
    });

});
