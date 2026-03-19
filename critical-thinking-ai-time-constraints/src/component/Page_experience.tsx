import React, { useContext, useState } from 'react'
import './Page_experience.css'
import { Button, message, Radio, type RadioChangeEvent, Input } from 'antd'
import allInfo from '../data.js'
import PageContext from '../PageContext.js';
import CountButton from './Countbtn.js';
import { getCurrentConfig } from '../config/projectConfig';
import { Page_experience } from '../pageInfo';

const countdownTime = 1
const config = getCurrentConfig();


allInfo['Page_experience'] = {}


const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: '30px',
};

export default function PageExperience() {
    const [values, setValues] = useState<Record<number, string>>({});

    const { setCurrentPage,currentPage } = useContext(PageContext);

    const handleValueChange = (index: number, value: string) => {
        setValues(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const next = () => {
        // Check if all questions have been answered
        const allAnswered = Page_experience.data.every((_, index) => values[index] !== undefined && values[index] !== '');
        
        if (!allAnswered) {
            message.error("You need to answer all the questions to proceed.")
            return
        }

        // Generate question 4 title based on config
        const question4Title = config.aiTool.enabled && config.aiTool.availability !== 'none'
            ? "How did you use the AI Chatbot to help you read the documents and make a reasoned decision? Please explain what you used it for, how it helped the process (if at all), and why you used it that way."
            : "How did you approach reading the documents and making a reasoned decision, and why? Please explain your strategy, what helped you most, and why you chose to approach the task in that way.";

        allInfo['Page_experience'].info = [
            {
                title: "How difficult or easy did you find the task?",
                answer: values[0]
            },
            {
                title: "How helpful was the tool(s) in assisting you with the task?",
                answer: values[1]
            },
            {
                title: "How much do you trust the tool(s)?",
                answer: values[2]
            },
            {
                title: question4Title,
                answer: values[3]
            },
        ]
        allInfo['Page_experience']['time'] = + new Date()
        console.log(allInfo);
        setCurrentPage(currentPage+1)
    }
    return (
        <div className='Page_experience_content'>
            {/* First 3 questions rendered dynamically */}
            {Page_experience.data.slice(0, 3).map((item, index) => (
                <div key={index}>
                    <p className='Page_experience_item'>{item.title}</p>
                    <Radio.Group
                        style={style}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        value={values[index]}
                        options={item.option}
                    />
                </div>
            ))}

            {/* Question 4 title is dynamically generated based on config */}
            <p className='Page_experience_item'>
                {config.aiTool.enabled && config.aiTool.availability !== 'none' ? (
                    <span className='highlight'>How did you use the AI Chatbot to help you read the documents and make a reasoned decision?</span>
                ) : (
                    <span className='highlight'>How did you approach reading the documents and making a reasoned decision, and why?</span>
                )}
                {' '}
                {config.aiTool.enabled && config.aiTool.availability !== 'none'
                    ? 'Please explain what you used it for, how it helped the process (if at all), and why you used it that way.'
                    : 'Please explain your strategy, what helped you most, and why you chose to approach the task in that way.'}
            </p>
            <Input.TextArea
                rows={4}
                onChange={(e) => handleValueChange(3, e.target.value)}
                value={values[3]}
            />
            <CountButton countdownTime={countdownTime} onAction={next} />
        </div>
    )
}
