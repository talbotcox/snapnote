


function Dialog(options) {
    this.isOpen    = false;
    
    this.fragment  = document.createDocumentFragment();
    this.element   = document.createElement('dialog');
    this.container = document.createElement('dialog-container');
    
    this.fragment.appendChild(this.element);
    this.element.appendChild(this.container);
    
    if (options.events) {
        this.element.classList.add('events')        
    }

}


Dialog.prototype.configure = function(options) {
    if (options.element) {
        
        if (this.container.children.length) {
            while(this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
        
        this.container.appendChild(options.element);
    }
}

Dialog.prototype.open = function() {
    document.body.appendChild(this.element);
    this.isOpen = true;
}

Dialog.prototype.close = function() {
    this.fragment.appendChild(this.element);
    this.isOpen = false;
}



window.DialogElement = Dialog;

