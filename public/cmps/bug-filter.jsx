import { bugService } from "../services/bug.service"

const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value : target.value
        setFilterByToEdit(prevFilterByToEdit => ({ ...prevFilterByToEdit, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    return (
        <section className="bug-filter-sort">
            Sort by:
            <select name="sortBy" id="sortBy" value={filterByToEdit.sortBy} onChange={handleChange}>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Created At</option>
            </select>
            Filter by:
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Title:</label>
                <input type="text" id="txt" name="txt" value={filterByToEdit.txt} onChange={handleChange} />
                <label htmlFor="severity">Severity:</label>
                <select name="severity" id="severity" value={filterByToEdit.severity} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Medium</option>
                    <option value="3">3 - High</option>
                </select>
                <button>Submit</button>
                </form>
        </section>
    )
}