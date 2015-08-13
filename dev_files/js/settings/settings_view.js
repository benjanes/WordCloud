WordCloud.module('Settings', function(Settings, WordCloud, Backbone, Marionette, $, _){

    Settings.View = Marionette.ItemView.extend({
        template: 'settings',

        events: {
            'submit form' : 'drawCloud'
        },

        drawCloud: function(e){
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            WordCloud.trigger('cloud:draw', this.model, data);
        }
    });

});
