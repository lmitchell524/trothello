$(document).ready( initializeGame );


function initializeGame(){
    controller.createBoard();
    view.applyClickHandlers();
    controller.InitialChips();
    view.displayChipCount();
}


var model = {
    grid: [],
    player: 0,
    currentAvailableSpots: null,
    chipCount: null,
    player1ChipCount: null,
    player2ChipCount: null,
    get directionCheckFunctions() {return [this.checkUpLeft, this.checkUp, this.checkUpRight, this.checkRight, this.checkDownRight, this.checkDown, this.checkDownLeft, this.checkLeft]},

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
    addChipData: function(y, x, player){                //adds properties to current cell, calls function to make surrounding cells clickable
        var currentCell = this.grid[y][x];
        currentCell.occupied = true;
        currentCell.player = player;
        this.addSurroundingClick(y, x);
        this.chipCount++;
        if (player === 0){
            this.player1ChipCount++;
        } else {
            this.player2ChipCount++;
        }
    },
    addSurroundingClick: function(y, x){                //checks all 8 cells surrounding current cell and changes them to clickable
        if (y-1>=0 && x-1>=0) {
            this.grid[y - 1][x - 1].clickable = true;
        }
        if (y-1>=0) {
            this.grid[y - 1][x].clickable = true;
        }
        if (y-1>=0 && x+1<8) {
            this.grid[y - 1][x + 1].clickable = true;
        }
        if (x-1>=0) {
            this.grid[y][x - 1].clickable = true;
        }
        if (x+1<8) {
            this.grid[y][x + 1].clickable = true;
        }
        if (y+1<8 && x-1>=0) {
            this.grid[y + 1][x - 1].clickable = true;
        }
        if (y+1<8) {
            this.grid[y + 1][x].clickable = true;
        }
        if (y+1<8 && x+1<8) {
            this.grid[y+1][x+1].clickable = true;
        }
    },
    checkSurroundingChips: function(y, x, player){          //checks all 8 cells surrounding current cell, if it finds other player's disc, calls function to search in appropriate direction
        var otherPlayer = 1 - player;

        if (y-1>=0 && x-1>=0) {
            if (this.grid[y - 1][x - 1].player === otherPlayer) {
                if (this.checkUpLeft(y, x, player)) {
                    return true;
                };
            }
        }
        if (y-1>=0) {
            if (this.grid[y - 1][x].player === otherPlayer) {
                if (this.checkUp(y, x, player)) {
                    return true;
                };
            }
        }
        if (y-1>=0 && x+1<8) {
            if (this.grid[y - 1][x + 1].player === otherPlayer) {
                if (this.checkUpRight(y, x, player)) {
                    return true;
                };
            }
        }
        if (x+1<8) {
            if (this.grid[y][x + 1].player === otherPlayer) {
                if (this.checkRight(y, x, player)) {
                    return true;
                };
            }
        }
        if (y+1<8 && x+1<8) {
            if (this.grid[y + 1][x + 1].player === otherPlayer) {
                if (this.checkDownRight(y, x, player)) {
                    return true;
                };
            }
        }
        if (y+1<8) {
            if (this.grid[y + 1][x].player === otherPlayer) {
                if (this.checkDown(y, x, player)) {
                    return true;
                };
            }
        }
        if (y+1<8 && x-1>=0) {
            if (this.grid[y + 1][x - 1].player === otherPlayer) {
                if (this.checkDownLeft(y, x, player)) {
                    return true;
                };
            }
        }
        if (x-1>=0) {
            if (this.grid[y][x - 1].player === otherPlayer) {
                if (this.checkLeft(y, x, player)) {
                    return true;
                };
            }
        }
        return false;
    },
    checkUpLeft: function(y, x, player){
        var outputArray = [];

        for (var i=1; y-i>=0 && x-i>=0; i++){
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

        for (var i=1; y-i>=0 && x+i<8; i++){
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

        for (var i=1; y+i<8 && x+i<8; i++){
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

        for (var i=1; y+i<8 && x-i>=0; i++){
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
    },
    flipChipData: function(cellObject, player){
        cellObject.player = 1 - cellObject.player;
        if (player === 0){
            this.player1ChipCount++;
            this.player2ChipCount--;
        } else {
            this.player1ChipCount--;
            this.player2ChipCount++;
        }
    },
    checkWinStats: function(){
        if (this.chipCount === 64){
            if (this.player1ChipCount > this.player2ChipCount) {
                return 0;
            } else if (this.player1ChipCount < this.player2ChipCount){
                return 1;
            } else {
                return 2;
            }
        } else if (this.player1ChipCount === 0){
            return 1;
        } else if (this.player2ChipCount === 0){
            return 0;
        }
        return false;
    },
    gridAnnihilation: function(){
        this.grid = [];
    },
    statReset: function(){
        this.player = 0;
        this.currentAvailableSpots = null;
        this.chipCount = null;
        this.player1ChipCount = null;
        this.player2ChipCount = null;
    },
};

var view = {
    applyClickHandlers: function(){
        $('#gameboard').on('click', '.cell', controller.addChipToGame);
        $('.playButton').on('click', controller.gameStart);
        $('.playerBox1').on('click', controller.chosePlayer1);
        $('.playerBox2').on('click', controller.chosePlayer2);
        $('.playAgain').on('click', controller.playAgain);
    },
    gameboardCreation: function() {
        for (var i = 0; i < 8; i++) {
            var row = $('<div>').addClass('row');
            for (var col = 0; col < 8; col++) {
                var cell = $('<div>').addClass('cell')
                                     .attr('position', i + '-' + col);
                for (var j = 0; j < 1; j++){
                    var innerDiv = $('<div>').addClass("chip hideChip")
                                             .text("o");
                    $(cell).append(innerDiv);
                }
                $(row).append(cell);
            }
            $('#gameboard').append(row);
        }
    },

    addChipToBoard: function(targetCell, player){
        if(player === 0){
            targetCell.find('.chip').removeClass('hideChip').addClass('blue');
        } else {
            targetCell.find('.chip').removeClass('hideChip').addClass('orange');
        }
    },

    flipChip: function(domElement){
        domElement.toggleClass('orange blue');
    },

    playerTurn: function(player) {                  //adds glow class to player stats to show player turn, removes glow from opponent
        if (player === 0) {
            $('.leftAside').addClass('glowBlue');
            $('.rightAside').removeClass('glowOrange');
        } else if (player === 1) {
            $('.rightAside').addClass('glowOrange');
            $('.leftAside').removeClass('glowBlue');
        }
    },
    removeGhostOutlines: function(cellArray){
        for (var i=0; i<cellArray.length; i++){
            cellArray[i].location.find('.chip').removeClass('chipGhostOutline')
        }
    },
    addGhostOutlines: function(cellArray){           //displays light outline of disc to show player available moves
        for (var i=0; i<cellArray.length; i++){
            cellArray[i].location.find('.chip').addClass('chipGhostOutline');
        }
    },
    removeModal: function(){
        $('.modalContainer').css('transform', 'scale(0)');
        setTimeout(function(){
            $('main').css('opacity', '1');
        }, 1000);
    },
    displayChipCount: function(){
        $('.counter1').text(model.player1ChipCount);
        $('.counter2').text(model.player2ChipCount);
    },
    addPlayer1Glow: function(){                         //add glow to player selection in model
        $('.playerBox1').addClass('playerBox1Clicked');
        $('.playerBox2').removeClass('playerBox2Clicked');
    },
    addPlayer2Glow: function(){                         //add glow to player selection in model
        $('.playerBox2').addClass('playerBox2Clicked');
        $('.playerBox1').removeClass('playerBox1Clicked');
    },
    gameboardAnnihilation: function(){
        $('#gameboard').empty();
    },
};

var controller = {
    createBoard: function(){
        view.gameboardCreation();
        model.createGridArrayMatrix();
    },
    gameStart: function(){ //called when 'enter' button is clicked. Removes model, checks positions available for player one, based on user choice.
        view.removeModal();
        view.playerTurn(model.player);
        model.currentAvailableSpots = controller.checkAvailableSpots(model.player);
        view.addGhostOutlines(model.currentAvailableSpots);
    },
    chosePlayer1: function(){ //changes player data in model object to reflect users player choice, lights up in model
        model.player = 0;
        view.addPlayer1Glow();
    },
    chosePlayer2: function(){ //changes player data in model object to reflect users player choice, lights up in model
        model.player = 1;
        view.addPlayer2Glow();
    },
    InitialChips: function() {  //adds the initial four chips to the board at initiation
        view.addChipToBoard($(model.grid[3][3].location), 0);
        view.addChipToBoard($(model.grid[3][4].location), 1);
        view.addChipToBoard($(model.grid[4][3].location), 1);
        view.addChipToBoard($(model.grid[4][4].location), 0);
        model.addChipData(3, 3, 0);
        model.addChipData(3, 4, 1);
        model.addChipData(4, 3, 1);
        model.addChipData(4, 4, 0);
    },
    checkAvailableSpots: function(player){      //checks all 8 surrounding positions for available plays based on opponent discs and makes them clickable.
        var available = [];
        for(var i = 0; i < model.grid.length; i++){
            for(var j = 0; j < model.grid[i].length; j++){
                if(model.grid[i][j].occupied === false && model.grid[i][j].clickable === true){
                    if(model.checkSurroundingChips(i, j, player)){
                        available.push(model.grid[i][j]);
                    }
                }
            }
        }
        return available;
    },
    addChipToGame: function() {
        var targetCell = $(this);
        var player = model.player;
        var targetPosition;
        var y;
        var x;

        for (var i=0; i<model.currentAvailableSpots.length; i++) {
            if (targetCell[0] === model.currentAvailableSpots[i].location[0]){
                targetPosition = targetCell.attr('position').split('-');
                y = parseInt(targetPosition[0]);
                x = parseInt(targetPosition[1]);

                view.removeGhostOutlines(model.currentAvailableSpots);



                view.addChipToBoard(targetCell, player);
                model.addChipData(y, x, player);

                for (var j=0; j<model.directionCheckFunctions.length; j++){
                    var currentCheck = model.directionCheckFunctions[j](y, x, player);
                    if (currentCheck){
                        for (var k=0; k<currentCheck.length; k++){
                            view.flipChip(currentCheck[k].location.find('.chip'));
                            model.flipChipData(currentCheck[k], player);
                        }
                    }
                }

                view.displayChipCount();
                model.player = 1 - player;                      //switches player at turn end
                view.playerTurn(model.player);                  //switches player glow to opposite player at turn end
                model.currentAvailableSpots = controller.checkAvailableSpots(model.player);
                if(model.currentAvailableSpots[0] === undefined){
                    model.player = 1 - player;
                }
                view.addGhostOutlines(model.currentAvailableSpots);

                controller.checkWinState();
            }
        }
    },
    checkWinState: function(){
        var winState = model.checkWinStats();
        if (winState === 0){
            alert('player 1 wins!');
        } else if (winState === 1){
            alert('player 2 wins!');
        } else if (winState === 2){
            alert('it\'s a draw!');
        }
    },
    playAgain: function(){
        // will need to bind the controller object to "this" when we call this function from our click handler
        view.gameboardAnnihilation();
        model.gridAnnihilation();
        model.statReset();
        initializeGame();
        this.gameStart();
    },
};


