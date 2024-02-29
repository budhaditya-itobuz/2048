import { getData, setData, enums } from "./helper.js"

const container = document.getElementById("container")
const newGame = document.getElementById("new-game")
const liveScore = document.getElementById("live-score")
const bestScoreBtn = document.getElementById('best-score')
const gameOverBtn = document.getElementById('game-over')

// const colorStyle=[]
// let i=2
// while(i<=4096)
// {
//     i=i*2
//     colorStyle.push(i)
// }

// console.log(colorStyle)

// console.log(colorStyle)

const width = 4

let nodeMatrix = []

const emptyResult = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]
let result
let score = 0
let bestScore = 0

let flagGameOver = 0

const rotate = (degree) => {
    for (let i = 0; i < degree; i++)
        result = result[0].map((val, index) => result.map(row => row[index]).reverse())
}


const createBox = () => {
    for (let i = 0; i < width; i++) {
        let row = []
        for (let j = 0; j < width; j++) {
            const item = document.createElement('div')
            item.classList.add('item')
            container.appendChild(item)
            item.setAttribute('row', i)
            item.setAttribute('col', j)
            row.push(item)
            if (result[i][j] !== 0)
                item.innerText = result[i][j]
        }
        nodeMatrix.push(row)
    }
}

const generate = () => {
    const emptyBoxes = []
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            if (result[i][j] === 0)
                emptyBoxes.push({ i: i, j: j })
        }
    }
    if (emptyBoxes.length === 0) {
        gameOver()
        return
    }
    const box = Math.floor(Math.random() * emptyBoxes.length)
    const number = Math.floor(Math.random() * 2)
    if (number === 1) {
        result[emptyBoxes[box].i][emptyBoxes[box].j] = 2
    }
    else {
        result[emptyBoxes[box].i][emptyBoxes[box].j] = 4
    }
}

const resultMap = () => {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            if (result[i][j] !== 0) {
                nodeMatrix[i][j].setAttribute('class', 'item')
                nodeMatrix[i][j].innerText = result[i][j]
                nodeMatrix[i][j].classList.add("num" + result[i][j])
            }
            else {
                nodeMatrix[i][j].innerText = ""
                nodeMatrix[i][j].setAttribute('class', 'item')

            }
        }
    }
}

const moveLeft = () => {
    let initialResult = []
    for (let i = 0; i < width; i++) {
        let row = []
        for (let j = 0; j < width; j++) {
            if (result[i][j] != 0) {
                if (row.length && row[row.length - 1] === result[i][j]) {
                    row[row.length - 1] += result[i][j]
                    score += row[row.length - 1]
                    if (bestScore < score)
                        bestScore = score
                }
                else
                    row.push(result[i][j])
            }
        }
        while (row.length < 4) row.push(0)
        initialResult.push(row)
    }
    result = initialResult
}

const gameOver = () => {
    container.classList.add('opacity')
    gameOverBtn.classList.add("game-over")
    flagGameOver = 1
}



(() => {
    if (!getData(enums.bestScore)) {
        setData(enums.bestScore, bestScore)
    }
    if (!getData(enums.gameState)) {
        setData(enums.gameState, emptyResult)
    }
    if (!getData(enums.liveScore)) {
        setData(enums.liveScore, score)
    }
    score = getData(enums.liveScore)
    bestScore = getData(enums.bestScore)
    result = [...getData(enums.gameState)]
    liveScore.innerText = score
    bestScoreBtn.innerText = bestScore
    createBox()
    if (result.flat(1).filter(item => item !== 0).length === 0)
        generate()
    resultMap()
})()



document.addEventListener('keydown', (e) => {
    e.preventDefault()
    if (flagGameOver === 1)
        return
    const resultCopy = [...result]
    switch (e.key) {
        case "ArrowLeft":
            moveLeft()
            break
        case "ArrowRight":
            rotate(2)
            moveLeft()
            rotate(2)
            break
        case "ArrowUp":
            rotate(3)
            moveLeft()
            rotate(1)
            break
        case "ArrowDown":
            rotate(1)
            moveLeft()
            rotate(3)
            break
    }
    const isValidMove = JSON.stringify(result) !== JSON.stringify(resultCopy)
    if (!isValidMove && result.flat(1).filter(item => item === 0).length === 0)
    {
        gameOver()
        return
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key) && isValidMove) {
        generate()
        setData(enums.gameState, result)
        setData(enums.liveScore, score)
        setData(enums.bestScore, bestScore)
        liveScore.innerText = score
        bestScoreBtn.innerText = bestScore
        resultMap()
    }
}
)

newGame.addEventListener("click", () => {
    container.classList.remove('opacity')
    gameOverBtn.classList.remove('game-over')
    localStorage.removeItem(enums.gameState)
    localStorage.removeItem(enums.liveScore)
    score = 0
    liveScore.innerText = 0
    result = emptyResult
    generate()
    resultMap()
})



