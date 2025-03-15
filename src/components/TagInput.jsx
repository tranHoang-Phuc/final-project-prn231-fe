import React, { use, useEffect, useState } from 'react'
import { Search } from "lucide-react";
import axios from 'axios';
import { BaseUrl } from '../configurations/config';

export default function TagInput({setTags, currentPage, setTotalPages, perPage}) {

  const [keyword, setKeyword] = useState('');


  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setKeyword(inputValue);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);


  useEffect(() => {
    axios
      .get(`${BaseUrl.uri}/tag?keyword=${keyword}&pageIndex=${currentPage}`)
      .then((res) => {
        setTags(res.data.data.tags);
        setTotalPages(res.data.data.totalPage);
      })
  }, [keyword, currentPage, perPage]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <h3 className='text-4xl font-thin '>Tags</h3>
      <p className='text-gray-600 w-3/4 mt-6' >
      A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.
      </p>
      <div className="mt-4 relative w-full max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Filter by tag name"
          value={inputValue}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>
    </>
  )
}
