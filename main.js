$(document).ready( initializeGame );

function initializeGame(){
    view.gameboardCreation();
}



var model = {
    grid: [],
    CreateGridCell: function(){

    }
};

var view = {
    gameboardCreation: function() {
        for (var i = 0; i < 8; i++) {
            var row = $('<div>').addClass('row');
            for (var col = 0; col < 8; col++) {
                var column = $('<div>').addClass('column');
                $(row).append(column);
            }
            $('#gameboard').append(row);
        }
    }



};

var controller = {

};

