import React, { useContext, useState } from 'react'
import './Page_decision.css'
import { Button, message, Radio, type RadioChangeEvent } from 'antd'
import allInfo from '../data.js'
import PageContext from '../PageContext.js';
import CountButton from './Countbtn.js';
import { Page_decision } from '../pageInfo.js';
const countdownTime=1

allInfo['Page_decision'] = {}


const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: '30px',
};

export default function PageDecision() {
    const [values, setValues] = useState<Record<number, string>>({});
    const {currentPage, setCurrentPage} = useContext(PageContext);

    const handleValueChange = (index: number, value: string) => {
        setValues(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const next = () => {
        // Check if all questions have been answered
        const allAnswered = Page_decision.data.every((_, index) => values[index] !== undefined && values[index] !== '');
        
        if (!allAnswered) {
            message.error("You need to answer all the questions to proceed.")
            return
        }

        // Build info array
        const info = Page_decision.data.map((item, index) => ({
            title: item.title,
            answer: values[index]
        }));

        allInfo['Page_decision'].info = info
        allInfo['Page_decision']['time'] = + new Date()
        console.log(allInfo);
        setCurrentPage(currentPage+1)
    }
    return (
        <div className='Page_decision_content'>
            {Page_decision.data.map((item, index) => (
                <div key={index}>
                    <p className='Page_decision_item'>{item.title}</p>
                    <Radio.Group
                        style={style}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        value={values[index]}
                        options={item.option}
                    />
                </div>
            ))}

            <CountButton countdownTime={countdownTime} onAction={next}/>
        </div>
    )
}
