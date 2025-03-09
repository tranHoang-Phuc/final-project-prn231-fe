import React from 'react'
import MenuNavigate from '../components/MenuNavigate'
import TagView from '../components/TagView'

export default function Tags() {
  return (
    <>
      {/* <MenuNavigate /> */}
      <TagView tagName="javascript" numberOfQuestions={826} askedThisWeek={12} />
    </>
  )
}
