export default function SwitchAround(array, fromIndex, toIndex) {
    const questionToMove = array[fromIndex]
    const questionToShove = array[toIndex]

    if (fromIndex > toIndex && fromIndex !== 0) {
        return [
            ...array.slice(0, toIndex),
            questionToMove,
            questionToShove,
            ...array.slice(fromIndex + 1)
        ]
    } else if (fromIndex < toIndex && toIndex < array.length) {
        return [
            ...array.slice(0, fromIndex),
            questionToShove,
            questionToMove,
            ...array.slice(toIndex + 1)
        ]
    } else {
        return array
    }
}