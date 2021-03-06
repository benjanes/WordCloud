WordCloud.module('Settings', function(Settings, WordCloud, Backbone, Marionette, $, _){

    Settings.View = Marionette.ItemView.extend({
        template: 'settings',
        className: 'settings-container',

        onRender: function(){
            this.$el.css('display', 'none').fadeIn();
            this.$el.find('.js-tooltip').tooltip();
            this.$el.find('.color-select-area').colorpicker();
        }
    });

});
