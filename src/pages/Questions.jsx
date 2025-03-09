import React from "react";
import MenuNavigate from "../components/MenuNavigate";

import QuestionList from "../components/QuestionList";
import { useParams } from "react-router";
export default function Questions() {
  const {tagged, tagName} = useParams();
  return (
    <>
      <MenuNavigate />
      {/* <QuestionDetail
        title="Capture SRI check failed error using jQuery"
        createdAt="Today"
        updatedAt="Today"
        views="3 times"
        votes={0}
        problem={`<p>I have added SRI hashes to many scripts on my page. I want to trigger a function any time SRI check fails using an event listener. I tried using window onerror function but SRI failure is not tiggering window onerror function. I get the following error in the console when SRI check fails.</p><p>"Failed to find a valid digest in the 'integrity' attribute for resource&nbsp;<a href="https://example.com/somescript.js" rel="noopener noreferrer" target="_blank">https://example.com/somescript.js</a>&nbsp;with computed SHA-384 integrity hash. The resource has been blocked."</p><p>Following is what I am trying to do.</p><pre class="ql-syntax" spellcheck="false">&lt;script&gt;    
$(window).on("error", function (event) {
        alert("error");
        if (event.message &amp;&amp; event.message.includes("Failed to find a valid digest in the")) {
            reportSriError(event);
        }
    });
&lt;/script&gt;
</pre><p><br></p>`}
        expect={`<p>But the function window onerror does not get fired. How do I get it to fire so I can call reportSriError function?</p>`}
        tags={[
          { tagName: "javascript" },
          { tagName: "jquery" },
          { tagName: "sri" },
        ]}
        createdUser={{
          id: "c6384cf9-09c3-4e23-a4af-ba5c8947be99",
          displayName: "Phuc Tran Hoang",
          location: null,
          title: null,
          aboutMe: null,
          profileImage:
            "https://lh3.googleusercontent.com/a/ACg8ocKLnVlgSU4UIXOhK8ziZC5GfuQBgk4YM6U7d9kgOlLE9bkjyNM=s96-c",
          email: "hoangphuc7bdtd@gmail.com",
        }}
        answers={[
          "", "", ""
         ]}
      />
      <AnswerInput /> */}
      <QuestionList tagName={tagName} />
    </>
  );
}
