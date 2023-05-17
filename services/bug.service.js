const fs = require('fs');
var bugs = require('../data/bugs.json');


module.exports = {
    query,
    getById,
    remove,
    save
}

function query(filterBy = {}) {
    console.log(`query filterBy:`, filterBy)
    let bugsToReturn = bugs
    if (filterBy.txt) {
        bugsToReturn = bugsToReturn.filter(bug => bug.title.includes(filterBy.txt))
    }
    if (filterBy.severity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity === filterBy.severity)
    }
    if (filterBy.sortBy) {
        bugsToReturn.sort((bug1, bug2) => {
          if (filterBy.sortBy === "title") {
            if (filterBy.isAsc) {
              return bug1.title.localeCompare(bug2.title)
            } else {
              return bug2.title.localeCompare(bug1.title)
            }
          } else if (filterBy.sortBy === "severity") {
            if (filterBy.isAsc) {
              return bug1.severity - bug2.severity
            } else {
              return bug2.severity - bug1.severity
            }
          } else if (filterBy.sortBy === "createdAt") {
            const timestamp1 = bug1.createdAt
            const timestamp2 = bug2.createdAt
            if (filterBy.isAsc) {
              return timestamp1 - timestamp2
            } else {
              return timestamp2 - timestamp1
            }
          } else {
            return 0
          }
        })
      }
      
    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    console.log('remove bugId:', bugId)
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('No bug found!')
    return Promise.resolve(bug)
}

function remove(bugId) {
    console.log('remove bugId:', bugId)
    bugs = bugs.filter(bug => bug._id !== bugId)
    return _saveBugsToFile()
}

// why do we need post and put if save does both?
// here we control which fields are allowed to be updated
function save(bug) {
    console.log('save bug:', bug)
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        bugToUpdate.title = bug.title
        bugToUpdate.severity = bug.severity
        bugToUpdate.description = bug.description
        if (!bugToUpdate) return Promise.reject('No bug found!')

    } else {
        bug._id = _makeId()
        bug.createdAt = Date.now()
        bugs.push(bug)
    }
    return _saveBugsToFile().then(() => bug).catch(err => console.log('err on saveToFile:', err))
}

function _makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {

        fs.writeFile('data/bugs.json', JSON.stringify(bugs, null, 2), (err) => {
            if (err) {
                console.log('err:', err)
                reject(err)
            } else {
                console.log('Changes saved to file!')
                resolve()
            }
        })
    })
}