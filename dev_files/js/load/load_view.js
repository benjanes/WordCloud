WordCloud.module('Load', function(Load, WordCloud, Backbone, Marionette, $, _){

    Load.View = Marionette.ItemView.extend({
        template: 'load',
        childView: WordCloud.Filelist.File,

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

                reader.onload = function(e) {

                    var fileName = file.name;

                    var result = e.target.result;

                    var contentsArray = (result.split(' ')).filter(function(val){
                        return val.charAt(0) !== '{' && val.indexOf('\\') === -1;
                    });
                    var fileWords = contentsArray.map(function(val){
                        return val.replace(/\W/g, '').toLowerCase();
                    });

                    var newFile = new WordCloud.Wordlist.File({fileName: fileName, fileWords: fileWords});

                    WordCloud.trigger('file:load', newFile);

                };

            }

        }

    });

});
