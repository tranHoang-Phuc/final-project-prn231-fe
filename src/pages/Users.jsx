import React, { useEffect, useState } from "react";
import MenuNavigate from "../components/MenuNavigate";
import ProfileCard from "../components/ProfileCard";
import { getToken } from "../services/localStorageService";
import axios from "axios";
import { BaseUrl } from "../configurations/config";
import TagPagination from "../components/TagPagination";

export default function Users() {
  const [userProfiles, setUserProfiles] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setKeyword(inputValue);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);
  const token = getToken();

  useEffect(() => {
    axios
      .get(`${BaseUrl.uri}/profile/Authors?pageIndex=${currentPage}&aliasName=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserProfiles(response.data.data.data);
        setCurrentPage(response.data.data.pageIndex);
        setTotalPages(response.data.data.totalPage);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentPage, keyword]);
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <>
      <MenuNavigate />
      <div className="max-w-4xl mx-auto bg-white p-5">
        <div className="font-normal text-3xl">Users</div>
        <div className="mt-3">
          <input  
            type="text"
            placeholder="Filter by alias name"
            value={inputValue}
            onChange={handleChange}
            className=" pl-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-5 flex flex-wrap gap-6">
        {userProfiles &&
          userProfiles.map((userProfile) => (
            <ProfileCard key={userProfile.id} userProfile={userProfile} />
          ))}
      </div>
      <TagPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
