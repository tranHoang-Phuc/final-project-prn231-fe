import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function TagView({tagName, numberOfQuestions, askedThisWeek}) {
  const navigate = useNavigate()
  return (
    <>
      <div className='max-w-xs border border-gray-300  rounded-md p-2 mt-2 mr-2 mb-2'>
        <div onClick={() => navigate(`/questions/tagged/${tagName}`)} className='bg-gray-200 hover:bg-gray-300 p-1 rounded-md w-fit cursor-pointer'>
          <h6 className=' font-medium'>{tagName}</h6>
        </div>
        <div className='flex justify-between items-center gap-2 mt-8'>
          <div className='text-gray-500'>{numberOfQuestions} questions</div>
          <div className='text-gray-500' >{askedThisWeek} asked this week</div>
        </div>      
      </div>
    </>
  )
}
