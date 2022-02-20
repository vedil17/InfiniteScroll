import { useCallback, useRef, useState } from "react";
import useBookSearch from "./useBookSearch";


function App() {

  const [query,setQuery] = useState('');
  const [pageNumber,setPageNumber] = useState(1);
  
  const {
    loading,
    error,
    hasMore,
    books
  } = useBookSearch(query,pageNumber)

  const observer = useRef()
  const lastBookElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  },[loading,hasMore])

  function handleChange(e){
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <div>
      <input type="text" value={query} onChange={handleChange}/>
      {books.map((book, index) => {
        if(books.length === index + 1) return <div ref={lastBookElementRef} key={book}>{book}</div>
        else return <div key={book}>{book}</div>
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}

export default App;
