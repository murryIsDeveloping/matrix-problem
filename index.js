const BOARD_SIZE = 3
const NUM_RANGE_HIGH = 9
const NUM_RANGE_LOW = 1
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

const randomIndex = len => Math.floor(Math.random() * len)
const randomOperator = () => OPERATORS[randomIndex(OPERATORS.length)]
const randomNumber = () => randomIndex((NUM_RANGE_HIGH + 1) - NUM_RANGE_LOW) + NUM_RANGE_LOW

const isEven = num => num % 2 === 0
const isOdd = num => num % 2 !== 0

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

const generateBoard = (boardSize = BOARD_SIZE) => {
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

const calcBoard = (board) => {
    for(let i = 0; i < BOARD_SIZE; i++) {
        const row = board[i]
        row.push(isEven(i) ? String(calcRow(row)) : ' ')
    }

    const row = Array(BOARD_SIZE + 1).fill(' ')
    for(let i = 0; i < BOARD_SIZE; i+=2) {
        const col = []
        for(let j = 0; j < BOARD_SIZE; j++) {
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


const main = () => {
    const matrix = generateBoard()
    // check results from this board
    const calculatedBoard = calcBoard(matrix)
    // modify this board
    const emptyBoard = generateEmptyBoard(calculatedBoard)

    // game loop
    const play = (() => {
        readline.question(`What's your input? \n(x,y=value)  `, value => {
            const [coord, guess] = value.split('=')
            const [i, j] = coord.split(',')
            const coordX = Number(i)
            const coordY = Number(j)
            const cell = emptyBoard[coordX][coordY]

            if(cell !== ' ' || i >= BOARD_SIZE || j >= BOARD_SIZE){
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
    })()

}

main()