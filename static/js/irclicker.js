$(document).ready(function() {
    
    var counter = 0;
    var count = $('#count-val');
    var sentence = $('#sentence');
    var worker;
    var click = {
        yo: '.clickable.yo',
        tu: '.clickable.tu',
        el: '.clickable.el',
        nos: '.clickable.nos',
        vos: '.clickable.vos',
        ellos: '.clickable.ellos'
    };
    var shop = {
        item1: {
            val: 0.4, base: 100, current: 100, count: 0, elem: '.shopitem.textbook'
        },
        item2: {
            val: 3, base: 1337, current: 750, count: 0, elem: '.shopitem.student'
        },
        item3: {
            val: 12, base: 5000, current: 1600, count: 0, elem: '.shopitem.video'
        },
        item4: {
            val: 24, base: 15000, current: 3141, count: 0, elem: '.shopitem.sra'
        },
        item5: {
            val: 42, base: 66000, current: 9001, count: 0, elem: '.shopitem.lesson'
        },
        item6: {
            val: 69, base: 420420, current: 15000, count: 0, elem: '.shopitem.trip'
        }
    };
    var sent;
    var currentSen;
    
    var init = function() {
        // Initialize stuff
        shop = getCookie('espanolshop') ? JSON.parse(getCookie('espanolshop')) : shop;
        counter = getCookie('espanolcount') ? parseFloat(getCookie('espanolcount')) : counter;
        initClickables();
        $.getJSON('static/json/sentences.json', function(data) {
            sent = data.sentences;
            randomSentence();
        });
        worker = new Worker('static/js/worker.js');
        worker.onmessage = tick;
        $('#reset').click(function() {
            worker.terminate();
            counter = 0;
            rmCookie('espanolcount');
            rmCookie('espanolshop');
            document.location.reload();
        });
        
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
    
    var initClickables = function() {
        $.each(click, function(i, obj) {
            $(obj).click(function() {
                if (currentSen.ans === i) {
                    counter += currentSen.val;
                    flashColor('#4caf50');
                }
                else {
                    counter -= currentSen.val;
                    flashColor('#f44336');
                }
                randomSentence();
            });
        });
    };
    
    var tick = function() {
        // Update stuff
        if (counter < 0)
            counter = 0;
        $.each(shop, function(i, obj) {
            $(obj.elem).find('.swag').text(obj.count);
            $(obj.elem).find('.price').text('$' + obj.current);
            obj.current = obj.base + Math.round(obj.base * 0.1 * Math.pow(obj.count, 2));
            counter += obj.count * obj.val;
            if (counter <= obj.current)
                $(obj.elem).find('.price').css('color', '#f44336');
            else 
                $(obj.elem).find('.price').css('color', '#ffffff');
        });
        
        // Update UI
        var roundedCounter = Math.round(counter * 10) / 10;
        count.text(roundedCounter);
        document.title = 'IrClicker | ' + roundedCounter;
        
        // Save cookies
        setCookie('espanolcount', counter);
        setCookie('espanolshop', JSON.stringify(shop));
    };
    
    var randomSentence = function() {
        displaySentence(sent[Math.floor(Math.random() * sent.length)]);
    };
    
    var displaySentence = function(val) {
        sentence.html(val.sen.replace('^', '<div class="ans">').replace('$', '</div>'));
        currentSen = val;
    };
    
    var flashColor = function(color) {
        sentence.css('background-color', color);
        setTimeout(function() {
            sentence.css('background-color', '#303030');
        }, 271);
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