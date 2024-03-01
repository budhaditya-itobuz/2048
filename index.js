import { getData, setData, enums } from "./helper.js"

const container = document.getElementById("container")
const newGameBtn = document.getElementById("new-game")
const liveScore = document.getElementById("live-score")
const bestScoreBtn = document.getElementById('best-score')
const gameOverBtn = document.getElementById('game-over')

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

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
    const resultCopy = []
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            if (result[i][j] === 0)
                resultCopy.push({ i: i, j: j })
        }
    }
    if (resultCopy.length === 0) {
        gameOver()
        return
    }
    const box = Math.floor(Math.random() * resultCopy.length)
    const number = Math.floor(Math.random() * 2)
    if (number === 1) {
        result[resultCopy[box].i][resultCopy[box].j] = 2
    }
    else {
        result[resultCopy[box].i][resultCopy[box].j] = 4
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

const checkGameOver = () => {
    const iterate=(arr)=>{
        for(let i=0;i<arr.length;i++)
        {
            for(let j=0;j<arr.length-1;j++)
            {
                if(arr[i][j]===arr[i][j+1])
                return false
            }
        }
        return true
    }

    const demoArr = [...result.map(arr => [...arr])]
    const demoArrRotate = demoArr[0].map((val, index) => demoArr.map(row => row[index]).reverse())
    console.log(demoArr)
    console.log(demoArrRotate)
    return iterate(demoArr) && iterate(demoArrRotate)
}

const gameOver = () => {
    container.classList.add('opacity')
    gameOverBtn.classList.add("game-over")
    flagGameOver = 1
    localStorage.removeItem(3)
    localStorage.removeItem(2)
}
const newGame = () => {
    container.classList.remove('opacity')
    gameOverBtn.classList.remove('game-over')
    localStorage.removeItem(enums.gameState)
    localStorage.removeItem(enums.liveScore)
    score = 0
    liveScore.innerText = 0
    result = [...emptyResult.map(arr => [...arr])]
    console.log(result)
    generate()
    resultMap()
}


const play = (key) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key))
        return

    if (flagGameOver === 1) {
        newGame()
        flagGameOver = 0
        return
    }
    const resultCopy = [...result.map(arr => [...arr])]
    switch (key) {
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

    const isValidMove = !(JSON.stringify(result) === JSON.stringify(resultCopy))
    console.log(checkGameOver())
    if(checkGameOver())
    gameOver()
    if (isValidMove) {
        generate()
        if (flagGameOver === 1)
            return
        setData(enums.gameState, result)
        setData(enums.liveScore, score)
        setData(enums.bestScore, bestScore)
        liveScore.innerText = score
        bestScoreBtn.innerText = bestScore
        resultMap()
    }
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

const touchEvaluate = () => {
    console.log(touchstartX, touchstartY, touchendX, touchendY)

    if (Math.abs(touchendY - touchstartX) > Math.abs(touchendX - touchstartX)) {
        if (touchstartY > touchendY)
            play("ArrowUp")
        else
            play("ArrowDown")
    }
    else {
        if (touchendX > touchstartX)
            play("ArrowLeft")
        else
            play("Arrowright")
    }
}

// document.addEventListener('touchstart', (event) => {
//     event.preventDefault()
//     const touchObject = event.changedTouches[0]
//     touchstartX = touchObject.screenX
//     touchstartY = touchObject.screenY
// })

// document.addEventListener('touchend', (event) => {
//     event.preventDefault()
//     const touchObject = event.changedTouches[0]
//     touchendX = touchObject.screenX
//     touchendY = touchObject.screenY
//     touchEvaluate()
// })

document.addEventListener('keydown', (e) => {
    e.preventDefault()
    play(e.key)
}
)


newGameBtn.addEventListener("click", () => {
    newGame()
})