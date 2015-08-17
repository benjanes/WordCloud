var WordCloud = new Marionette.Application();

WordCloud.on('before:start', function(){
    var RegionContainer = Marionette.LayoutView.extend({
        el: '#app-container',

        regions: {
            filelist: '#filelist-region',
            canvas: '#canvas-region',
            selectedFile: '#selectedfile-region',
            settings: '#settings-region',
            load: '#load-region'
        }
    });

    WordCloud.regions = new RegionContainer();
});

WordCloud.on('file:select', function(model){
    WordCloud.regions.canvas.show( new WordCloud.Canvas.Instructions2({
        model: model
    }) );
    WordCloud.Selectedfile.Controller.showFile(model);
    WordCloud.Settings.Controller.showSettings(model);
});

WordCloud.on('cloud:draw', function(model){
    var defer = $.Deferred();

    defer.done(function(settings){
        WordCloud.Canvas.Controller.drawCloud(model, settings);
    });

    defer.resolve( WordCloud.Settings.Controller.getSettings() );

});

WordCloud.on('start', function(){

    if(Backbone.history){
        Backbone.history.start();
    }

});
