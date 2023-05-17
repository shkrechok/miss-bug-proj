import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function BugIndex() {

    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])


    function loadBugs() {
        bugService.query(filterBy).then(bugs => setBugs(bugs))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, ...filterBy }))
    }


    return (
        <main>
            <h3>Bugs App</h3>
            <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
            <main>
                <Link to="/bug/edit/">Add Bug</Link>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
            </main>
        </main>
    )


}
