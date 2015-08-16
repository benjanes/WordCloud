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
            $('.selected').removeClass('selected');
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

        initialize: function(){
            this.listenTo(WordCloud, 'file:load', this.addFile);
        },

        addFile: function(newFile){
            this.collection.add(newFile);
            newFile.save();

            return this;
        }

    });

});
