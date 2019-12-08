import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import moment from "moment";

const DonationHistory = props => {
  let perPage = 1;
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchJson = async url => {
    const json = await fetch(url).then(response => response.json());
    return json;
  };

  const loadNewPage = async pageNumber => {
    setLoading(true);
    const response = await fetchJson(
      `http://localhost:3001/donors/${props.userId}/donations?page=${pageNumber}&perPage=${perPage}`
      /*sample: /donors/1/donations?page=3&perPage=12*/
    );
    setTotalItems(2);
    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const response = await fetchJson(
        `http://localhost:3001/donors/${props.userId}/donations?page=1&perPage=${perPage}`
      );
      /* data: Array, page: 1, per_page: 6, total: 12, total_pages: 2*/
      setTotalItems(2);
      setData(response.data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const paginate = pageNumber => {
    loadNewPage(pageNumber);
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-5">
      {loading ? (
        <p>Loading</p>
      ) : (
        <>
          <DonationHistoryTable
            donations={data}
            loading={loading}
            totalItems={totalItems}
          />
          <Pagination
            perPage={perPage}
            totalItems={totalItems}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

const DonationHistoryTable = ({ donations, loading, totalItems }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  const rows = donations.map(donation => (
    <tr key={donation.id}>
      <td>{moment(donation.donationDate).format("Do MMMM YYYY")}</td>
      <td>${donation.amount.slice(0, -2)}</td>
      <td>{donation.Campaign.type}</td>
      <td>{donation.Source.name}</td>
    </tr>
  ));

  return (
    <>
      <h2>Donation history</h2>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Date of Donation</th>
            <th>Amount</th>
            <th>Campaign</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>{donations ? rows : <td>Loading</td>}</tbody>
      </Table>
      <small className="float-right text-muted">
        Showing {donations.length} out of {totalItems} items
      </small>
    </>
  );
};

const Pagination = ({ perPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / perPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <ul className="pagination">
        <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <button
            class="page-link"
            aria-label="Previous"
            onClick={() => paginate(--currentPage)}
          >
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </button>
        </li>
        {pageNumbers.map(number => (
          <li
            key={number}
            className={
              currentPage === number ? "page-item active" : "page-item"
            }
          >
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        <li
          className={
            currentPage === pageNumbers.length
              ? "page-item disabled"
              : "page-item"
          }
        >
          <button
            class="page-link"
            aria-label="Next"
            onClick={() => paginate(++currentPage)}
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DonationHistory;
