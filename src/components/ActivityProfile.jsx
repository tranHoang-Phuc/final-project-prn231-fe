import React, { useEffect, useState } from "react";
import AskedQuestionsList from "./AskedQuestionsList";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { BaseUrl } from "../configurations/config";
import { getToken } from "../services/localStorageService";

export default function ActivityProfile() {
  const navigate = useNavigate();
  const token  = getToken();
  const [menu, setMenu] = useState("asked");
  const [questions, setQuestions] = useState(null);

  const { alias } = useParams();
  useEffect(() => {
    if (menu === "asked") {
      if (alias) {
        axios
          .get(`${BaseUrl.uri}/question/asked?aliasName=${alias}`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            setQuestions(response.data.data.questions);
          }).catch((error) => {
            if (error.response.status === 401) {
              navigate("/login");             
            }
          });
      } else {
        axios
          .get(`${BaseUrl.uri}/question/asked`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            setQuestions(response.data.data.questions);
          })
          .catch((error) => {
            if (error.response.status === 401) {
              navigate("/login");             
            }});
      }
    } else {
      if (alias) {

        axios
          .get(`${BaseUrl.uri}/question/answered?aliasName=${alias}`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            setQuestions(response.data.data.questions);
          }).catch((error) => {
            if (error.response.status === 401) {
              navigate("/login");             
            }});
      } else {
        axios
          .get(`${BaseUrl.uri}/question/answered`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            setQuestions(response.data.data.questions);
          }).catch((error) => {
            if (error.response.status === 401) {
              navigate("/login");             
            }});
      }
    }
  }, [menu]);
  return (
    <>
      <div className="flex">
        <div className="mt-3 w-1/5">
          <ul className="flex flex-col gap-2">
            <li
              className={`w-4/5 p-1 px-4 ${
                menu === "asked" ? "rounded-3xl bg-orange-500 text-white" : ""
              }`}
              onClick={() => setMenu("asked")}
            >
              Asked
            </li>
            <li
              className={`w-4/5 p-1 px-4 ${
                menu === "answered" ? "rounded-3xl bg-orange-500 text-white" : ""
              }`}
              onClick={() => setMenu("answered")}
            >
              Answered
            </li>
          </ul>
        </div>
        <div className="w-4/5">
          {questions && <AskedQuestionsList questions={questions} />}
        </div>
      </div>
    </>
  );
}
