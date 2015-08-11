var WordCloud = new Marionette.Application();

WordCloud.LoadView = Marionette.ItemView.extend({
    template: 'load'
});

WordCloud.CanvasView = Marionette.ItemView.extend({
    template: 'canvas'
});

WordCloud.on('before:start', function(){
    var RegionContainer = Marionette.LayoutView.extend({
        el: '#app-container',

        regions: {
            load: '#load-region',
            canvas: '#canvas-region'
        }
    });

    WordCloud.regions = new RegionContainer();
});

WordCloud.on('start', function(){
    var loadView = new WordCloud.Wordlists.Views.LoadView();
    var canvasView = new WordCloud.CanvasView();

    WordCloud.regions.load.show(loadView);
    WordCloud.regions.canvas.show(canvasView);
});
