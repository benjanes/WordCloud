var WordCloud = new Marionette.Application();

WordCloud.on('before:start', function(){
    var RegionContainer = Marionette.LayoutView.extend({
        el: '#app-container',

        regions: {
            filelist: '#filelist-region',
            canvas: '#canvas-region',
            selectedFile: '#selectedfile-region',
            settings: '#settings-region'
        }
    });

    WordCloud.regions = new RegionContainer();
});


WordCloud.on('file:select', function(model){
    WordCloud.Selectedfile.Controller.showFile(model);

    WordCloud.Settings.Controller.showSettings(model);
});

WordCloud.on('start', function(){

    if(Backbone.history){
        Backbone.history.start();
    }

});


