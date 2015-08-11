WordCloud.module('Filelist', function(Filelist, WordCloud, Backbone, Marionette, $, _){

    Filelist.Layout = Marionette.LayoutView.extend({
        template: 'filelist_layout',

        regions: {
            loadRegion: '#load-region',
            listRegion: '#list-files-region'
        }
    });

    Filelist.Loadnew = Marionette.ItemView.extend({
        template: 'load'
    });

    Filelist.File = Marionette.ItemView.extend({
        template: 'fileitem',
        tagName: 'li'
    });

    Filelist.Files = Marionette.CompositeView.extend({
        template: 'fileitems',
        childView: Filelist.File,
        childViewContainer: 'ul',

        initialize: function(){
            this.listenTo(this.collection, 'reset', function(){
                this.attachHtml = function(collectionView, childView, index){
                    collectionView.$el.append(childView.el);
                };
            });
        },

        onRenderCollection: function(){
            this.attachHtml = function(collectionView, childView, index){
                collectionView.$el.prepend(childView.el);
            };
        }
    });

    /*Views.LoadView = Backbone.Marionette.ItemView.extend({
        template: 'load',

        events: {
            'change input.js-load-file': 'addWordlist'
        },

        addWordlist: function(e) {

            var file = e.target.files[0];

            if (!file) {
                alert('File loading failed. Please give it another shot.');
            } else if (!file.type.match('text.*')) {
                alert(file.name + ' is not a text file. Please choose a text file to load!');
            } else {
                var reader = new FileReader();

                reader.onload = function(e) {
                    var contents = e.target.result;

                    console.log('file name: ' + file.name + ', file type: ' + file.type);

                    var contentsArray = (contents.split(' ')).filter(function(val){
                        return val.charAt(0) !== '{' && val.indexOf('\\') === -1;
                    });
                    var newArr = contentsArray.map(function(val){
                        return val.replace(/\W/g, '').toLowerCase();
                    });

                    console.log(newArr);
                };

                reader.readAsText(file);
            }

        }

    });*/

});
