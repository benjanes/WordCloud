WordCloud.module('Filelist', function(Filelist, WordCloud, Backbone, Marionette, $, _){

    Filelist.Controller = {
        listFiles: function(){

            var fetchingFiles = WordCloud.request('wordlist:files');

            var filelistLayout = new Filelist.Layout();
            var filelistLoadnew = new Filelist.Loadnew();

            $.when(fetchingFiles).done(function(files){

                var filelistFiles = new Filelist.Files({
                    collection: files
                });



            });
        }
    };

});
