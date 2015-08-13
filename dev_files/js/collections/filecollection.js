WordCloud.module('FileCollection', function(FileCollection, WordCloud, Backbone, Marionette, $, _){

    FileCollection.Router = Marionette.AppRouter.extend({
        appRoutes: {}
    });

    // FileCollection controller
    FileCollection.Controller = function(){
        this.fileCollection = new WordCloud.Wordlist.FileCollection();
    };

    _.extend(FileCollection.Controller.prototype, {
        start: function() {
            this.showDrawingArea();
            this.showFileList();
        },

        showDrawingArea: function(){
            var canvasView = new WordCloud.Canvas.View();
            WordCloud.regions.canvas.show(canvasView);
        },

        showFileList: function(){
            var fetchingFiles = WordCloud.request('wordlist:files');

            $.when(fetchingFiles).done(function(files){

                var filesView = new WordCloud.Filelist.Files({
                    collection: files
                });

                filesView.on('childview:file:delete', function(childView, model){
                    model.destroy();
                });

                filesView.on('childview:file:select', function(childView, model){
                    WordCloud.trigger('file:select', model);
                });


                WordCloud.regions.filelist.show(filesView);
            });

        }

    });

    FileCollection.addInitializer(function(){
        FileCollection.controller = new FileCollection.Controller();
        FileCollection.router = new FileCollection.Router({
            controller: FileCollection.controller
        });

        FileCollection.controller.start();
    });

});
