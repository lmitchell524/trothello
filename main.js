$(document).ready( initializeGame() );

function initializeGame(){
    console.log('does the dom load?');
}

var model = {
    grid: [],
    CreateGridCell: function(y, x){
        this.occupied = false;
        this.location = y + '-' + x;
        this.player = null;
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

};

var controller = {

}