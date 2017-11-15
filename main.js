$(document).ready( initializeGame );

function initializeGame(){
    controller.createBoard();
}

var model = {
    grid: [],
    CreateGridCell: function(y, x){
        this.occupied = false;
        this.location = $('.row:eq('+y+') .cell:eq('+x+')');
        this.player = null;
        this.clickable = false;
    },
    createGridArrayMatrix: function(){
        for (var y=0; y<8; y++){
            var row = [];
            for (var x=0; x<8; x++){
                var cell = new this.CreateGridCell(y, x);
                row.push(cell)
            }
            this.grid.push(row);
        }
    }
};

var view = {
    gameboardCreation: function() {
        for (var i = 0; i < 8; i++) {
            var row = $('<div>').addClass('row');
            for (var col = 0; col < 8; col++) {
                var cell = $('<div>').addClass('cell');
                for (var j = 0; j < 1; j++){
                    var innerDiv = $('<div>').addClass("chip")
                                             .text("o")
                                             .css('display', 'none')
                                             .attr('position', i + '-' + col);
                    $(cell).append(innerDiv);
                }
                $(row).append(cell);
            }
            $('#gameboard').append(row);
        }
    }
};

var controller = {
    createBoard: function(){
        view.gameboardCreation();
        model.createGridArrayMatrix();
    },
    checkAvailableSpots: function(){
            for(var i = 0; i < model.grid.length; i++){
                for(var j = 0; j < model.grid[i].length; j++){
                    if(model.grid[i][j].occupied === false && model.grid[i][j].clickable === true){
                        console.log("test");
                    }
                }
            }
    }
};
