WordCloud.module('Filelist', function(Filelist, WordCloud, Backbone, Marionette, $, _){

    Filelist.Controller = {

        listFiles: function(){
            var files = WordCloud.request('wordlist:files');

            var filesView = new WordCloud.Filelist.Files({
                collection: files
            });

            var loadView = new WordCloud.Filelist.Loadnew();
            var layoutView = new WordCloud.Filelist.Layout();

            //WordCloud.regions.filelist.show(filesView);


            WordCloud.regions.filelist.show(layoutView);

            layoutView.loadRegion.show(loadView);
            layoutView.listRegion.show(filesView);
        }

    };

});
