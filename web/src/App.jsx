import { useState, useEffect } from "react";
import "./styles/index.scss";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    const param = new URLSearchParams({
      query: searchQuery,
    });

    if (searchQuery !== "") {
      fetch(`/search?${param}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
          setPageNumber(0);

          setTotalPages(Math.ceil(data.length / resultsPerPage));
        });
    }
  }, [searchQuery]);

  function updateLocalStorage(storageName, newItem, maxItems) {
    let originalArray = JSON.parse(localStorage.getItem(storageName));

    originalArray = !!originalArray ? [newItem, ...originalArray] : [newItem];
    if (originalArray.length > maxItems) {
      originalArray.pop();
    }

    localStorage.setItem(storageName, JSON.stringify(originalArray));
  }

  function triggerSearch(event) {
    setSearchQuery(event.target.value);
    updateLocalStorage("searchHistory", event.target.value, 5);
  }

  return (
    <main>
      <input
        data-testid="search-input"
        placeholder="Enter your search term"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            triggerSearch(event);
          }
        }}
        onBlur={(event) => {
          triggerSearch(event);
        }}
      />
      <div
        data-testid="search-result-container"
        className="search-result-container"
      >
        {results &&
          results.length > 0 &&
          searchQuery !== "" &&
          results
            .slice(
              pageNumber * resultsPerPage,
              pageNumber * resultsPerPage + resultsPerPage
            )
            .map((item) => (
              <div
                data-testid={`search-result-${item.slug}`}
                key={item.url}
                className="search-result"
              >
                {item.title}
              </div>
            ))}
      </div>
      <div className="box-container">
        <>
          <button
            data-testid="previous-button"
            disabled={pageNumber === 0}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Previous Page
          </button>
          <button
            data-testid="next-button"
            disabled={
              pageNumber === totalPages - 1 ||
              totalPages === 1 ||
              searchQuery === ""
            }
            onClick={() => {
              setPageNumber(pageNumber + 1);
            }}
          >
            Next Page
          </button>
        </>
      </div>
    </main>
  );
}

export default App;
