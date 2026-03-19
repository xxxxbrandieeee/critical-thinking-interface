import { Input, message, Radio } from 'antd'
import React, { useContext, useState } from 'react'
import allInfo from '../data.js'
import PageContext from '../PageContext';
import './Page_feedback.css'
import axios from 'axios';
import CountButton from './Countbtn';
import { getCurrentConfig } from '../config/projectConfig';
const countdownTime = 1

const style = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: '30px',
};

export default function Page_feedback() {
  const { setCurrentPage,currentPage } = useContext(PageContext);

  const [open1, setOpen1] = useState('');
  const [open2, setOpen2] = useState('');
  const [loading, setLoading] = useState(false)


  const next = async () => {
    if ( !open1 || !open2) {
      message.error("You need to answer all the questions to proceed.")
      return;
    }

    allInfo['Page_feedback'] = {
      info: [
        {
          title: "Was any part of the study confusing or challenging for you?",
          value: open1,
        },
        {
          title: "Did you have any technical issues during the study?",
          value: open2,
        }
      ],
      time: +new Date()
    };

    console.log(allInfo);
    setLoading(true)
    
   
    try {
      const config = getCurrentConfig();
      const apiUrl = `${config.api.baseUrl}/api/response`;
      
      await axios.post(apiUrl, {
        data: allInfo,
        type: config.Page_task_interface.projectType
      })
      setCurrentPage(currentPage+1);
      message.success("success")
    } catch (error) {
      message.error(error.response?.data?.error || "Submission failed. Please do not close or refresh the page. Please check your internet connection and try again.")
      setLoading(false)
    }
  }

  return (
    <div className='Page_feedback_content'>
      <div>
        <p className='Page_feedback_item'>Was any part of the study confusing or challenging for you?</p>
        <Input.TextArea rows={3} className='input' value={open1} onChange={(e) => setOpen1(e.target.value)} />

        <p className='Page_feedback_item'>Did you have any technical issues during the study?</p>
        <Input.TextArea rows={3} className='input' value={open2} onChange={(e) => setOpen2(e.target.value)} />
      </div>
      <CountButton loading={loading} countdownTime={countdownTime} onAction={next} />
    </div>
  )
}