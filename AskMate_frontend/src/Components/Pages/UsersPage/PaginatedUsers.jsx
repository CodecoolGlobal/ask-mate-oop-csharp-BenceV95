import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import "./PaginatedUsers.css";




export default function PaginatedUsers({ users }) {
    const [data, setData] = useState([]); // Store the fetched data
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const ITEMS_PER_PAGE = 5;


    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);




    const fetchData = async (page) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/User/paginate?pageNumber=${page}&limit=${ITEMS_PER_PAGE}`);
            const parsedData = await response.json();
            setData(parsedData.users);
            setTotalPages(Math.ceil(parsedData.totalCount / 5));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };




    return (
        <div>
            <h1>Paginated List</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="userCards">
                    {
                        data.map(user => <UserCard key={user.id} user={user} />)
                    }
                </div>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [...Array(totalPages).keys()].map((n) => n + 1);

    return (
        <div className="pageButtons">
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={page === currentPage ? "btn btn-success" : "btn btn-warning"}
                    disabled={page === currentPage}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};
