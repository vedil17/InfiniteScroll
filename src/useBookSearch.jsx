import axios from 'axios'
import React, { useEffect, useState } from 'react'

function useBookSearch(query,pageNumber) {
    const [loading,setLoding] = useState(true)
    const [error,setError] = useState(false)
    const [books,setBooks] = useState([])
    const [hasMore,setHasMore] = useState(false)

    useEffect(() => {
        setBooks([])
    },[query])
    
    useEffect(() => {
        setLoding(true)
        setError(false)
        let cancel
        axios({
            method: 'Get',
            url: 'http://openlibrary.org/search.json',
            params: {q:query, page:pageNumber},
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setBooks(prevBooks => {
                return [...new Set([...prevBooks,...res.data.docs.map(b => b.title)])]
            })
            setHasMore(res.data.docs.length > 0)
            setLoding(false)
        }).catch(e => {
            if(axios.isCancel(e)) return
            setError(true)
        })

        return () => cancel()
    },[query,pageNumber])
  
    return {loading,error,hasMore,books}
}

export default useBookSearch