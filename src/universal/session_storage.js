function SaveToSession(name, item) {
    sessionStorage.setItem(name, item)
}

function GetFromSession(name) {
    const data = sessionStorage.getItem(name)
    return(data)
}

function RemoveFromSession(name) {
    sessionStorage.removeItem(name)
}



export {SaveToSession, GetFromSession, RemoveFromSession}