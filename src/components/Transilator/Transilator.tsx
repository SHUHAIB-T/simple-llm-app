import { useEffect, useState } from "react";
import { languages } from "../../utils/languages";
import Loader from "../Loader/Loader";
import { IinputData } from "../../types/userTypes";
import { TogetherAI } from "@langchain/community/llms/togetherai";
import { PromptTemplate } from "@langchain/core/prompts";
import { validate } from "../../utils/valildator";

const model = new TogetherAI({
  model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  apiKey: import.meta.env.VITE_TOGETHER_AI_API_KEY,
});

export default function Transilator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [inputData, setInputData] = useState<IinputData>({
    language: "",
    text: "",
  });

  const [inputError, setInputError] = useState<IinputData>({
    language: "",
    text: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });

    if(inputData.language){
      setInputError({
        ...inputError, 
        language: validate("language", inputData.language)
      })
    }
    
    if(inputData.text){
      setInputError({
        ...inputError, 
        text: validate("text", inputData.text)
      })
    }
    setSubmit(false)
  };

  const prompt = PromptTemplate.fromTemplate(
    `System: As a transilator, you are assigned a task to convert the given english sentance to the given language. User: {input}.`
  );
  const chain = prompt.pipe(model);

  useEffect(() => {
    (async function () {
      if (
        inputData.language &&
        inputData.text &&
        submit &&
        !inputError.language &&
        !inputError.text
      ) {
        try {
          setLoading(true);
          const response = await chain.invoke({
            input: `sentance: ${inputData.text}, language: ${inputData.language}`,
          });
          setResponse(response);
          setLoading(false);
          setSubmit(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
          setSubmit(false);
        }
      }
    })();
  }, [inputData, chain, submit, inputError]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setInputError({
      ...inputError,
      text: validate("text", inputData.text),
      language: validate("language", inputData.language),
    });
    setSubmit(true);
  };

  return (
    <div className="text-gray-100 flex flex-col items-center">
      <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500 text-5xl">
        Translator
      </h1>
      <div className="p-3 rounded-md ring-1 ring-gray-700 mt-10 flex flex-col items-center gap-4">
        <div className="flex gap-3 flex-wrap">
          <input
            onChange={handleChange}
            placeholder="Enter text here"
            type="text"
            name="text"
            value={inputData.text}
            className={`bg-gray-800 w-72 focus:ring-blue-600 focus:outline-none ring-1 ${inputError.text ? 'ring-red-500' :'ring-gray-700'} rounded-md p-2`}
          />
          <select
            name="language"
            value={inputData.language}
            onChange={handleChange}
            className={`bg-gray-800 p-3 focus:ring-blue-600 rounded-md ring-1 ${inputError.language ? 'ring-red-500' :'ring-gray-700'} `}
            id=""
          >
            <option value="">--chose language--</option>
            {languages.map((language) => {
              return (
                <>
                  <option value={language}>{language}</option>
                </>
              );
            })}
          </select>
          <button
            onClick={handleClick}
            className="font-bold py-2 px-4 bg-gradient-to-bl from-blue-500 to-violet-500 rounded-md"
          >
            convert
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="ring-1 ring-gray-700 w-full"></div>
            <span className="text-start text-xl">{response}</span>
          </>
        )}
      </div>
    </div>
  );
}
