
import {storageService} from './async-storage.service.js'
import {utilService} from './util.service.js'
// import {axios} from '../lib/axios.js'

const STORAGE_KEY = 'bugDB'
const BUGS_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyBug,
    getDefaultFilter
}


function query(filterBy = {}) {
    console.log(`query filterBy:`, filterBy)
    const filterQueryParams = `?txt=${filterBy.txt}&severity=${filterBy.severity}&sortBy=${filterBy.sortBy}&isAsc=${filterBy.isAsc}`
    return axios.get(BUGS_URL + filterQueryParams).then(res => res.data)
    
}
function getById(bugId) {
    console.log('get bugId:', bugId)
    return axios.get(`${BUGS_URL}/${bugId}`).then(res => res.data)

}
function remove(bugId) {
    console.log('remove bugId:', bugId)
    return axios.delete(`${BUGS_URL}/${bugId}`).then(res => res.data)
}
function save(bug) {
    console.log('save bug:', bug)
    // if (bug._id) {
    //     return storageService.put(STORAGE_KEY, bug)
    // } else {
    //     return storageService.post(STORAGE_KEY, bug)
    // }

    // let queryParams = `?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`
    // if (bug._id) queryParams += `&_id=${bug._id}`
    return axios.post(`${BUGS_URL}/save`,bug).then(res => res.data)

}

function getEmptyBug() {
    return {    
        title: '',
        description: '',
        severity: '',
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        severity: '',
        sortBy: 'title',
        isAsc: true
    }
}
