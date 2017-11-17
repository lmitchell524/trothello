function prepareExploders(allDiscs, immediatelyExplode=false, finishedCallback=function(){}){
    allDiscs = $(allDiscs);
    allDiscs.each(function() {
        var amount = 10 - allDiscs.length;
        var disc = $(this);
        var width = disc.width() / amount;
        var height = disc.height() / amount;
        var html = disc.text();

        for(var row = 0; row < amount; row++){
            for(var col =0; col < amount; col++){
                var thisClip = `rect(${row*height}px, ${(col*width+width)}px, ${(row*height+height)}px, ${col*width}px)`;
                var piece = $("<div>",{
                    text: html,
                    'class': 'clipped',
                    css:{
                        clip: thisClip,
                    }
                });
                piece.appendTo(disc);
            }
        }
        if(immediatelyExplode==='instant'){
            explodeElement(disc);
        } else {
            disc.on('click', function(){
                explodeElement(this);
            });
        }
    });
    if(immediatelyExplode==='sequential'){
        explodeMultipleElements(allDiscs, 250, finishedCallback);
    }

}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function explodeElement(element) {
    $(element).find('.blue').css({'display' : 'none'});


    $(element).find('.clipped').each(function() {
        // debugger;
        var v = rand(120, 90),
            angle = rand(80, 89),
            theta = (angle * Math.PI) / 180,
            g = -9.8;
        var self = $(this);

        var t = 0,
            z, r, nx, ny,
            totalt =  8;


        var negate = [1, -1, 0];
        var direction = negate[ Math.floor(Math.random() * negate.length) ];

        z = setInterval(function() {
            var ux = ( Math.cos(theta) * v ) * direction;
            var uy = ( Math.sin(theta) * v ) - ( (-g) * t);
            nx = (ux * t);
            ny = (uy * t) + (0.5 * (g) * Math.pow(t, 2));
            $(self).css({'bottom' : (ny)+'px', 'left' : (nx)+'px'});
            t = t + 0.2;
            if(t > totalt) {
                $(self).remove();
                clearInterval(z);
            }
        }, 10);

    });
};

function explodeMultipleElements(externalCellArray, interval, finishedCallback){
    var cellArray = Array.prototype.slice.call(externalCellArray);
    explodeElement(cellArray.pop());
    var explodeIntervalTimer = setInterval(explodeNextCell, interval);

    function explodeNextCell(){
        console.log('cellArray: ', cellArray);
        explodeElement(cellArray.pop());
        if(cellArray.length===0){
            clearInterval(explodeIntervalTimer);
            finishedCallback();
        }
    }
}
