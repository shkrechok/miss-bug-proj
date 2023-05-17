const express = require('express')
const app = express()
const http = require('http')
const bugService = require('./services/bug.service')
const userService = require('./services/user.service')
const cookieParser = require('cookie-parser')
// const axios = require('axios')



app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// app.get('/', (req, res) => res.send('Hello!'))

app.get('/api/bug', (req, res) => {
    const { txt, severity, sortBy, isAsc } = req.query
    const filterBy = { txt, severity, sortBy, isAsc }
    bugService.query(filterBy).then(bugs => res.send(bugs))
})

//Add a new bug
app.post('/api/bug/save', (req, res) => {
    // const { title, severity, description } = req.body
    const bug = req.body//{title, severity: +severity, description }
    bugService.save(bug).then(savedBug => res.send(savedBug))
})


//Get an existing bug
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    // let visitedBugsIds = req.cookies.visitedBugsIds || []
    // if (!visitedBugsIds.includes(bugId)) visitedBugsIds.push(bugId)
    // if (visitedBugsIds.length > 3) return res.status(403).send('You can only visit 3 bugs per session')
    bugService.getById(bugId).then(bug =>{ 
        res.send(bug)})
        // res.cookie('visitedBugsIds', visitedBugsIds)})
        .catch(err => res.status(403).send(err))
})

app.delete('/api/bug/:bugId', (req, res) => { 
    const { bugId } = req.params
    
    bugService.remove(bugId).then((msg) => res.send(msg))
        .catch(err => res.status(403).send(err))
})

// user routes

app.get('/api/user', (req, res) => {
    userService.query().then(user => {
        res.send(user)
    })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            const token = userService.getLoginToken(user)
            res.cookie('loginToken', token)
            console.log('login successful')
            res.send(user)
        })
        .catch(err => {
            console.log('login failed', err)
            res.status(401).send(`Login failed, ${err}`)
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    const username = credentials.username
    userService.checkUserName(username).then(() => {
    userService.save(credentials)
        .then(user => {
            const token = userService.getLoginToken(user)
            res.cookie('loginToken', token)
            console.log('signup successful')
            res.send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(401).send(`Signup failed, ${err}`)
        })
    })
    .catch(err => {
        console.log(err)
        res.status(401).send(`Signup failed, ${err}`)
    })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.listen(3030, () => console.log('Server ready at port 3030!'))
