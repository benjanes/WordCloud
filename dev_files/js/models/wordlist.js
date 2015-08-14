WordCloud.module('Wordlist', function(Wordlist, WordCloud, Backbone, Marionette, $, _){

    Wordlist.File = Backbone.Model.extend({

        defaults: {
            fileName: '',
            fileWords: ''
        },

        initialize: function(){
            if (this.isNew()) {
                this.set('created', Date.now());
            }
        }

    });

    Wordlist.FileCollection = Backbone.Collection.extend({

        model: Wordlist.File,
        localStorage: new Backbone.LocalStorage('wordcloud-files'),

        comparator: function(model) {
            return -model.get('created');
        }

    });

    var API = {
        getFiles: function(){

            var files = new Wordlist.FileCollection();
            files.fetch();

            // load in a sample if there aren't any files loaded in local storage
            if(files.length === 0){
                var sampleFile = new Wordlist.File({fileName: 'Sample File', fileWords: ['this', 'is', 'wordcloud', 'wordcloud']});
                files.add(sampleFile);
                sampleFile.save();
            }

            return files;
        },

    };

    WordCloud.reqres.setHandler('wordlist:files', function(){
        return API.getFiles();
    });

});
