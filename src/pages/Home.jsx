import React, { useContext } from "react";
import MenuNavigate from "../components/MenuNavigate";
import QuestionList from "../components/QuestionList";
import { DataContext } from "../components/DataProvider";
import SSEClient from "../hooks/SSEClient";

export default function Home() {
  
  const { sharedData, searchString } = useContext(DataContext);
  return (
    <>
      <MenuNavigate />
      {/* <SSEClient /> */}

      <QuestionList
        title="Recently Active Questions"
        numOfQuestions="24,249,156"
        questionsList={sharedData}
        searchString={searchString}
      />
      
    </>
  );
}
