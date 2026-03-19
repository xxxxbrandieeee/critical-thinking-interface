import { Button, message, Radio } from 'antd';
import './Page_introduction.css'
import { useContext, useState } from 'react';
import page3_1 from '../assets/page3-1.png'
import page3_2 from '../assets/page3-2.png'
import page3_3 from '../assets/page3-3.png'
import page3_5 from '../assets/page3-5.png'
import page3_5_no_ai from '../assets/page3-5-no-ai.png'
import React from 'react';
import allInfo from '../data.js'
import PageContext from '../PageContext';
import CountButton from './Countbtn';
import { getCurrentConfig } from '../config/projectConfig';

const countdownTime=2
const config = getCurrentConfig();

allInfo.Page_introduction={}

const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
};



function Page_introduction_1() {
    const [value, setValue] = useState()
    const onChange = (e) => {
        setValue(e.target.value);
        allInfo.Page_introduction['Page_introduction_1']=e.target.value
    }

    const totalTimeText = config.totalStudyTime === 40 ? 'approximately 40 minutes' : 'approximately 20 minutes';
    const taskTimeMinutes = config.taskTime === 30 ? '30 minutes' : '10 minutes';
    const taskTimeText = config.taskTime === 30 ? '30-minute' : '10-minute';

    return (
        <>
            <p className='list_item instruction'>
            <span className='highlight'>[Instruction: Procedure of the Study and Time Required]</span> During this study, you will complete a series of steps to <span className='highlight'>read some documents and write an essay</span> for your decision about a water contamination issue. The estimated total time for {config.totalStudyTime === 40 ? 'the entire study' : 'the study'} is {totalTimeText}, though actual completion time may vary by individual.
                <p className='list_item' style={{ marginLeft: '15px', marginTop: '5px', marginBottom: '5px'}}> <span className='highlight'>1) Instructions:</span> You will begin by reading the study instructions to learn about the task and the tool(s) provided. <span className='highlight'>Please read each instruction carefully.</span> A timer is set for each instruction to ensure sufficient reading time. The "Next" button will become clickable only after the time is up.</p>
                <p className='list_item' style={{ marginLeft: '15px', marginBottom: '5px'}}> <span className='highlight'>2) Task Scenario:</span> You will review the background scenario that introduces the decision you are expected to make.</p>
                <p className='list_item' style={{ marginLeft: '15px', marginBottom: '5px'}}> <span className='highlight'>3) Main Task - Reading Documents and Writing an Essay:</span> <span className='highlight'>Within a <span style={{color: 'red'}}>{taskTimeMinutes}</span> time frame</span>, on a single page, you will explore information in the provided documents using the embedded tool(s) until you feel confident in your decision, and you will write an essay about your decision, reasoning, and deliberation process. <span className='highlight'>Please stay free from distractions during this time. A timer will count down from {taskTimeMinutes}. You will not be able to proceed to the next page early. When the time is up, you will be automatically taken to the next page.</span> </p>
                <p className='list_item' style={{ marginLeft: '15px', marginBottom: '5px'}}> <span className='highlight'>4) Follow-up questions:</span> You will answer a set of questions about the task. </p>
            </p>
            <Radio.Group
                style={style}
                onChange={onChange}
                value={value}
                options={[
                    { value: 'I understand the procedure and time required of the study.', label: 'I understand the procedure and time required of the study.' },
                ]}
            />
        </>
    )
}

function Page_introduction_2() {
    const [value, setValue] = useState()
    const onChange = (e) => {
        allInfo.Page_introduction['Page_introduction_2']=e.target.value
        setValue(e.target.value);
    }

    const taskTimeMinutes = config.taskTime === 30 ? '30 minutes' : '10 minutes';

    return <>

        <p className='list_item instruction'>
            <span className='highlight'>[Instruction: Overview of the Task]</span> The decision you will be asked to make is <span className='highlight'>regarding a settlement proposal made by Hallman Inc. to the City of Bryn Bower to address a water contamination issue.</span> These are pseudonyms during the study—the actual company and city names have been replaced for confidentiality.

            <p className='list_item'><span className='highlight'>You are a member of the city council and the council meeting is in <span style={{color: 'red'}}>{taskTimeMinutes}</span>.</span> Every council member is expected to deliver a statement to explain their deliberative process of their decision. <span className='highlight'>As a city council member, you are going to prepare an essay to explain your decision whether the city should accept or reject the offer.</span> You will be shown the detailed scenario once you begin the task after finishing these instructions.</p>
        </p>
        <Radio.Group
            style={style}
            onChange={onChange}
            value={value}
            options={[
                { value: 'I understand the task, and that Hallman Inc. and Bryn Bower are pseudonyms.', label: 'I understand the task, and that Hallman Inc. and Bryn Bower are pseudonyms.' },
            ]}
        />
    </>
}

function Page_introduction_3() {
    const [value, setValue] = useState()
    const onChange = (e) => {
        allInfo.Page_introduction['Page_introduction_3']=e.target.value
        setValue(e.target.value);
    }
    return <>
        <p className='list_item instruction'>
            <span className='highlight'>[Instruction: No Going Backward]</span> Please <span className='highlight'>do not go backward</span> at any point in this study. If you attempt to use the back button or the refresh button on your browser, you will <span className='highlight'>lose all your progress</span> and have to restart the study from the beginning.
        </p>
        <Radio.Group
            style={style}
            onChange={onChange}
            value={value}
            options={[
                { value: 'I understand that I am not able to go back or refresh the webpage at any point in this study.', label: 'I understand that I am not able to go back or refresh the webpage at any point in this study.' },
            ]}
        />
    </>
}

function Page_introduction_4() {
    const [value, setValue] = useState()
    const onChange = (e) => {
        allInfo.Page_introduction['Page_introduction_4']=e.target.value
        setValue(e.target.value);
    }

    const taskTimeMinutes = config.taskTime === 30 ? '30-minute' : '10-minute';
    const { aiTool } = config;

    // 根据 AI 工具配置生成不同的文本
    let toolDescription = '';
    let confirmationText = '';
    let imageSrc = page3_2; // 默认使用 page3_2 (无AI的图)

    if (!aiTool.enabled || aiTool.availability === 'none') {
        // 无 AI 工具
        toolDescription = `During this <span class='highlight'><span style="color: red">${config.taskTime}-minute</span></span> task, there is a simple <span class='highlight'>Document Viewer</span> for you to read <span class='highlight'>potentially relevant</span> documents to make a reasoned decision.`;
        confirmationText = 'I understand that I will use a Document Viewer.';
        imageSrc = page3_2;
    } else if (aiTool.availability === 'full') {
        // AI 全程可用
        toolDescription = `During this <span class='highlight'><span style="color: red">${config.taskTime}-minute</span></span> task, there is a simple <span class='highlight'>Document Viewer</span> for you to read <span class='highlight'>potentially relevant</span> documents to make a reasoned decision. There is a general <span class='highlight'>AI Chatbot</span> (a version of ChatGPT) ${config.taskTime === 30 ? 'that you are free to use' : 'you are free to use'} to help answer questions about the documents provided and make a reasoned decision.`;
        confirmationText = config.taskTime === 30
            ? 'I understand that I will use a Document Viewer and an AI Chatbot.'
            : 'I understand that I will use a Document Viewer and an AI Chatbot for the task.';
        imageSrc = page3_1;
    } else if (aiTool.availability === 'last') {
        // AI 后 N 分钟可用
        const waitTime = config.taskTime - (aiTool.duration || 0);
        toolDescription = `During this <span class='highlight'><span style="color: red">${config.taskTime}-minute</span></span> task, there is a simple <span class='highlight'>Document Viewer</span> for you to read <span class='highlight'>potentially relevant</span> documents to make a reasoned decision. <span class='highlight'>After ${waitTime} minutes</span>, for the <span class='highlight'><span style="color: red">last ${aiTool.duration} minutes</span></span> of the task, you will also have access to a general <span class='highlight'>AI Chatbot</span> (a version of ChatGPT) you are free to use to help answer questions about the documents provided and make a reasoned decision.`;
        confirmationText = `I understand that I will use a Document Viewer, and I will use an AI Chatbot for the last ${aiTool.duration} minutes of the task.`;
        imageSrc = page3_1;
    } else if (aiTool.availability === 'first') {
        // AI 前 N 分钟可用
        toolDescription = `During this <span class='highlight'><span style="color: red">${config.taskTime}-minute</span></span> task, there is a simple <span class='highlight'>Document Viewer</span> for you to read <span class='highlight'>potentially relevant</span> documents to make a reasoned decision. For the <span class='highlight'>first <span style="color: red">${aiTool.duration} minutes</span></span>, you will also have access to a general <span class='highlight'>AI Chatbot</span> (a version of ChatGPT) you are free to use to help answer questions about the documents provided and make a reasoned decision. <span class='highlight'>After <span style="color: red">${aiTool.duration} minutes</span>,</span> the AI chatbot will no longer be available for further conversation.`;
        confirmationText = `I understand that I will use a Document Viewer, and I will use an AI Chatbot for the first ${aiTool.duration} minutes of the task.`;
        imageSrc = page3_1;
    }

    return <>
        <p className='list_item instruction'>
            <span className='highlight'>[Instruction: Tools Provided in the Task]</span> <span dangerouslySetInnerHTML={{ __html: toolDescription }} />
            {aiTool.enabled && aiTool.availability !== 'none' && (
                <p className='list_item'>Please use only this AI Chatbot during the study and refrain from using other external AI tools. You will be introduced to these tools again once you begin the task after finishing these instructions.</p>
            )}
        </p>
        <Radio.Group
            style={style}
            onChange={onChange}
            value={value}
            options={[
                { value: confirmationText, label: confirmationText },
            ]}
        />
        <img className='img' src={imageSrc} alt="" />
    </>
}


function Page_introduction_5() {
    const [value, setValue] = useState()
    const onChange = (e) => {
        allInfo.Page_introduction['Page_introduction_5']=e.target.value
        setValue(e.target.value);
    }

    const taskTimeMinutes = config.taskTime === 30 ? '30-minute' : '10-minute';
    const { aiTool } = config;

    // 根据 AI 工具配置生成不同的文本
    let writingContext = '';
    let confirmationText = '';
    let imageSrc = page3_5; // 默认有AI的图

    if (!aiTool.enabled || aiTool.availability === 'none') {
        // 无 AI 工具
        writingContext = 'on the same page of the Document Viewer';
        confirmationText = 'I understand that I will write my essay on the same page of the Document Viewer.';
        imageSrc = page3_5_no_ai; // 无AI使用 page3-5-no-ai.png
    } else {
        // 有 AI 工具
        writingContext = 'on the same page of the Document Viewer and the AI Chatbot';
        confirmationText = 'I understand that I will write my essay on the same page of the Document Viewer and the AI Chatbot.';
        imageSrc = page3_5; // 有AI使用 page3-5.png
    }

    return <>
        <p className='list_item instruction'>
            <span className='highlight'>[Instruction: Writing an Essay about Your Decision and Reasoning]</span> During this <span className='highlight'><span style={{color: 'red'}}>{config.taskTime / 60}-minute</span></span> task, {writingContext}, you will also <span className='highlight'>write an essay about your decision and your reasoning for it in 1~3 paragraphs.</span> Your arguments should be <span className='highlight'>exclusively</span> based on information from <span className='highlight'>some or all</span> the documents provided in the task.
        </p>
        <Radio.Group
            style={style}
            onChange={onChange}
            value={value}
            options={[
                { value: confirmationText, label: confirmationText },
            ]}
        />
        <img className='img' src={imageSrc} alt="" />
    </>
}


function Page_introduction_6() {
    const [value, setValue] = useState()
    const onChange = (e) => {
        allInfo.Page_introduction['Page_introduction_6']=e.target.value
        setValue(e.target.value);
    }
    return <>

        <p className='list_item instruction'>
            <span className='highlight'>[Instruction: No Using External Sources]</span> Please <span className='highlight'>do not leave this page.</span> While participating in this study, we ask that you <span className='highlight'>remain on the study’s interface</span>, and <span className='highlight'>refrain from using any other external systems</span> (e.g., search engines, ChatGPT, etc.). You will see a warning message like below if you leave the interface.
        </p>
        <Radio.Group
            style={style}
            onChange={onChange}
            value={value}
            options={[
                { value: 'I understand that I need to remain on the study’s interface and refrain from using any other systems.', label: 'I understand that I need to remain on the study’s interface and refrain from using any other systems.' },
            ]}
        />
        <img className='img' src={page3_3} alt="" />
    </>
}


function Page_introduction_7() {
  
    return <h2>
       Let's get started!
    </h2>
}


const PAGEMAP={
    1:Page_introduction_1,
    2:Page_introduction_2,
    3:Page_introduction_3,
    4:Page_introduction_4,
    5:Page_introduction_5,
    6:Page_introduction_6,
    7:Page_introduction_7
}

export default function Page_introduction() {
    // navigate to a specific page
    const [count, setCount] = useState(1)
    const {setCurrentPage,currentPage} = useContext(PageContext);

    const next=()=>{
        if(count>=7){
            console.log(allInfo);
            allInfo['Page_introduction']['time'] = + new Date()
            setCurrentPage(currentPage+1)
          return 
        }
        if(!allInfo.Page_introduction[`Page_introduction_${count}`]){
           message.error("You need to answer all the questions to proceed.") 
           return
        }
        setCount(count+1)
    }
    
    return (
        <>
            <div className='page'>
             {React.createElement(PAGEMAP[count])}
             <CountButton countdownTime={countdownTime} trigger={count} onAction={next} />
            </div>
        </>

    )
}
