WordCloud.module('Settings', function(Settings, WordCloud, Backbone, Marionette, $, _){

    Settings.Controller = {

        showSettings: function(model){
            var settingsView = new Settings.View({
                model: model
            });

            WordCloud.regions.settings.show(settingsView);
        },

        getSettings: function(){
            var settings = Backbone.Syphon.serialize($('form'));
            return settings;
        }

    };

});
