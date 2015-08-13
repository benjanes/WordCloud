WordCloud.module('Wordlist', function(Wordlist, WordCloud, Backbone, Marionette, $, _){

    Wordlist.File = Backbone.Model.extend({

        defaults: {
            fileName: '',
            fileWords: ''
        },

        initialize: function(){
            if (this.isNew()) {
                this.set('id', Date.now());
            }
        }

    });

    Wordlist.FileCollection = Backbone.Collection.extend({
        model: Wordlist.File,
        localStorage: new Backbone.LocalStorage('wordcloud-files'),
        comparator: 'id'
    });

    var API = {
        getFiles: function(){

            var files = new Wordlist.FileCollection();
            files.fetch();

            // load in a sample if there aren't any files loaded in local storage
            if(files.length === 0){
                var sampleFile = new Wordlist.File({fileName: 'Sample File'});
                files.add(sampleFile);
                sampleFile.save();
            }

            return files;
        },

        // this part seems to need work...
        getFile: function(fileId){
            var file = new Wordlist.File({id: fileId});
            file.fetch();
            return file;
        }
    };

    WordCloud.reqres.setHandler('wordlist:files', function(){
        return API.getFiles();
    });

    WordCloud.reqres.setHandler('wordlist:file', function(id){
        return API.getFile(id);
    });

});
