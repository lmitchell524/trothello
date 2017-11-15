$(document).ready( initializeGame() );

function initializeGame(){
    var main = $('<main>');
    var leftAside = $('<aside>').addClass('leftAside');
    var rightAside = $('<aside>').addClass('rightAside');
    var player1Stats = $('<div>').addClass('player1Stats');
    var player2Stats = $('<div>').addClass('player2Stats');
    var gameBoard = $('<section>').attr('id','gameboard');

    for (var i = 0; i < 8; i++){
        var row = $('<div>').addClass('row');
        for(var col = 0; col < 8; col++){
            var column = $('<div>').addClass('column');
            (row).append(column);
        }
        return row;
    }

    (gameBoard).append(row);
    (leftAside).append(player1Stats);
    (rightAside).append(player2Stats);
    (main).append(rightAside, gameBoard, leftAside);
    ('body').append(main);
}

var model = {
    grid: [],
    CreateGridCell: function(){

    }
};

var view = {

};

var controller = {

};