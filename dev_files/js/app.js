var WordCloud = new Marionette.Application();

WordCloud.on('before:start', function(){
    var RegionContainer = Marionette.LayoutView.extend({
        el: '#app-container',

        regions: {
            filelist: '#filelist-region',
            canvas: '#canvas-region',
            selectedFile: '#selectedfile-region'
        }
    });

    WordCloud.regions = new RegionContainer();
});



WordCloud.on('file:select', function(id){
    WordCloud.Selectedfile.Controller.showFile(id);
});

WordCloud.on('start', function(){

    if(Backbone.history){
        Backbone.history.start();
    }

});


