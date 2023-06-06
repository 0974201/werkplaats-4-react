export default function getCurrentDate() {
    // copied from https://www.freecodecamp.org/news/javascript-get-current-date-todays-date-in-js/
    const date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${year}-${month}-${day}`
    console.log(currentDate)
    return currentDate
}