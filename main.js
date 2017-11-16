$(document).ready( initializeGame );

function initializeGame(){
    controller.createBoard();
    controller.InitialChips();
}

var model = {
    grid: [],
    player: 0,
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
    },
    addChipData: function(y, x, player){
        var currentCell = this.grid[y][x];
        currentCell.occupied = true;
        currentCell.player = player;
        this.addSurroundingClick(y, x);
    },
    addSurroundingClick: function(y, x){ //this checks all 8 cells surrounding current cell and changes them to clickable
        this.grid[y-1][x-1].clickable = true;
        this.grid[y-1][x].clickable = true;
        this.grid[y-1][x+1].clickable = true;
        this.grid[y][x-1].clickable = true;
        this.grid[y][x+1].clickable = true;
        this.grid[y+1][x-1].clickable = true;
        this.grid[y+1][x].clickable = true;
        this.grid[y+1][x+1].clickable = true;
    },
    checkSurroundingChips: function(y, x, player){
        var otherPlayer = 1 - player;
        if(this.grid[y-1][x-1].player === otherPlayer){
            if(this.checkUpLeft(y, x, player)){
                return true;
            };
        }
        if(this.grid[y-1][x].player === otherPlayer){
            if(this.checkUp(y, x, player)){
                return true;
            };
        }
        if(this.grid[y-1][x+1].player === otherPlayer){
            if(this.checkUpRight(y, x, player)){
                return true;
            };
        }
        if(this.grid[y][x+1].player === otherPlayer){
            if(this.checkRight(y, x, player)){
                return true;
            };
        }
        if(this.grid[y+1][x+1].player === otherPlayer){
            if(this.checkDownRight(y, x, player)){
                return true;
            };
        }
        if(this.grid[y+1][x].player === otherPlayer){
            if(this.checkDown(y, x, player)){
                return true;
            };
        }
        if(this.grid[y+1][x-1].player === otherPlayer){
            if(this.checkDownLeft(y, x, player)){
                return true;
            };
        }
        if(this.grid[y][x-1].player === otherPlayer){
            if(this.checkLeft(y, x, player)){
                return true;
            };
        } return false;
    },
    checkUpLeft: function(y, x, player){
        var outputArray = [];

        for (var i=1; y-i>=0, x-i>=0; i++){
            if (model.grid[y-i][x-i].player === player){
                return outputArray;
            } else if (model.grid[y-i][x-i].occupied === false){
                return false;
            } else if (model.grid[y-i][x-i].player !== player){
                outputArray.push(model.grid[y-i][x-i]);
            }
        }
        return false;
    },
    checkUp: function(y, x, player){
        var outputArray = [];

        for (var i=1; y-i>=0; i++){
            if (model.grid[y-i][x].player === player){
                return outputArray;
            } else if (model.grid[y-i][x].occupied === false){
                return false;
            } else if (model.grid[y-i][x].player !== player){
                outputArray.push(model.grid[y-i][x]);
            }
        }
        return false;
    },
    checkUpRight: function(y, x, player){
        var outputArray = [];

        for (var i=1; y-i>=0, x+i<8; i++){
            if (model.grid[y-i][x+i].player === player){
                return outputArray;
            } else if (model.grid[y-i][x+i].occupied === false){
                return false;
            } else if (model.grid[y-i][x+i].player !== player){
                outputArray.push(model.grid[y-i][x+i]);
            }
        }
        return false;
    },
    checkRight: function(y, x, player){
        var outputArray = [];

        for (var i=1; x+i<8; i++){
            if (model.grid[y][x+i].player === player){
                return outputArray;
            } else if (model.grid[y][x+i].occupied === false){
                return false;
            } else if (model.grid[y][x+i].player !== player){
                outputArray.push(model.grid[y][x+i]);
            }
        }
        return false;
    },
    checkDownRight: function(y, x, player){
        var outputArray = [];

        for (var i=1; y+i<8, x+i<8; i++){
            if (model.grid[y+i][x+i].player === player){
                return outputArray;
            } else if (model.grid[y+i][x+i].occupied === false){
                return false;
            } else if (model.grid[y+i][x+i].player !== player){
                outputArray.push(model.grid[y+i][x+i]);
            }
        }
        return false;
    },
    checkDown: function(y, x, player){
        var outputArray = [];

        for (var i=1; y+i<8; i++){
            if (model.grid[y+i][x].player === player){
                return outputArray;
            } else if (model.grid[y+i][x].occupied === false){
                return false;
            } else if (model.grid[y+i][x].player !== player){
                outputArray.push(model.grid[y+i][x]);
            }
        }
        return false;
    },
    checkDownLeft: function(y, x, player){
        var outputArray = [];

        for (var i=1; y+i<8, x-i>=0; i++){
            if (model.grid[y+i][x-i].player === player){
                return outputArray;
            } else if (model.grid[y+i][x-i].occupied === false){
                return false;
            } else if (model.grid[y+i][x-i].player !== player){
                outputArray.push(model.grid[y+i][x-i]);
            }
        }
        return false;
    },
    checkLeft: function(y, x, player){
        var outputArray = [];

        for (var i=1; x-i>=0; i++){
            if (model.grid[y][x-i].player === player){
                return outputArray;
            } else if (model.grid[y][x-i].occupied === false){
                return false;
            } else if (model.grid[y][x-i].player !== player){
                outputArray.push(model.grid[y][x-i]);
            }
        }
        return false;
    }
};

var view = {
    gameboardCreation: function() {
        for (var i = 0; i < 8; i++) {
            var row = $('<div>').addClass('row');
            for (var col = 0; col < 8; col++) {
                var cell = $('<div>').addClass('cell');
                for (var j = 0; j < 1; j++){
                    var innerDiv = $('<div>').addClass("chip hideChip")
                                             .text("o")
                                             .attr('position', i + '-' + col);
                    $(cell).append(innerDiv);
                }
                $(row).append(cell);
            }
            $('#gameboard').append(row);
        }
    },

    addChipToBoard: function(targetCell, player){
        if(player === 0){
            targetCell.location.find('.chip').removeClass('hideChip').addClass('blue');
        } else {
            targetCell.location.find('.chip').removeClass('hideChip').addClass('orange');
        }
    }
};

var controller = {
    createBoard: function(){
        view.gameboardCreation();
        model.createGridArrayMatrix();
    },
    InitialChips: function() {
        view.addChipToBoard(model.grid[3][3], 0);
        view.addChipToBoard(model.grid[3][4], 1);
        view.addChipToBoard(model.grid[4][3], 1);
        view.addChipToBoard(model.grid[4][4], 0);
        model.addChipData(3, 3, 0);
        model.addChipData(3, 4, 1);
        model.addChipData(4, 3, 1);
        model.addChipData(4, 4, 0);
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

