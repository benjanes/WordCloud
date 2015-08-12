var WordCloud = new Marionette.Application();

WordCloud.on('before:start', function(){
    var RegionContainer = Marionette.LayoutView.extend({
        el: '#app-container',

        regions: {
            filelist: '#filelist-region',
            canvas: '#canvas-region'
        }
    });

    WordCloud.regions = new RegionContainer();
});



WordCloud.on('start', function(){

    WordCloud.Canvas.Controller.showCanvas();
    WordCloud.Filelist.Controller.listFiles();

});


