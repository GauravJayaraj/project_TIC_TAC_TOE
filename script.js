
const Player = function(name, mark){
    return {name, mark};
};




const game = ( ()=>{
    let player1 = Player('Player1', 'X');
    let player2 = Player('Player2', 'O');
    
    let movesCounter = 9;

    const begin = ()=>{

        gameBoard.reset();

        gameBoard.setActive(player1);
        dispController.set(player1.name+"'s turn");
    }


    // on click fill invoke this method
    const nextTurn = ()=>{
        movesCounter--;

        if(movesCounter%2){
            gameBoard.setActive(player1);
            dispController.set(player1.name+"'s turn");
        }
        else{
            gameBoard.setActive(player2);
            dispController.set(player2.name+"'s turn");
        }   

        let result = gameBoard.checkWinner();
        console.log(result)
        if(result.endGame){
            if(result.mark == player1.mark)
                dispController.set('Player1 wins!');
            else
                dispController.set('Player2 wins!');

            dispController.clear();

            gameBoard.showWinner(result.resConfig);
        }
        // end game
        if(movesCounter==0){
            dispController.set("Draw!");
            dispController.clear();
        }


    }


    const reset = ()=>{
        gameBoard.reset();
        movesCounter = 9;
        begin();
    }

    return { begin, nextTurn, reset};

})();






const dispController = ( ()=>{
    const display = document.querySelector('.dispController');
    const messDisp = display.querySelector('.message');
    const buttons = display.querySelector('.buttons');

    // console.log(buttons)

    buttons.addEventListener('click', ()=>{
        // Restart game
        game.reset();
       
        // remove button
        buttons.style.display = 'none';

        // BACK TO NORMAL
        messDisp.style.color = "whitesmoke";
    })

    const set = (message)=>{
        messDisp.innerHTML = message;
    }

    // use to give option to play again
    const clear = ()=>{
        const messDisp = display.querySelector('.message');
        messDisp.innerHTML += '</br>Let the games begin!'
        messDisp.style.color = "navy";
       
        buttons.style.display = 'inline-block';
    }

    return{
        set,
        clear
    }
})();


const gameBoard = ( ()=>{
    const board = document.querySelector('.gameBoard');

    let boardArr = [];

    let activePlayer = {};

    const setActive = (player)=>{
        activePlayer = player;
        console.log(activePlayer);
    }

    const create = ()=>{
        for(let i=0; i<9; i++){
            let fill = document.createElement('div');
            fill.classList.add('fill');
            board.appendChild(fill);

            boardArr.push('');
        }
        console.log(boardArr);

        const fillers = document.querySelectorAll('.fill');

        // to track used positions
        fillers.forEach((fill,idx)=>{
            fill.dataset.pos = idx.toString();

            fill.addEventListener('click', ()=>{
                fill.innerHTML = activePlayer.mark;
                boardArr[fill.getAttribute('data-pos')] = activePlayer.mark;
                console.log(boardArr);
                
                // using CSS to disable click event for this filler
                fill.style["pointer-events"] = "none"; 

                game.nextTurn();
            });
        });
    }

    const checkWinner = ()=>{
        const winConfig = [
            [0,1,2],
            [3,4,5],
            [6,7,8],

            [0,3,6],
            [1,4,7],
            [2,5,8],

            [0,4,8],
            [2,4,6]

        ];

        let endGame = false;
        let mark = '';
        let resConfig = undefined;
        winConfig.forEach( (config)=>{
            console.log(config)
            let winner=true;
            for(let i=1; i<3; i++){
                if(boardArr[config[i]]=="")
                {
                    winner=false;
                    break;
                }
                if(boardArr[config[i]]!=boardArr[config[0]])
                {
                    winner=false;
                    break;
                }
            }

            if(winner){
                endGame = true;
                mark = boardArr[config[0]];
                resConfig = config;
            }

        });

        return {endGame,mark, resConfig};
    }


    const reset = ()=>{
        
        // as boardArr const, cannot reassign
        boardArr = [];

        const fillers = document.querySelectorAll('.fill');
        
        
        // delete from dom current board
        while(board.firstChild){
            board.removeChild(board.lastChild);
        }

        // recreate clean board
        create();
    }

    const showWinner = (config)=>{
        // TERMINATE ANYMORE CLICKS
        const fillers = document.querySelectorAll('.fill');
        fillers.forEach( (fill)=>{
            // using CSS to disable click event for this filler
            fill.style["pointer-events"] = "none"; 
        })
        
        let winningFills =[];
        config.forEach((pos)=>{
            let fillWin = board.querySelector(`[data-pos="${pos}"]`);
            winningFills.push(fillWin);
        });

        winningFills.forEach((fill)=>{
            fill.classList.add('fillwin');
            fill.classList.remove('fill')
        })

    }

    return{create, setActive, checkWinner, showWinner,  reset};
})();





// DRIVER
game.begin();