import React, { useContext } from 'react'
import MenuNavigate from '../components/MenuNavigate'
import Authenticate from '../components/Authenticate'
  import Question from '../components/Question'
import QuestionList from '../components/QuestionList'
import { DataContext } from '../components/DataProvider'

export default function Home() {
  const {sharedData, searchString} = useContext(DataContext);
  console.log(sharedData);
  return (
    <>
      <MenuNavigate />
      <QuestionList 
      title="Recently Active Questions" 
      numOfQuestions="24,249,156"
      questionsList={sharedData}     
      searchString ={searchString}
      />

    </>
  )
}
