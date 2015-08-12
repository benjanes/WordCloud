WordCloud.module('Wordlist', function(Wordlist, WordCloud, Backbone, Marionette, $, _){

    Wordlist.File = Backbone.Model.extend({

        defaults: {
            fileName: '',
            id: 0
        }

        //urlRoot: ''

        /*initialize: function(){
            if (this.isNew()) {
                this.set('created', Date.now());
            }
        }*/

    });

    Wordlist.FileCollection = Backbone.Collection.extend({
        model: Wordlist.File,
        //url: '',
        localStorage: new Backbone.LocalStorage('wordcloud-files')

    });

    var initializeFiles = function(){
        var sampleFile = new Wordlist.File();
        files.add(sampleFile);
        sampleFile.save();
    };

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
        }
    };

    WordCloud.reqres.setHandler('wordlist:files', function(){
        return API.getFiles();
    });

    /*var API = {
        getWordlistFiles: function(){
            var files = new Wordlists.FileCollection();
            var defer = $.Deferred();

            files.fetch({
                success: function(data){
                    defer.resolve(data);
                }
            });

            var promise = defer.promise();
            return promise;
        }
    };

    */

});
