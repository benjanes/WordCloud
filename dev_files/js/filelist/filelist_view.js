WordCloud.module('Filelist', function(Filelist, WordCloud, Backbone, Marionette, $, _){

    Filelist.File = Marionette.ItemView.extend({
        template: 'fileitem',
        tagName: 'li',

        events: {
            'click button.js-delete' : 'deleteFile',
            'click button.js-select' : 'selectFile'
        },

        deleteFile: function(e){
            e.stopPropagation();
            this.trigger('file:delete', this.model);
        },

        selectFile: function(e){
            e.stopPropagation();
            this.$el.addClass('selected');
            this.trigger('file:select', this.model);
        },

        remove: function(){
            var self = this;
            this.$el.fadeOut(function(){
                Marionette.ItemView.prototype.remove.call(self);
            });
        }
    });

    Filelist.Files = Marionette.CompositeView.extend({
        template: 'fileitems',
        childView: Filelist.File,
        childViewContainer: 'ol',

        events: {
            'change input' : 'clickedInput'
        },

        clickedInput: function(e){

            var file = e.target.files[0];

            if (!file) {
                alert('File loading failed. Please give it another shot.');
            } else if (!file.type.match('text.*')) {
                alert(file.name + ' is not a text file. Please choose a text file to load!');
            } else {

                var reader = new FileReader();
                reader.readAsText(file);

                var passedThis = this;

                reader.onload = function(e) {

                    var fileName = file.name;

                    var result = e.target.result;

                    var contentsArray = (result.split(' ')).filter(function(val){
                        return val.charAt(0) !== '{' && val.indexOf('\\') === -1;
                    });
                    var fileWords = contentsArray.map(function(val){
                        return val.replace(/\W/g, '').toLowerCase();
                    });

                    this.collection.add({fileName: fileName, fileWords: fileWords});

                    return this;

                }.bind(passedThis);

            }

        }

    });

});
