$(document).ready(function() {
    
    var counter = 0;
    var count = $('#count-val');
    var worker;
    var shop = {
        item1: {
            val: 1, base: 100, current: 100, count: 0, elem: '.shopitem.textbook'
        },
        item2: {
            val: 5, base: 1337, current: 750, count: 0, elem: '.shopitem.student'
        },
        item3: {
            val: 12, base: 5000, current: 1600, count: 0, elem: '.shopitem.video'
        },
        item4: {
            val: 20, base: 15000, current: 3141, count: 0, elem: '.shopitem.sra'
        },
        item5: {
            val: 30, base: 66000, current: 9001, count: 0, elem: '.shopitem.lesson'
        },
        item6: {
            val: 50, base: 420420, current: 15000, count: 0, elem: '.shopitem.trip'
        }
    };
    
    var init = function() {
        // Initialize stuff
        shop = getCookie('espanolshop') ? JSON.parse(getCookie('espanolshop')) : shop;
        counter = getCookie('espanolcount') ? parseInt(getCookie('espanolcount')) : counter;
        worker = new Worker('static/js/worker.js');
        worker.onmessage = tick;
        $('#reset').click(function() {
            worker.terminate();
            counter = 0;
            rmCookie('espanolcount');
            rmCookie('espanolshop');
            document.location.reload();
        });
        
        $('.clickable.yo').click(function() {counter += 15;});
        
        // Initialize shop
        $.each(shop, function(i, obj) {
            $(obj.elem).click(function() {
                if (counter >= obj.current) {
                    counter -= obj.current;
                    obj.count++;
                }
            });
        });
    };
    
    var tick = function() {
        // Update stuff
        $.each(shop, function(i, obj) {
            $(obj.elem).find('.swag').text(obj.count);
            $(obj.elem).find('.price').text('$' + obj.current);
            obj.current = obj.base + Math.round(obj.base * 0.1 * Math.pow(obj.count, 2));
            counter += obj.count * obj.val;
        });
        
        // Update UI
        count.text(counter);
        
        // Save cookies
        setCookie('espanolcount', counter);
        setCookie('espanolshop', JSON.stringify(shop));
    };
    
    var testCompatibility = function() {
        var compat = true;
        compat &= (typeof(Worker) !== undefined);
        return compat;
    };
    
    var setCookie = function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue;
    };
    
    var getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
        }
        return false;
    };
    
    var rmCookie = function(cname) {
        document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
    
    if (testCompatibility())
        init();
    else
        alert("Your browser is too primitive to run this webapp!");
    
});