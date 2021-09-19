const OPERATORS = ['*', '+', '-']

const OPERATORS_MAP = {
    '*': a => b => a * b,
    '+': a => b => a + b,
    '-': a => b => a - b,
    '/': a => b => a / b,
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const isEven = num => num % 2 === 0

const reduce = fn => arr => {
    let acc = arr[0]
    for(let i = 1; i < arr.length; i++){
        acc = fn(acc, arr[i])
    }  
    return acc
}

const calcRow = reduce((acc, value) => {
    const operator = OPERATORS_MAP[value]
    if(operator) return operator(acc)
    return acc(value)
})

const generateBoard = (boardSize, min, max) => {
    const randomIndex = len => Math.floor(Math.random() * len)
    const randomOperator = () => OPERATORS[randomIndex(OPERATORS.length)]
    const randomNumber = () => randomIndex((max + 1) - min) + min

    const matrix = []
    for(let i = 0; i < boardSize; i++) {
        const row = []
        for(let j = 0; j < boardSize; j++) {
            if(isEven(i)) {
                row.push(isEven(j) ? randomNumber() : randomOperator())
            } else {
                row.push(isEven(j) ? randomOperator() : ' ')
            }
        }
        matrix.push(row)
    }

    return matrix
}

const calcBoard = (board, boardSize) => {
    for(let i = 0; i < boardSize; i++) {
        const row = board[i]
        row.push(isEven(i) ? String(calcRow(row)) : ' ')
    }

    const row = Array(boardSize + 1).fill(' ')
    for(let i = 0; i < boardSize; i+=2) {
        const col = []
        for(let j = 0; j < boardSize; j++) {
            col.push(board[j][i])
            board[j][i] = String(board[j][i])
        }
        row[i] = String(calcRow(col))
    }

    board.push(row)
    return board
}

const generateEmptyBoard = (calculatedBoard) => {
    const matrix = []
    for(let i = 0; i < calculatedBoard.length; i++) {
        const row = []
        for(let j = 0; j < calculatedBoard.length; j++) {
            const cell = calculatedBoard[i][j]
            if(isEven(i)) {
                row.push(isEven(j) ? ' ' : String(cell))
            } else {
                row.push(isEven(j) ? String(cell) : ' ')
            }
        }
        matrix.push(row)
    }

    return matrix
}

const getBoardSize = () => {
    return new Promise(async (resolve) => {
        readline.question(`What's size board?`, value => {
            const num = Number(value)
            if(!isFinite(num) || isEven(num) || num < 3){
                console.log('INVALID BOARD SIZE. PLEASE CHOOSE AN ODD NUMBER GREATER THAN 2')
                resolve(getBoardSize())
            } else {
                resolve(num)
            }
        })
    })
}

const getNumRange = () => {
    return new Promise((resolve) => {
        readline.question(`What's num range? \n(min,max)  `, value => {
            const [min, max] = value.split(',')
            if(!isFinite(min) || !isFinite(max) || Number(min) >= Number(max)){
                console.log('INVALID NUMBERS, OR MIN MAX COMBINATION')
                resolve(getNumRange())
            } else {
                resolve([Number(min), Number(max)]) 
            }
        })
    })
}


const main = async () => {

    const boardSize = await getBoardSize()
    const [min, max] = await getNumRange()

    const matrix = generateBoard(boardSize, min, max)
    // check results from this board
    const calculatedBoard = calcBoard(matrix, boardSize)
    // modify this board
    const emptyBoard = generateEmptyBoard(calculatedBoard)

    // game loop
    const play = () => {
        console.log(emptyBoard)
        readline.question(`What's your input? \n(x,y=value)  `, value => {
            const [coord, guess] = value.split('=')
            const [i, j] = coord.split(',')
            const coordX = Number(i)
            const coordY = Number(j)
            const cell = emptyBoard[coordX][coordY]

            if(cell !== ' ' || i >= boardSize || j >= boardSize){
                console.log('INVALID COORDINATES PLEASE CHOOSE AN EMPTY CELL! \n', emptyBoard)
                play()
                return
            }

            if(calculatedBoard[coordX][coordY] === guess) {
                emptyBoard[coordX][coordY] = guess

                if(emptyBoard.toString() === calculatedBoard.toString()){
                    console.log('YOU WON!')
                    readline.close()
                    return
                }

                console.log('CORRECT! \n', emptyBoard)
            } else {
                console.log('INCORRECT! TRY AGAIN\n', emptyBoard)
            }

            play()
        })
    }

    play()

}

main()