import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState(""); //used to save the input data
    const [recentPrompt, setRecentPrompt] = useState(""); //when send button is clicked, input data field will be saved in the recentPrompt
    const [prevPrompts, setPrevPrompts] = useState([]); //to store all the input history and display it in the recent tab in the Sidebar
    const [showResult, setShowResult] = useState(false); //it is a boolean type, once it is true it will hide the greet text and cards sections, and shows the result
    const [loading, setLoading] = useState(false); // if this is true, it will display the Loading animation and after getting the data, it will return to false to display the data 
    const [resultData, setResultData] = useState(""); // used to display result on the webpage


    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev + nextWord);
        }, 75*index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }


    const onSent = async (prompt) => {
        setResultData(""); //resetting to empty string. when this function runs, resultData will be reset. previous responses will be removed from this state variable
        setLoading(true);
        setShowResult(true);
        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts(prev=>[...prev,input]);
            setRecentPrompt(input);
            response = await runChat(input);
        }
        

        let responseArray = response.split("**");

        let newResponse = "";

        for(let i = 0; i < responseArray.length; i++) {
            if(i === 0 || i%2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }

        let newResponse2 = newResponse.split("*").join("</br>");

        //setResultData(newResponse2); //storing the response in setResultData
        let newResponseArray = newResponse2.split(" ");

        for(let i = 0; i< newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ");
        }

        setLoading(false); //to hide the loading
        setInput(""); //reset the input field
    }



    const contextValue = { 
        prevPrompts, 
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider