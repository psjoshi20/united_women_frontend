import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'

const DonationHistory = () => {
    let totalItems = 0
    let totalPages = 0
    const [currentPage, setCurrentPage] = useState(1)
    const [data, setData] = useState([])
    const [json, setJson] = useState({})
    const [loading, setLoading] = useState(false)

    const fetchJson = async (url) => {
      const json = await fetch(url).then(response => response.json())
      return json
    }

    const loadNewPage = async (pageNumber) => {
      setLoading(true)
      const response = await fetchJson(`https://reqres.in/api/users?page=${pageNumber}`)
      setJson(response)
      setData(response.data)
      setLoading(false)
    }

    useEffect(() => {
      const fetchPosts = async () => {
        setLoading(true)
        const response = await fetchJson("https://reqres.in/api/users?page=1")
        /* data: Array, page: 1, per_page: 6, total: 12, total_pages: 2*/
        setJson(response)
        setData(response.data)
        setLoading(false)
      }
      fetchPosts()
    }, [])


    totalItems = json.total
    totalPages = json.total_pages

    let perPage = totalItems / totalPages

    const paginate = (pageNumber) => {
      loadNewPage(pageNumber)
      setCurrentPage(pageNumber)
    }

    return (
      <div className="mt-5">
        { loading ? <p>Loading</p> :
        <>
        <DonationHistoryTable users={data} loading={loading} totalItems={totalItems} currentPage={currentPage}/>
        <Pagination perPage={perPage} totalItems={totalItems} paginate={paginate} currentPage={currentPage}/>
        </> }
    </div>
    );
}

const DonationHistoryTable =({ users, loading, totalItems}) => {
    if(loading) {
        return <h2>Loading...</h2>
    }
    return (
        <>
        <h2>Donation history</h2>
        <Table striped hover responsive>
            <thead>
                <tr>
                    <th>Date of Donation</th>
                    <th>Amount</th>
                    <th>Source</th>
                </tr>
            </thead>
            <tbody>
            {users.map(user=>(
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                </tr>
            ))}
            </tbody>
        </Table>
        <small className="float-right text-muted">Showing {users.length} out of {totalItems} items</small>
        </>
    )
}

const Pagination = ({ perPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = []
    for(let i = 1; i <= Math.ceil(totalItems / perPage); i++) {
        pageNumbers.push(i)
    }
    return (
        <nav>
            <ul className="pagination">
                <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
                    <a class="page-link" href="#" aria-label="Previous" onClick={() => paginate(--currentPage)}>
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </a>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={currentPage === number ? "page-item active" : "page-item"}>
                        <a onClick={() => paginate(number)}
                            className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
                <li className={currentPage === pageNumbers.length ? "page-item disabled" : "page-item"}>
                    <a class="page-link" href="#" aria-label="Next" onClick={() => paginate(++currentPage)}>
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default DonationHistory