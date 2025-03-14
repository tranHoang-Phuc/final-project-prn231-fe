import React from "react";
import MenuNavigate from "../components/MenuNavigate";
import TagView from "../components/TagView";
import { useState } from "react";
import TagInput from "../components/TagInput";

export default function Tags() {
  const [tags, setTags] = useState([]);
  return (
    <>
      <MenuNavigate />
      <div className="border-b border-gray-300 rounded-lg max-w-5xl mx-auto bg-white p-5">
        <TagInput setTags={setTags} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {Array.isArray(tags) &&
            tags.map((tag, index) => (
              <TagView
                key={tag.tagName || index}
                tagName={tag.tagName}
                numberOfQuestions={tag.numberOfQuestions}
                askedThisWeek={tag.askedThisWeek}
              />
            ))}
        </div>
      </div>
    </>
  );
}
