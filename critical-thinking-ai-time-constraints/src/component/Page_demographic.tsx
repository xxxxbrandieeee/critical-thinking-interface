import { Input, message, Radio } from 'antd'
import React, { useContext, useState } from 'react'
import allInfo from '../data.js'
import PageContext from '../PageContext.js';
import './Page_feedback.css'
import axios from 'axios';
import CountButton from './Countbtn.js';
import { Page_demographic } from '../pageInfo';
const countdownTime = 1

const style = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: '30px',
};

export default function PageDemographic() {
  const { setCurrentPage,currentPage } = useContext(PageContext);
  const [values, setValues] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false)

  const handleValueChange = (index: number, value: string) => {
    setValues(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const next = async () => {
    // Check if all questions have been answered
    const allAnswered = Page_demographic.data.every((_, index) => values[index] !== undefined && values[index] !== '');
    
    if (!allAnswered) {
      message.error("You need to answer all the questions to proceed.")
      return;
    }

    // Build info array
    const info = Page_demographic.data.map((item, index) => ({
      title: item.title,
      answer: values[index]
    }));


    allInfo['Page_demographic'] = {
      info,
      time: +new Date()
    };
    setCurrentPage(currentPage+1);
  }

  return (
    <div className='Page_feedback_content'>
      <div>
        {Page_demographic.data.map((item, index) => (
          <div key={index}>
            <p className='Page_feedback_item'>{item.title}</p>
            <Radio.Group 
              style={style} 
              onChange={(e) => handleValueChange(index, e.target.value)} 
              value={values[index]}
              options={item.option}
            />
          </div>
        ))}
      </div>
      <CountButton loading={loading} countdownTime={countdownTime} onAction={next} />
    </div>
  )
}