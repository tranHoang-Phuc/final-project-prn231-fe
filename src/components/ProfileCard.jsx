import React from 'react'
import { useNavigate } from 'react-router'

export default function ProfileCard({userProfile}) {
  const navigate = useNavigate();
  return (
    <>
      <div className='flex'>
        <img width={50} height={50} src={userProfile.profileImage} alt="" />
        <div className='ml-3'>
          <div className='cursor-pointer'
            onClick={() => navigate(`/profile/${userProfile.aliasName}`)}
          >{userProfile.displayName}</div>
          <div className='text-gray-500'>{userProfile.aliasName}</div>
        </div>
      </div>
    </>
  )
}
