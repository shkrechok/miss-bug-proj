const {useEffect, useState} = React
const {useNavigate, useParams} = ReactRouterDOM

import {bugService} from '../services/bug.service.js'
import {showErrorMsg} from '../services/event-bus.service.js'

export function BugEdit() {

    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (params.bugId) {
            bugService.getById(params.bugId)
                .then(bug => {
                    setBugToEdit(bug)
                })
                .catch(err => {
                    showErrorMsg('Cannot load bug')
                })
        }
    }, [])

    function handleChange({target}) {
        const field = target.name
        const value = target.type === 'number' ? +target.value : target.value
        setBugToEdit(prevBugToEdit => ({...prevBugToEdit, [field]: value}))
    }

    function onSaveBug(ev) {
        ev.preventDefault()
        bugService.save(bugToEdit)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                navigate('/bug')
            })
    }

//    const {title, description, severity} = bugToEdit
    return (
         <section className="bug-edit">
            <h3>{params.bugId ? 'Edit' : 'Add'} Bug</h3>
            <form onSubmit={onSaveBug}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={bugToEdit.title} onChange={handleChange} />
                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" value={bugToEdit.description} onChange={handleChange} />
                <label htmlFor="severity">Severity</label>
                <input type="number" id="severity" name="severity" value={bugToEdit.severity} onChange={handleChange} />
                <button>{params.bugId ? 'Save' : 'Add'}</button>
            </form>
        </section>
    )
}