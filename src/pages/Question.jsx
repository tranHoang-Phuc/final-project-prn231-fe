import React from 'react'
import { useParams } from 'react-router-dom'
import MenuNavigate from '../components/MenuNavigate'
import axios from 'axios'
import { BaseUrl } from '../configurations/config'
import { useEffect, useState } from 'react'
import QuestionDetail from '../components/QuestionDetail'
import { getToken } from '../services/localStorageService'
export default function Question() {
  const token = getToken();
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  useEffect(() => {
    axios.get(`${BaseUrl.uri}/question/${id}`
      ,{headers: {Authorization: `Bearer ${token}`}}
    )
    .then((response) => {
      console.log(response.data.data)
      setQuestion(response.data.data) 
    })
  }, [])
  
  return (
    <>
      <MenuNavigate />
      {question && <QuestionDetail id={question.id}
        title={question.title}
        createdAt={question.createdAt}
        updatedAt={question.updatedAt}
        views={question.views}
        votes={question.questionVotes}
        problem={question.detailProblem}
        expect={question.expecting}
        tags={question.questionTags}
        createdUser={question.createdUser}
        answers={question.answers} />}
    </>
  )
}
