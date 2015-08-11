Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
    var template = '',
        url = 'assets/templates/' + templateId + '.html';

    Backbone.$.ajax({
        async : false,
        url : url,
        success : function(templateHtml) {
            template = templateHtml;
        }
    });

    return template;
};
