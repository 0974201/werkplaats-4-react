function saveToDB(array, path) {
    fetch('http://localhost:81/' + path, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(array)
    })
}

export {saveToDB}