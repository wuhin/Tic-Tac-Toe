function GameBoard() {
    let board = ["", "", "", "", "", "", "", "", ""];

    const winConditions = [
        [0,1,2], [3,4,5], [6,7,8], // Rows
        [0,3,6], [1,4,7], [2,5,8], // Columns
        [0,4,8], [2,4,6]// Diagonals
    ];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    }
    
    const makeMove = (index, symbol) => {
        if(board[index] === ""){
            board[index] = symbol;
        }
    }

    const checkWin = (symbol) => {
        for(let [a, b, c] of winConditions){
           if(board[a] !== "" && board[a] === board[b] && board[a] === board[c]){
                return true;
           }
        }
        return false;

    }

    return {
        getBoard,
        resetBoard,
        makeMove,
        checkWin
    }
}

const player = (name, symbol) => {
    return {
        name,
        symbol
    }
};

const gameController = () => {

    const board = GameBoard();
    
    const player1 = player("Player 1", "X");
    const player2 = player("Player 2", "O");

    let currentPlayer = player1;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const setPlayers = (name1, name2) => {
        player1.name = name1;
        player2.name = name2;
    };

    const getCurrentPlayer = () => currentPlayer;

    const playRound = (index) => {
        if(gameOver || board.getBoard()[index] !== "") return;

        board.makeMove(index, currentPlayer.symbol);
        if(board.checkWin(currentPlayer.symbol)){ {
            gameOver = true;
            return `${currentPlayer.name} wins!`;
        }
        }
        
        if(board.getBoard().every(cell => cell !== "")){
            gameOver = true; // Draw
            return "It's a Draw!";
        }

        switchPlayer();

    }

    const resetGame = () => {{
        board.resetBoard();
        currentPlayer = player1;
        gameOver = false;
    }
    }


    return {
        getCurrentPlayer,
        playRound,
        resetGame,
        getBoard: board.getBoard,
        setPlayers
    }
}

const displayController = (function() {

    let gameStarted = false;
    const boardContainer = document.querySelector(".board");
    const statusContainer = document.querySelector(".status");
    const game = gameController();


    const updateBoard = () => {
        
        boardContainer.innerHTML = "";
        const board = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();

        statusContainer.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;

        board.forEach((symbol,index) => {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.dataset.index = index;
            cellButton.textContent = symbol;
            boardContainer.appendChild(cellButton);

        });
    }

    function handleCellClick(e){
        const selectedIndex = parseInt(e.target.dataset.index);
        const result = game.playRound(selectedIndex);
        updateBoard();
        
        if(result){
            statusContainer.textContent = result;
            disableBoard();
        }
    }

    const startButton = document.getElementById("start");
        startButton.addEventListener("click", () => {
        
        const player1Name = document.getElementById("player1").value || "Player 1";
        const player2Name = document.getElementById("player2").value || "Player 2";

        const player1 = player(player1Name, "X");
        const player2 = player(player2Name, "O");
        
        game.setPlayers(player1Name, player2Name);
        boardContainer.classList.add("active");
        updateBoard();
        gameStarted = true;
    });


    const resetButton = document.getElementById("resetButton");   
        resetButton.addEventListener("click", () => {
        game.resetGame();
        updateBoard();
    });

    function disableBoard(){
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.disabled = true);
    }

    boardContainer.addEventListener("click", (e) => {
        if(!gameStarted) return;
        handleCellClick(e);
    });

    return {updateBoard}


})();

