WordCloud.module('Selectedfile', function(Selectedfile, WordCloud, Backbone, Marionette, $, _){

    Selectedfile.Controller = {

        showFile: function(id){
            var file = WordCloud.request('wordlist:file', id);

            var fileView = new Selectedfile.File({
                model: file
            });

            WordCloud.regions.selectedFile.show(fileView);
        }

    };

});
