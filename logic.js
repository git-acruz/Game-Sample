let board;
let score = 0;
let rows = 4;
let columns = 4;

// These variables will be used to monitor if the user already won in the value of 2048, 4096, or 8192.
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// declaring variable used for touchscreen input
// X = x-axis, Y = y-axis, initial value as zero which means not touched.
let startX = 0;
let startY = 0;

// setGame() function will be used to set the game board
function setGame() {
	board = [
		[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
	]

	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {
			let tile = document.createElement("div");

			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}

	}

	setTwo();
	setTwo();
}
// This function is to update the appearance of the tile based on its number.
function updateTile(tile, num) {

	tile.innerText="";
	tile.classList.value="";
	tile.classList.add("tile");


	if(num > 0) {
        // This will display the number of the tile 
        tile.innerText = num.toString();
           
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}

window.onload = function() {
	setGame();

	
}

function handleSlide(e) {

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {

		if(e.code == "ArrowLeft") {
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight") {
			slideRight();
			setTwo();
		}
		else if(e.code == "ArrowUp") {
			slideUp();
			setTwo();	
		}
		else if(e.code == "ArrowDown") {
			slideDown();
			setTwo();
		}

	}

	document.getElementById("score").innerText = score;

	setTimeout(() => {
		checkWin();
	}, 50);
	

	if (hasLost() == true) {
		setTimeout(() => {
			alert("GameOver.");
			restartGame();
			alert("click any arrow to restart.");
		}, 500) // 500ms delay.

	}
	console.log(e.code);
}

document.addEventListener("keydown", handleSlide);

function filterZero(row){
	return row.filter(num => num != 0);
}

//  slide function ist he one merging the adjacent tiles
function slide(row) {
	row = filterZero(row);

	for(let i = 0; i<row.length -1; i++) {
		if(row[i] == row[i+1]) {
			row[i] *=2;
			row[i + 1] = 0;

			score += row[i]; // get the number and to the current score
		}
	}

	row = filterZero(row);

	// Add zeroes on the back after merging
	while(row.length < columns) {
		row.push(0);
	}

	return row;
}

function slideLeft() {

	for(let r = 0; r < rows; r++){
        let row = board[r];
        let originalRow = row.slice(); // variable for sliding animation, documents the original position prior sliding.
        row = slide(row); // we use slide function, so that the slide function will merge adjacent tiles
        board[r] = row;
        
        // After merging, the position and the value of tiles might change, thus it follows that the id, number, color of tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            // calling sliding animation
            if(originalRow[c] !== num && num !== 0) {
            	tile.style.animation = "slide-from-right 0.2s"
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 200)
            }
        }
    }
}

function slideRight() {

	for(let r = 0; r < rows; r++){
        let row = board[r];
        let originalRow = row.slice(); // variable for sliding animation, documents the original position prior sliding.
        row.reverse(); // to reverse the row arrangement
        row = slide(row);
        row.reverse();

        board[r] = row;
        
        // After merging, the position and the value of tiles might change, thus it follows that the id, number, color of tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            // calling sliding animation
            if(originalRow[c] !== num && num !== 0) {
            	tile.style.animation = "slide-from-left 0.2s"
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 200)
            }
        }
    }
}

function slideUp() {

	for(let c = 0; c < columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = col.slice(); // documents position prior sliding

        col = slide(col);

        let changedIndices = []; // documents the current positions after tiles ahve changed
        for(let r = 0; r < rows; r++) {

        	if (originalCol[r] !== col[r]) {
        		changedIndices.push(r);
        	}
        }
        
        for(let r = 0; r < rows; r++){
        	board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            // calling sliding animation
            if(changedIndices.includes(r)  && num !== 0) {
            	tile.style.animation = "slide-from-bottom 0.2s"
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 200)
            }
        }
    }
}


function slideDown() {

	for(let c = 0; c < columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = col.slice(); // documents position prior sliding

        col.reverse();
        col = slide(col);
        col.reverse();

        let changedIndices = []; // documents the current positions after tiles have changed
        for(let r = 0; r < rows; r++) {

        	if (originalCol[r] !== col[r]) {
        		changedIndices.push(r);
        	}
        }
        
        for(let r = 0; r < rows; r++){
        	board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            // calling sliding animation
            if(changedIndices.includes(r)  && num !== 0) {
            	tile.style.animation = "slide-from-top 0.2s"
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 200)
            }
        }
    }
}

//This function checks our board if there is an empty tile
function hasEmptyTile() {

	for(let r = 0; r<rows; r++) {
		for(let c = 0; c<columns; c++) {
			if (board[r][c] == 0) {
				return true;
			}
		}
	}

	return false;
}

function setTwo() {

	if (hasEmptyTile() == false) {
		return
	}

	let found = false;

	while (found == false) {
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if (board[r][c] == 0) {
			// Generate new file
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}

function checkWin() {

	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {

			if (board[r][c] == 2048 && is2048Exist == false) {
				alert("Congratulations! You got 2048");
				is2048Exist = true;
			}
			else if (board[r][c] == 4096 && is4096Exist == false) {
				alert("Amazing! You reached 4096");
				is4096Exist = true;
			}
			else if (board[r][c] == 8192 && is8192Exist == false) {
				alert("You're a genius! You got 8192");
				is8192Exist = true;
			}
			
		}

	}
}

// hasLost function will check if there is still an ampty tile ( meaning, there is still a possible move) and it will also check if there a same tile value adjacent.
function hasLost() {

	 for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {

			if (board[r][c] === 0) {
				return false;
			}

			const currentTile = board[r][c];


			if ( r > 0 && board[r-1][c] === currentTile || r < rows - 1 && board[r+1][c] === currentTile || c > 0 && board[r][c-1] === currentTile || c < rows - 1 && board[r][c+1] === currentTile) {
				// if we found an adjacent tile with the same value as the current tile, false, the user has not lost
				return false
			}
		}
	}

	// No empty tile and no possible moves left
	return true;
}

function restartGame() {

	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {
			board[r][c] = 0;
		}
	}
	setTwo();
	score = 0;
}

// triggered when user touch the screen and assigns coordinates of that touch/event
// Inputs the coordinates value to the startX and startY
document.addEventListener("touchstart", (e) =>{
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});

// touch move
document.addEventListener("touchmove", (e) => {
	if(!e.target.className.includes("tile")) {
		return
	}
	// to restrict scrolling feature
	e.preventDefault()
}, {passive: false}); // use passive property to make sure that the preventDefault() will work.

document.addEventListener("touchend", (e) => {
	if(!e.target.className.includes("tile")) {
		return
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	// Check if the horizontal swipe is greater in magnitude than the vertical swipe
	if (Math.abs(diffX) > Math.abs(diffY)) {
	    // Horizontal swipe
	    if (diffX > 0) {
	        slideLeft(); // Call a function for sliding left
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideRight(); // Call a function for sliding right
	        setTwo(); // Call a function named "setTwo"
	    }
	}
	else {
	    // Vertical swipe
	    if (diffY > 0) {
	        slideUp(); // Call a function for sliding up
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideDown(); // Call a function for sliding down
	        setTwo(); // Call a function named "setTwo"
	    }
	}

	document.getElementById("score").innerText = score;

	checkWin();

	// Call hasLost() to check for game over conditions
	if (hasLost()) {
	    // Use setTimeout to delay the alert
	    setTimeout(() => {
	    alert("Game Over! You have lost the game. Game will restart");
	    restartGame();
	    alert("Click any key to restart");
	    }, 100); 
	}
});




