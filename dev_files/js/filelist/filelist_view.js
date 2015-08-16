WordCloud.module('Filelist', function(Filelist, WordCloud, Backbone, Marionette, $, _){

    Filelist.File = Marionette.ItemView.extend({
        template: 'fileitem',
        tagName: 'li',

        events: {
            'click button.js-delete' : 'deleteFile',
            'click button.js-select' : 'selectFile'
        },

        onRender: function(){
            this.$el.find('button').tooltip();
        },

        deleteFile: function(e){
            e.stopPropagation();
            this.trigger('file:delete', this.model);
        },

        selectFile: function(e){
            e.stopPropagation();

            if (this.$el.hasClass('selected')){
                e.preventDefault();
            } else {
                $('.selected').removeClass('selected');
                $('button.js-select').tooltip();
                this.$el.addClass('selected');
                this.$el.find('button.js-select').tooltip('destroy');
                this.trigger('file:select', this.model);
            }

        },

        noAction: function(e){
            e.stopPropagation();
            e.preventDefault();
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
        className: 'list-container control-panel-section',
        tagName: 'section',
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
