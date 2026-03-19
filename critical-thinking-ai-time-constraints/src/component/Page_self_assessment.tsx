import React, { useContext, useState } from 'react'
import './Page_self_assessment.css'
import { Button, message, Radio, type RadioChangeEvent } from 'antd'
import allInfo from '../data.js'
import PageContext from '../PageContext.js';
import CountButton from './Countbtn.js';
import { Page_self_assessment } from '../pageInfo';
const countdownTime=1


allInfo['Page_self_assessment'] = {}


const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: '30px',
};

export default function PageSelfAssessment() {
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
        const allAnswered = Page_self_assessment.data.every((_, index) => values[index] !== undefined && values[index] !== '');
        
        if (!allAnswered) {
            message.error("You need to answer all the questions to proceed.")
            return
        }

        // Build info array
        const info = Page_self_assessment.data.map((item, index) => ({
            title: item.title,
            answer: values[index]
        }));

        allInfo['Page_self_assessment'].info = info
        allInfo['Page_self_assessment']['time'] = + new Date()
        console.log(allInfo);
        setCurrentPage(currentPage+1)
    }
    return (
        <div className='Page_self_assessment_content'>
            <div className='instruction'><span className='highlight'>[Reflecting on Your Experience]</span> Please <span className='highlight'>answer honestly based on your experience</span> during the task. You won’t be penalized by your answer, and you are not expected to select "Strongly Agree" for every statement. From Strongly Disagree to Strongly Agree, rate your agreement with the following statements:</div>
            {Page_self_assessment.data.map((item, index) => (
                <div key={index}>
                    <p className='Page_self_assessment_item'>{item.title}</p>
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
