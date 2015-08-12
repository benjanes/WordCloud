WordCloud.module('Wordlist', function(Wordlist, WordCloud, Backbone, Marionette, $, _){

    Wordlist.File = Backbone.Model.extend({

        defaults: {
            fileName: '',
            id: 0
        }

        /*initialize: function(){
            if (this.isNew()) {
                this.set('created', Date.now());
            }
        }*/

    });

    Wordlist.FileCollection = Backbone.Collection.extend({
        model: Wordlist.File,
        //localStorage: new Backbone.LocalStorage('wordcloud-wordlist'),
        comparator: 'created'
    });

    var files;

    var initializeFiles = function(){
        files = new Wordlist.FileCollection([
            {
                fileName: 'first file'
            },
            {
                fileName: 'file numero dos'
            },
            {
                fileName: 'file 3'
            }
        ]);
    };

    var API = {
        getFiles: function(){
            if(files === undefined){
                initializeFiles();
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
