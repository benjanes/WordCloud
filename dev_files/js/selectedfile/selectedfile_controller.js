WordCloud.module('Selectedfile', function(Selectedfile, WordCloud, Backbone, Marionette, $, _){

    Selectedfile.Controller = {

        showFile: function(model){
            var fileView = new Selectedfile.File({
                model: model
            });

            WordCloud.regions.selectedFile.show(fileView);
        }

    };

});
