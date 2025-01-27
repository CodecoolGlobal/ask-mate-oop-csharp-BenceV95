import { useEffect, useState } from "react";




export default function PaginatedUsers({users}) {
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
            const response = await fetch(`http://localhost:5166/User/paginate?pageNumber=${page}&limit=${ITEMS_PER_PAGE}`);
            const parsedData = await response.json();
            setData(parsedData.users);
            setTotalPages(Math.ceil(parsedData.totalCount/5));
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
                <ul>
                    {data.map((item) => (
                        <li key={item.id}>{item.username} <br />{item.email}</li>
                    ))}
                </ul>
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
        <div>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};
