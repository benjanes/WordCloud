WordCloud.module('Wordlists', function(Wordlists, WordCloud, Backbone, Marionette, $, _){

    Wordlists.File = Backbone.Model.extend({

        initialize: function(){
            if (this.isNew()) {
                this.set('created', Date.now());
            }
        }

    });

    Wordlists.FileCollection = Backbone.Collection.extend({
        model: Wordlists.File,
        localStorage: new Backbone.LocalStorage('wordcloud-wordlist'),
        comparator: 'created'
    });

    var API = {
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

    WordCloud.reqres.setHandler('wordlist:files', function(){
        return API.getWordlistFiles();
    });

});
