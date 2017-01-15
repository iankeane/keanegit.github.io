var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


Square = function(){
	this.data = 0;
	this.h = 0;
	this.g = 0;
	this.f = 0;
	this.px = 0;
	this.py = 0;
	this.path = false;
	this.start = false;
	this.row;
	this.col;
	this.parent;
};


// Colors
var BACKGROUND = "rgb(200, 200, 150)";
var GREEN =      "rgb(  0, 150,   0)";
var DARKGREEN =  "rgb( 41,  64,  26)";
var RED =        "rgb(150,   0,   0)";
var BLUE =       "rgb(  0,   0, 150)";
var GREY =       "rgb(112, 128, 144)";

var size = 20;
var margin = 5;
var grid = [];
var openlist = [];
var closelist = [];
var done = false;
var instructionscreen = false;
var astar = false;
var algorithm = 'A';
var display = 'N';
var speed = 3;
var map;

var button1 = false;
var button2 = false;
var button3 = false;
var button4 = false;
var button5 = false;
var button6 = false;
var button7 = false;


var cursorX;
var cursorY;
var startrow = -1;
var startcol = -1;
var endrow;
var endcol;

var closedset = [];    // The set of nodes already evaluated.
var openset = [];   // The set of tentative nodes to be evaluated, initially containing the start node
var came_from = [];    // The map of navigated nodes.


document.onmousemove = function(e){
	cursorX = e.pageX - (window.innerWidth - canvas.width)/2;
	cursorY = e.pageY - (window.innerHeight - canvas.height)/2;
};

document.onclick = function (e) {
	if (!instructionscreen) {
		var mousecol = Math.floor(cursorX / (size + margin));
		var mouserow = Math.floor(cursorY / (size + margin));
		if (!e) e = window.event;
		if (e.shiftKey) {
			for (var row = 0; row < 20; row++) {
				for (var col = 0; col < 20; col++) {
					if (grid[row][col].data == 2)
						grid[row][col].data = 0;
				}
			}
			grid[mouserow][mousecol].data = 2;
		}
		else if (e.metaKey) {
			for (var row = 0; row < 20; row++) {
				for (var col = 0; col < 20; col++) {
					if (grid[row][col].data == 3)
						grid[row][col].data = 0;
				}
			}
			grid[mouserow][mousecol].data = 3;
		}
		else {

			if (grid[mouserow][mousecol].data == 0)
				grid[mouserow][mousecol].data = 1;
			else
				grid[mouserow][mousecol].data = 0;
		}

	}else{
		if(button1){
			map = [
				[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,3]
				];
			for(var row = 0;  row < 20;  row++) {
				for (var col = 0; col < 20; col++) {
					grid[row][col].data = map[row][col];
				}
			}
			instructionscreen = false;

		}
		if(button2){
			map =
			[
				[2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,3],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0]
				];
			for(var row = 0;  row < 20;  row++) {
				for (var col = 0; col < 20; col++) {
					grid[row][col].data = map[row][col];
				}
			}
			instructionscreen = false;

		}
		if(button3){
			map =
			[
				[2,0,0,0,0,0,1,1,1,1,0,1,0,0,0,0,1,1,0,3],
				[1,1,1,1,1,0,0,0,0,1,0,0,0,1,1,0,0,1,0,1],
				[1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,1],
				[0,0,0,1,1,0,1,0,0,0,0,1,1,1,0,0,0,1,0,1],
				[0,1,0,0,0,0,1,1,1,1,0,1,1,1,0,1,0,1,0,1],
				[0,1,1,1,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,1],
				[0,1,0,1,1,1,1,1,0,1,0,0,0,1,1,1,0,1,0,1],
				[0,0,0,1,1,0,0,0,0,1,0,1,1,1,1,1,0,1,0,1],
				[0,1,1,1,1,0,1,1,0,1,1,1,1,1,0,0,0,1,0,1],
				[0,1,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,0,1],
				[0,1,0,1,1,1,1,1,1,1,0,1,1,0,0,0,0,1,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,1],
				[1,1,0,1,1,1,0,1,0,1,1,1,1,0,1,1,0,1,0,1],
				[1,1,0,0,0,1,0,1,0,1,1,0,1,0,1,1,0,0,0,1],
				[0,1,1,1,0,0,0,1,0,0,0,0,1,0,1,1,1,1,1,1],
				[0,0,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1,1,0,0],
				[1,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
				[0,0,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1],
				[1,1,0,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
				[1,1,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1]
				];
			for(var row = 0;  row < 20;  row++) {
				for (var col = 0; col < 20; col++) {
					grid[row][col].data = map[row][col];
				}
			}
			instructionscreen = false;

		}
		if(button4){
			algorithm = 'A';
		}
		if(button5){
			algorithm = 'D';
		}
		if(button6){
			speed++;
		}
		if(button7){
			speed --;
		}


	}
};

document.onkeypress = function(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 32){
		if(!instructionscreen)
			instructionscreen = true;
		else
			instructionscreen = false;
	}
	if(code == 113){
		if(display == 'N'){
			display = 'F';
		}
		else if(display == 'F'){
			display = 'H';
		}
		else if(display == 'H'){
			display = 'G';
		}
		else if(display == 'G'){
			display = 'P';
		}
		else if(display == 'P'){
			display = 'N';
		}
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	if(code == 13 && !done){
		//Assign start/end coordinates
		for(var row = 0;  row < 20;  row++) {
			for (var col = 0; col < 20; col++) {
				//Start
				if(grid[row][col].data == 2){
					if(startrow == -1 || startcol == -1){
						startrow = row;
						startcol = col;
						setAstar(grid[startrow][startcol]);
					}
				}
				//End
				if(grid[row][col].data == 3){
					endrow = row;
					endcol = col;
				}
				//Close obstacles
				if(grid[row][col].data == 1){
					closelist.push(grid[row][col]);
				}
			}
		}
		// //Close current start
		// grid[grid[startrow][startcol].px][grid[startrow][startcol].py].start = false;
		// grid[startrow][startcol].start = true;
		// closelist.push(grid[startrow][startcol]);
		//Calculate H
		for(var row = 0;  row < 20;  row++) {
			for (var col = 0; col < 20; col++) {
				grid[row][col].h = (Math.abs(endrow-row)+Math.abs(endcol-col))*10;
			}
		}
	if(algorithm == 'A'){
		Astar(grid[startrow][startcol],grid[endrow][endcol]);
	}else{
		Dijkstra(grid[startrow][startcol],grid[endrow][endcol]);

	// 	//Peruse surrounding squares
	// 	var neighbors = returnNeighbors(startrow,startcol);

	// 	if(neighbors.length == 0){
	// 		// grid[startrow][startcol].start = false;
	// 		// // closelist.push(grid[startrow][startcol]);
	// 		// // grid[grid[startrow][startcol].px][grid[startrow][startcol].py]
	// 		// startrow = grid[grid[startrow][startcol].px][grid[startrow][startcol].py].row;
	// 		// startcol = grid[grid[startrow][startcol].px][grid[startrow][startcol].py].col;
	// 		// grid[startrow][startcol].start = true;
	// 		var tempmin = 1000;
	// 		for(var i = 0; i < openlist.length; i++){
	// 			if(openlist[i].f < tempmin && !closelist.contains(openlist[i])){
	// 				grid[startrow][startcol].start = false;
	// 				tempmin = openlist[i].f;
	// 				startrow = openlist[i].row;
	// 				startcol = openlist[i].col;
	// 				grid[startrow][startcol].start = true;
	// 			}
	// 		}
	// }

	// 	for(var i = 0;  i < neighbors.length;  i++) {
	// 				//Add to openlist list
	// 				// if(!(closelist.contains(grid[row][col])))
	// 					openlist.push(neighbors[i]);


	// 				//Assign P
	// 				neighbors[i].px = startrow;
	// 				neighbors[i].py = startcol;
	// 				//Assign G
	// 				if(neighbors[i].row == startrow || neighbors[i].col == startcol)
	// 					neighbors[i].g += 10;
	// 				else
	// 					neighbors[i].g += 14;
	// 				//Assign F
	// 				neighbors[i].f = neighbors[i].h + neighbors[i].g;

	// 				var min = neighbors[i].f;
	// 	}

	// 	for(var i = 0;  i < neighbors.length;  i++) {
	// 			if(neighbors[i].f <= min){//&& openlist.contains(neighbors[i])
	// 				min = neighbors[i].f;
	// 				startrow = neighbors[i].row;
	// 				startcol = neighbors[i].col;

	// 			}
	// }

	// //If end is added to openlist list
	// if(startrow == endrow && startcol == endcol){
	// 	buildPath(endrow,endcol);
	// }
}
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

};

function init() {
	for(var row = 0;  row < 20;  row++) {
		grid[row] = [];
		for (var col = 0; col < 20; col++) {
			var x = new Square();
			grid[row][col] = x;
			grid[row][col].row = row;
			grid[row][col].col = col;
		}
	}

	grid[0][0].data = 2;
	grid[19][18].data = 3;

	loop();
}

function loop() {
	requestAnimationFrame(loop);
	if(!instructionscreen)
		drawGrid();
	else
		instructions();
}

function instructions(){

	for(var row = 0;  row < 20;  row++) {
		for (var col = 0; col < 20; col++) {
			closedset = [];    // The set of nodes already evaluated.
			openset = [];   // The set of tentative nodes to be evaluated, initially containing the start node
			came_from = [];    // The map of navigated nodes.
			grid[row][col].data   = 0;
			grid[row][col].h      = 0;
			grid[row][col].g      = 0;
			grid[row][col].f      = 0;
			grid[row][col].px     = 0;
			grid[row][col].py     = 0;
			grid[row][col].parent  = null;
			grid[row][col].path   = false;
			grid[row][col].start  = false;
			openlist = [];
			closelist = [];
			done = false;
			startrow = -1;
			startcol = -1;

		}
	}
	startrow = -1;
	startcol = -1;

	grid[0][0].data = 2;
	grid[19][19].data = 3;


	 button1 = false;
	 button2 = false;
	 button3 = false;
	 button4 = false;
	 button5 = false;
	 button6 = false;
	 button7 = false;

	ctx.fillStyle = BACKGROUND;
	ctx.fill();

	ctx.fillStyle = "black";
	ctx.font = "36px Helvetica";
	ctx.fillText("Instructions", 30, 50);
	ctx.font = "24px Helvetica";
	ctx.fillText("Shift-click to change start point", 50, 90);
	ctx.fillText("Ctrl-click to change target", 50, 120);
	ctx.fillText("Click to add/remove obstacles", 50, 150);
	ctx.fillText("Set map and algorithm below", 50, 180);
	ctx.fillText("Press enter to calculate path", 50, 210);
	ctx.fillText("Press q to toggle variable view", 50, 240);

     var by = 300 ;
     var bw = 150;
     var bh = 50;
     var b1x = 5 + 17;
     var b2x = 5 + 27 + bw;
     var b3x = 5 + 37 + bw + bw;

	//Draw Buttons
	ctx.fillStyle = DARKGREEN;
	ctx.fillRect(b1x, by, bw, bh);
	ctx.fillRect(b2x, by, bw, bh);
	ctx.fillRect(b3x, by, bw, bh);
	ctx.fillRect(b1x, by + bh + 10, bw, bh);
	ctx.fillRect(b2x, by + bh + 10, bw, bh);
	ctx.fillRect(b1x, by + 2*bh + 20, bw, bh);
	ctx.fillRect(b2x, by + 2*bh + 20, bw, bh);

	//Button Text
	ctx.fillStyle = "black";
	ctx.font = "20px Helvetica";

	ctx.fillText("Load Map1", b1x+9,by+30);
	ctx.fillText("Load Map2", b2x+9,by+30);
	ctx.fillText("Load Map3", b3x+9,by+30);
	ctx.fillText("Set A Star",   b1x+9,by+bh+10+30);
	ctx.fillText("Set Dijkstra", b2x+9,by+bh+10+30);
	ctx.fillText("Speed Up",   b1x+9,by+2*bh+20+30);
	ctx.fillText("Slow Down", b2x+9,by+2*bh+20+30);


        //Row 1
        if ( (cursorY > by) && (cursorY < by + bh)){

            //Load Map1
            if((cursorX > b1x ) && (cursorX < b1x+bw)){
            	ctx.fillStyle = GREEN;
            	ctx.fillRect(b1x, by, bw, bh);
            	ctx.fillStyle = "black";
            	ctx.fillText("Load Map1", b1x+9,by+30);
            	button1 = true;

		}
            //Load Map2
            if ((cursorX > b2x ) && (cursorX < b2x+bw)){
            	ctx.fillStyle = GREEN;
            	ctx.fillRect(b2x, by, bw, bh);
            	ctx.fillStyle = "black";
            	ctx.fillText("Load Map2", b2x+9,by+30);
            	button2 = true;

		}
            //Load Map3
            if ((cursorX > b3x ) && (cursorX < b3x+bw)){
            	ctx.fillStyle = GREEN;
            	ctx.fillRect(b3x, by, bw, bh);
            	ctx.fillStyle = "black";
            	ctx.fillText("Load Map3", b3x+9,by+30);
            	button3 = true;

            }
	}
        //Row 2
        if  ((cursorY > by  + bh + 10) && (cursorY < by + bh + 10 + bh)){
            //Set A Star
            if ((cursorX > b1x)  && (cursorX < b1x+bw)){
      		ctx.fillStyle = GREEN;
      		ctx.fillRect(b1x, by + bh + 10, bw, bh);
      		ctx.fillStyle = "black";
      		ctx.fillText("Set A Star",   b1x+9,by+bh+10+30);
      		button4 = true;

            }
            //Set Dijkstra
            if ((cursorX > b2x)  && (cursorX < b2x+bw)){
	     		ctx.fillStyle = GREEN;
	     		ctx.fillRect(b2x, by + bh + 10, bw, bh);
	     		ctx.fillStyle = "black";
	     		ctx.fillText("Set Dijkstra", b2x+9,by+bh+10+30);
	     		button5 = true;

            }
      }
        //Row 3
        if ((cursorY > by  + 2*bh + 20) && (cursorY < by  + 2*bh + 20 + bh)){
            //Speed Up
            if ((cursorX > b1x)  && (cursorX < b1x+bw)){
            	ctx.fillStyle = GREEN;
            	ctx.fillRect(b1x, by + 2*bh + 20, bw, bh);
            	ctx.fillStyle = "black";
           		ctx.fillText("Speed Up",   b1x+9,by+2*bh+20+30);
           		button6 = true;

            }
            //Slow Down
            if ((cursorX > b2x)  && (cursorX < b2x+bw)){
            	ctx.fillStyle = GREEN;
            	ctx.fillRect(b2x, by + 2*bh + 20, bw, bh);
            	ctx.fillStyle = "black";
           		ctx.fillText("Slow Down", b2x+9,by+2*bh+20+30);
           		button7 = true;}
      }
  //Speedbar
	ctx.fillStyle = DARKGREEN;
	ctx.fillText("Speed:", b3x+9,by+2*bh+20+25);
	ctx.fillRect(b3x+9,by+2*bh+20+30,size*speed,size);
	if(speed >=7)
		speed = 7;
	if (speed <=0)
		speed = 0;
	if(speed == 0)
		ctx.fillText("Step", b3x+9,by+2*bh+20+45);
}

function drawGrid() {

	ctx.fillStyle = BACKGROUND;
	ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fill();

	for (var row = 0; row < 20; row++){
		for (var col = 0; col < 20; col++){
			var color = DARKGREEN;
			if (grid[row][col].data == 1)
				color = GREEN;
			if (grid[row][col].data == 2)
				color = BLUE;
			if (grid[row][col].data == 3)
				color = RED;
			if (grid[row][col].start|| closedset.contains(grid[row][col]))
				color = GREY;
			if (grid[row][col].path)
				color = BACKGROUND;


			ctx.fillStyle = color;
			ctx.fillRect((margin + size) * col + margin, (margin + size) * row + margin, size, size);

			if (display == 'F'){
						ctx.font = "9px Helvetica";
						ctx.fillStyle = BACKGROUND;
						var x = col*5 + col*size + 6;
						var y = row*5 + row*size + 14;
						ctx.fillText(grid[row][col].f, x, y);
			}
			if (display == 'H'){
						ctx.font = "9px Helvetica";
						ctx.fillStyle = BACKGROUND;
						var x = col*5 + col*size + 6;
						var y = row*5 + row*size + 14;
						ctx.fillText(grid[row][col].h, x, y)
			}

			if (display == 'G'){
						ctx.font = "9px Helvetica";
						ctx.fillStyle = BACKGROUND;
						var x = col*5 + col*size + 6;
						var y = row*5 + row*size + 14;
						ctx.fillText(grid[row][col].g, x, y)
			}


			if (display == 'P'){
						ctx.font = "7px Helvetica";
						ctx.fillStyle = BACKGROUND;
						var x = col*5 + col*size + 6;
						var y = row*5 + row*size + 12;
						if(grid[row][col].parent)
						ctx.fillText(grid[row][col].parent.row + "," +  grid[row][col].parent.col, x, y);
			}


		}
	}

}

function buildPath(row,col){
	while(row || col){
		var curr = grid[row][col];
		curr.start = false;
		curr.path = true;
		row = curr.px;
		col = curr.py;
	}
	done = true;

}

function returnNeighbors(row,col){
	var array = [];//AND NOT BLOCKED
	if(grid[row+1] && grid[row+1][col-1] &&
		grid[row+1][col  ].data != 1 && grid[row  ][col-1].data != 1 &&
	 !(closelist.contains(grid[row+1][col-1])))
		array.push(grid[row+1][col-1]);
	if(grid[row-1] && grid[row-1][col-1] &&
	 grid[row  ][col-1] && grid[row-1][col  ].data != 1 && grid[row  ][col-1].data != 1 &&
	 !(closelist.contains(grid[row-1][col-1])))
		array.push(grid[row-1][col-1]);
	if(grid[row-1] && grid[row-1][col+1] &&
	 grid[row-1][col  ].data != 1 && grid[row  ][col+1].data != 1 &&
	 !(closelist.contains(grid[row-1][col+1])))
		array.push(grid[row-1][col+1]);
	if(grid[row+1] && grid[row+1][col+1] &&
	 grid[row+1][col  ].data != 1 && grid[row  ][col+1].data != 1 &&
	 !(closelist.contains(grid[row+1][col+1])))
		array.push(grid[row+1][col+1]);

	if(grid[row][col-1] && grid[row  ][col-1] && !closelist.contains(grid[row  ][col-1]))
		array.push(grid[row  ][col-1]);
	if(grid[row-1] && !closelist.contains(grid[row-1][col  ]))
		array.push(grid[row-1][col  ]);
	if(grid[row+1] && !closelist.contains(grid[row+1][col  ]))
		array.push(grid[row+1][col  ]);
	if(grid[row][col+1] && !closelist.contains(grid[row  ][col+1]))
		array.push(grid[row  ][col+1]);

	return array;
}

Array.prototype.contains = function(obj) {
    // var i = this.length;
    // while (i--) {
    //     if (this[i] == obj) {
    //         return true;
    //     }
    // }
    // return false;
    for(var i = 0; i < this.length; i++)
    	if(this[i] == obj)
    		return true;

    return false;
}

function setAstar(start){
					  closedset = [];    // The set of nodes already evaluated.
				    openset = [start];   // The set of tentative nodes to be evaluated, initially containing the start node
				    came_from = [];    // The map of navigated nodes.

				    start.g = 0;    // Cost from start along best known path.
				    // Estimated total cost from start to goal through y.
				    start.f = start.g + start.h;
}
function Astar(start,goal){
    		var current = openset[0];
    		for(var i = 0; i < openset.length; i++){
    			if(openset[i].f < current.f){
    				current = openset[i];
    				// openset.splice(i,1);
    			}
				}
				current.start = false;
        // current := the node in openset having the lowest f_score[] value
        if(current == goal)
            return reconstruct_path(current.parent, current);

        // remove current from openset
        for(var i = 0; i < openset.length; i++){
        	if(openset[i] == current){
        		openset.splice(i,1);
        	}
        }
        if(!(closedset.contains(current)))
        	closedset.push(current);
        	var n = trueNeighbors(current);
        	for(var i = 0; i < n.length; i++){
            if(closedset.contains(n[i]))
                continue;

	          if(n[i].row == current.row || n[i].col == current.col)
							var tempg = current.g + 10;
						else
							var tempg = current.g + 14;


            if(!(openset.contains(n[i])) || (tempg < n[i].g)){
                n[i].parent = current;
                n[i].g = tempg;
                n[i].f = n[i].g + n[i].h;
                if(!(openset.contains(n[i])))
                    openset.push(n[i]);
            }
					}
					current.start = true;
    // alert("No path");
  }

function Dijkstra(start,goal){
    		var current = openset[0];
    		for(var i = 0; i < openset.length; i++){
    			if(openset[i].f < current.f){
    				current = openset[i];
    				// openset.splice(i,1);
    			}
				}
				current.start = false;
        // current := the node in openset having the lowest f_score[] value
        if(current == goal)
            return reconstruct_path(current.parent, current);

        // remove current from openset
        for(var i = 0; i < openset.length; i++){
        	if(openset[i] == current){
        		openset.splice(i,1);
        	}
        }
        if(!(closedset.contains(current)))
        	closedset.push(current);
        	var n = trueNeighbors(current);
        	for(var i = 0; i < n.length; i++){
            if(closedset.contains(n[i]))
                continue;

	          if(n[i].row == current.row || n[i].col == current.col)
							var tempg = current.g + 10;
						else
							var tempg = current.g + 14;


            if(!(openset.contains(n[i])) || (tempg < n[i].g)){
                n[i].parent = current;
                n[i].g = tempg;
                n[i].f = n[i].g;
                if(!(openset.contains(n[i])))
                    openset.push(n[i]);
            }
					}
					current.start = true;
    // alert("No path");
  }


function reconstruct_path(came_from,current){
    var total_path = [current];
    while(current.parent){
        current = current.parent;
        total_path.push(current);
        current.path = true;
    }
    return total_path;
		}


function trueNeighbors(node){
	Array = [];
	if(grid[node.row+1] && grid[node.row+1][node.col-1] && grid[node.row+1][node.col-1].data != 1
		&& grid[node.row+1][node.col  ].data != 1 && grid[node.row  ][node.col-1].data != 1)
		Array.push(grid[node.row+1][node.col-1]);
	if(grid[node.row-1] && grid[node.row-1][node.col+1] && grid[node.row-1][node.col+1].data != 1
		&& grid[node.row-1][node.col  ].data != 1 && grid[node.row  ][node.col+1].data != 1)
		Array.push(grid[node.row-1][node.col+1]);
	if(grid[node.row+1] && grid[node.row+1][node.col+1] && grid[node.row+1][node.col+1].data != 1
		&& grid[node.row+1][node.col  ].data != 1 && grid[node.row  ][node.col+1].data != 1)
		Array.push(grid[node.row+1][node.col+1]);
	if(grid[node.row-1] && grid[node.row-1][node.col-1] && grid[node.row-1][node.col-1].data != 1
		&& grid[node.row-1][node.col  ].data != 1 && grid[node.row  ][node.col-1].data != 1)
		Array.push(grid[node.row-1][node.col-1]);
	if(grid[node.row+1] && grid[node.row+1][node.col  ] && grid[node.row+1][node.col  ].data != 1)
		Array.push(grid[node.row+1][node.col  ]);
	if(grid[node.row-1] && grid[node.row-1][node.col  ] && grid[node.row-1][node.col  ].data != 1)
		Array.push(grid[node.row-1][node.col  ]);
	if(grid[node.row  ][node.col+1] && grid[node.row  ][node.col+1].data != 1)
		Array.push(grid[node.row  ][node.col+1]);
	if(grid[node.row  ][node.col-1] && grid[node.row  ][node.col-1].data != 1)
		Array.push(grid[node.row  ][node.col-1]);

	return Array;
}
init();

