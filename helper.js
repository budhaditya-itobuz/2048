export const getData = (str) => JSON.parse(localStorage.getItem(str))

export const setData = (str, data) => localStorage.setItem(str, JSON.stringify(data))

export const enums = Object.freeze({
    liveScore:1,
    bestScore:2,
    gameState:3
})