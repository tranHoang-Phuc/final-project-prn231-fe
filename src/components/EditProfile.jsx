import React from 'react'

export default function EditProfile({user}) {
  return (
    <div className="mt-3 mx-auto bg-white shadow-md rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-4">Public information</h2>

      {/* Profile Image */}
      <div className="mb-4">
        <p className="font-medium">Profile image</p>
        <div className="flex flex-col items-center mt-2">
          <img
            src={user.profileImage} // Thay ảnh profile tại đây
            alt="Profile"
            className="w-24 h-24 rounded-lg border border-gray-300"
          />
          <button className="mt-2 bg-gray-700 text-white px-3 py-1 text-sm rounded-md hover:bg-gray-800">
            Change picture
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block  font-medium">Display name</label>
        <input
          type="text"
          className="w-3/5 border border-gray-500 rounded-md p-2 mt-1  "
          value={user.displayName} // Thay tên hiển thị tại đây
        />
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block  font-medium">Location</label>
        <input
          type="text"
          className="w-3/5 border-gray-500 border rounded-md p-2 mt-1 "
          value={user.location} // Thay địa chỉ tại đây
        />
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block  border-gray-500 font-medium">Title</label>
        <input
          type="text"
          className="w-3/5  border border-gray-500 rounded-md p-2 mt-1 "
          value={user.title} 
          placeholder='No title has been set'
      />
      </div>

      {/* About Me */}
      <div>
        <label className="block text-gray-700 font-medium">About me</label>
        <div className="border rounded-md mt-1">
          {/* Fake Toolbar */}
          <div className="flex items-center gap-2 border-b p-2 bg-gray-100">
            <button className="p-1 text-gray-600 hover:text-black">
              <b>B</b>
            </button>
            <button className="p-1 text-gray-600 hover:text-black">
              <i>I</i>
            </button>
            <button className="p-1 text-gray-600 hover:text-black">🔗</button>
            <button className="p-1 text-gray-600 hover:text-black">🖼</button>
            <button className="p-1 text-gray-600 hover:text-black">🔊</button>
            <button className="p-1 text-gray-600 hover:text-black">↩</button>
            <button className="p-1 text-gray-600 hover:text-black">↪</button>
          </div>
          {/* Textarea */}
          <textarea
            className="w-full h-24 p-2 border-none focus:ring focus:ring-gray-300"
            placeholder=""
          ></textarea>
        </div>
      </div>
    </div>
  )
}
