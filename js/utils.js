/* DRAG & DROP FIX
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
jQuery.event.props.push('dataTransfer');

$.fn.dndhover = function(options) {

    return this.each(function() {

        var self = $(this);
        var collection = $();

        self.on('dragenter', function(event) {
            if (collection.size() === 0) {
                self.trigger('dndHoverStart');
            }
            collection = collection.add(event.target);
        });

        self.on('dragleave', function(event) {
            /*
             * Firefox 3.6 fires the dragleave event on the previous element
             * before firing dragenter on the next one so we introduce a delay
             */
            setTimeout(function() {
                collection = collection.not(event.target);
                if (collection.size() === 0) {
                    self.trigger('dndHoverEnd');
                }
            }, 1);
        });
    });
};