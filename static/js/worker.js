var wrap = function() {
    
    var tick = function() {
        postMessage();
        scheduleTick();
    };

    var scheduleTick = function() {
        setTimeout(tick, 50);
    };

    scheduleTick();
    
};

wrap();