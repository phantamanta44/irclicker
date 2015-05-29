var wrap = function() {
    
    var tick = function() {
        postMessage(0);
        scheduleTick();
    };

    var scheduleTick = function() {
        setTimeout(tick, 50);
    };

    scheduleTick();
    
};

wrap();