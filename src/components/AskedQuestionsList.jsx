import React from 'react'
import AskedQuestionCard from './AskedQuestionCard'

export default function AskedQuestionsList({questions}) {
  return (
    <>
    <div className='mt-3 text-4xl'>{questions.length} questions</div>
    <div className="border border-gray-200 mt-3 w-full">
    {questions.map((question) => (
      <AskedQuestionCard key={question.id} question={question} />
    ))}
   
    </div>
    
    </>
  )
}
