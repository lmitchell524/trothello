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
    ai: null,
    currentAvailableSpots: null,
    directionMap: [[-1, -1],[-1, 0],[-1, 1],[0, -1],[0, 0],[0, 1],[1, -1],[1, 0],[1, 1]],
    chipCount: null,
    player1ChipCount: null,
    player2ChipCount: null,
    humanTurn: false,
    aiTurn: false,
    CreateGridCell: function(y, x){
        this.occupied = false;
        this.location = $('.row:eq('+y+') .cell:eq('+x+')');        //:eq selects an element w/ specific index number starting at 0 - like :nth child but starts at 0, not 1
        this.player = null;
        this.clickable = false;
    },
    createGridArrayMatrix: function(){          //creates 8x8 grid. Outer loop creates 8 rows; Inner loop creates 8 cells within and pushes into the row array per loop. Pushes to grid array at the end.
        for (var y=0; y<8; y++){
            var row = [];
            for (var x=0; x<8; x++){
                var cell = new this.CreateGridCell(y, x); //give coordinate location of each new cell created as the loop runs, then pushes to row every time outer loop runs.
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
        var otherPlayer = 1 - player;                       //also checks position on board. Won't go into cells outside the board if y or x is less than 0 or greater than 7.

        for (let i=0; i<9; i++){
            let ydir = y + this.directionMap[i][0];
            let xdir = x + this.directionMap[i][1];

            if (ydir >= 0 && ydir < 8 && xdir >= 0 && xdir < 8) {
                if (this.grid[ydir][xdir].player === otherPlayer) {
                    if (this.checkDir(y, x, player, this.directionMap[i])) {
                        return true;
                    };
                }
            }
        }
        return false;
    },
    checkDir: function(y, x, player, dir){ //following 8 functions check direction of chips for opponent chip by first seeing if their own chip occupies space.
        var outputArray = [];              //Then checks if space is empty. Then checks for opponent chip. If found, push to an array and output array after you loop back to if and find current players chip (i.e. their own)

        for (let i=1, ydir = y + dir[0],  xdir = x + dir[1];
            ydir >= 0 && ydir < 8 && xdir >= 0 && xdir < 8;
            i++, ydir += dir[0], xdir += dir[1]){

            if (model.grid[ydir][xdir].player === player){
                return outputArray;
            } else if (model.grid[ydir][xdir].occupied === false){
                return false;
            } else if (model.grid[ydir][xdir].player !== player){
                outputArray.push(model.grid[ydir][xdir]);
            }
        }
        return false;
    },
    flipChipData: function(cellObject, player){
        cellObject.player = 1 - cellObject.player; //switch players and then add chip count
        if (player === 0){
            this.player1ChipCount++;
            this.player2ChipCount--;
        } else {
            this.player1ChipCount--;
            this.player2ChipCount++;
        }
    },
    checkWinStats: function(){
        if (this.chipCount === 64 || this.currentAvailableSpots[0] === undefined){
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
        this.currentAvailableSpots = null;
        this.chipCount = null;
        this.player1ChipCount = null;
        this.player2ChipCount = null;
    },

    getAiSpot: function(){
        var highestPriorityIndex = 0;

        var badSpots = [];
        var goodSpots = [];

        for (var i=0; i<model.currentAvailableSpots.length; i++){
            var position = model.currentAvailableSpots[i].location.attr('position');

            switch (position){
                case '0-0':
                case '0-7':
                case '7-0':
                case '7-7':
                    return this.currentAvailableSpots[i];
                case '0-1':
                case '1-0':
                case '1-1':
                    if (model.grid[0][0].player === model.ai){
                        return this.currentAvailableSpots[i]
                    }
                    badSpots.push(this.currentAvailableSpots[i]);
                    break;
                case '0-6':
                case '1-7':
                case '1-6':
                    if (model.grid[0][7].player === model.ai){
                        return this.currentAvailableSpots[i]
                    }
                    badSpots.push(this.currentAvailableSpots[i]);
                    break;
                case '6-0':
                case '7-1':
                case '6-1':
                    if (model.grid[7][0].player === model.ai){
                        return this.currentAvailableSpots[i]
                    }
                    badSpots.push(this.currentAvailableSpots[i]);
                    break;
                case '7-6':
                case '6-7':
                case '6-6':
                    if (model.grid[7][7].player === model.ai){
                        return this.currentAvailableSpots[i]
                    }
                    badSpots.push(this.currentAvailableSpots[i]);
                    break;
                default:
                goodSpots.push(this.currentAvailableSpots[i]);
            }
        }
        if (goodSpots[0]){
            return goodSpots[Math.floor(Math.random()*goodSpots.length)];
        } else {
            return badSpots[Math.floor(Math.random()*badSpots.length)];
        }

    }
};

//////////////////////////////////////////////////////////////
///////////////             VIEW           ///////////////////
//////////////////////////////////////////////////////////////

var view = {
    applyClickHandlers: function(){
        $('#gameboard').on('click', '.cell', controller.addChipToGame);
        $('.singleButton').on('click', function(){
            controller.gameStart(1-model.player); //opposite of what player chooses and set it to ai b/c we play in ai as the parameter
        });
        $('.multiButton').on('click', function(){
            controller.gameStart(null);
        });
        $('.playerBox1').on('click', controller.chosePlayer1);
        $('.playerBox2').on('click', controller.chosePlayer2);
        $('.playerBox1Win').on('click', controller.playAgainPlayer1);
        $('.playerBox2Win').on('click', controller.playAgainPlayer2);
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
        domElement.addClass('rotateY90');
        setTimeout(()=>{
            domElement.toggleClass('orange blue');
            domElement.removeClass('rotateY90');
        }, 500)
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
        $('.introModalContainer').css('transform', 'scale(0)');
        setTimeout(function(){
            $('main').css('opacity', '1');
        }, 1000);
    },
    displayChipCount: function(){
        $('.counter1').text(model.player1ChipCount);
        $('.counter2').text(model.player2ChipCount);
    },
    addPlayer1Glow: function(){      //add glow to player selection in intro model
        $('.playerBox1').addClass('playerBox1Clicked');
        $('.playerBox2').removeClass('playerBox2Clicked');
        $('.playerBox1Win').addClass('playerBox1WinClicked');
        $('.playerBox2Win').removeClass('playerBox2WinClicked');
    },
    addPlayer2Glow: function(){                         //add glow to player selection in intro model
        $('.playerBox2').addClass('playerBox2Clicked');
        $('.playerBox1').removeClass('playerBox1Clicked');
        $('.playerBox2Win').addClass('playerBox2WinClicked');
        $('.playerBox1Win').removeClass('playerBox1WinClicked');
    },
    addWinnerModal: function(){
        $('.winModalContent').css('transform', 'scale(1)');
    },
    removeWinnerModal: function(){
        $('.winModalContent').css('transform', 'scale(0)');
        controller.playAgain();
    },
    gameboardAnnihilation: function(){
        $('#gameboard').empty();
    },
};


//////////////////////////////////////////////////////////////
///////////////           CONTROLLER        //////////////////
//////////////////////////////////////////////////////////////


var controller = {
    createBoard: function(){
        view.gameboardCreation();
        model.createGridArrayMatrix();
    },
    gameStart: function(numberOfPlayers){ //called when 'enter' button is clicked. Removes model, checks positions available for player one, based on user choice.
        view.removeModal();
        view.playerTurn(model.player);
        model.currentAvailableSpots = controller.checkAvailableSpots(model.player);
        view.addGhostOutlines(model.currentAvailableSpots);
        model.ai = numberOfPlayers;
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
        if (!model.humanTurn && !model.aiTurn) {
            model.humanTurn = true;
            var targetCell = $(this);
            var targetPosition;
            var y;
            var x;
            var cellsToExplode = [];

            for (var i = 0; i < model.currentAvailableSpots.length; i++) {
                if (targetCell[0] === model.currentAvailableSpots[i].location[0]) {
                    targetPosition = targetCell.attr('position').split('-');
                    y = parseInt(targetPosition[0]);
                    x = parseInt(targetPosition[1]);

                    view.removeGhostOutlines(model.currentAvailableSpots);
                    view.addChipToBoard(targetCell, model.player);
                    model.addChipData(y, x, model.player);

                    for (var j = 0; j < model.directionMap.length; j++) {
                        var dir = model.directionMap[j];
                        var currentCheck = model.checkDir(y, x, model.player, dir);
                        if (currentCheck) {
                            for (var k = 0; k < currentCheck.length; k++) {
                                view.flipChip(currentCheck[k].location.find('.chip'));
                                // cellsToExplode.push(currentCheck[k].location.find('.chip'));
                                model.flipChipData(currentCheck[k], model.player);
                            }
                        }
                    }
                    afterMove();
                    // prepareExploders(cellsToExplode, 'sequential', afterMove);
                }
            }
            function afterMove() {
                view.displayChipCount();
                model.player = 1 - model.player;  //switches player at turn end

                model.currentAvailableSpots = controller.checkAvailableSpots(model.player);
                if (model.currentAvailableSpots[0] === undefined) {
                    model.player = 1 - model.player;
                    model.currentAvailableSpots = controller.checkAvailableSpots(model.player);
                }
                view.playerTurn(model.player); //switches player glow to opposite player at turn end
                if (model.player === model.ai) {
                    controller.aiMove();
                } else {
                    view.addGhostOutlines(model.currentAvailableSpots);
                }

                controller.checkWinState();
            }
            setTimeout(function(){
                model.humanTurn = false;
            }, 500)
        }
    },
    aiMove: function(){
        model.aiTurn = true;
        var targetSpot = model.getAiSpot();
        setTimeout(function() {
            model.aiTurn = false;
            if (targetSpot) {
               targetSpot.location.click();
            }
        }, (Math.random() * 1000 + 2000));
    },
    checkWinState: function(){
        var winState = model.checkWinStats();
        if (winState === 0){
            setTimeout(function(){
                $('.winnerModalHeader').text('Tron Wins!');
                view.addWinnerModal();
            }, 1000);
            explodeElement();
        } else if (winState === 1){
            setTimeout(function(){
                $('.winnerModalHeader').text('Clu Wins!');
                view.addWinnerModal();
            }, 1000);
            explodeElement();
        } else if (winState === 2){
            setTimeout(function() {
                $('.winnerModalHeader').text('It\'s a draw!');
                view.addWinnerModal();
            }, 1000);
        }
    },
    playAgain: function(ai){
        // will need to bind the controller object to "this" when we call this function from our click handler
        view.gameboardAnnihilation();
        model.gridAnnihilation();
        model.statReset();
        controller.createBoard();
        controller.InitialChips();
        view.displayChipCount();
        if (model.ai === null){
            model.ai = null;
        } else {
            model.ai = ai;
        }
        this.gameStart(model.ai);
    },
    playAgainPlayer1: function(){
        controller.chosePlayer1();
        view.removeWinnerModal();
        controller.playAgain(1);
    },
    playAgainPlayer2: function(){
        controller.chosePlayer2();
        view.removeWinnerModal();
        controller.playAgain(0);
    }
};
