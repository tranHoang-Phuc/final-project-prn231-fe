import React from 'react'
import MenuNavigate from '../components/MenuNavigate'
import Authenticate from '../components/Authenticate'
  import Question from '../components/Question'
import QuestionList from '../components/QuestionList'

export default function Home() {
  return (
    <>
      <MenuNavigate />
      <QuestionList 
      title="Recently Active Questions" 
      numOfQuestions="24,249,156" />
    </>
  )
}
