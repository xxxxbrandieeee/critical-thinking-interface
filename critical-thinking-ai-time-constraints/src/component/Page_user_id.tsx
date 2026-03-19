import { Button, Input, message } from 'antd'
import React, { useContext, useState } from 'react'
import allInfo from '../data.js'
import PageContext from '../PageContext';
import './Page_user_id.css'
import CountButton from './Countbtn';
import axios from 'axios';
const countdownTime = 1

allInfo.Page_user_id = {}

function getURLParameters(url) {
  // Extract the query string part
  const queryString = url.split('?')[1];

  // If no query string, return empty object
  if (!queryString) {
    return {};
  }

  // Split query string into key-value pairs
  const pairs = queryString.split('&');
  const paramsObject = {};

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    paramsObject[decodeURIComponent(key)] = decodeURIComponent(value);
  }

  return paramsObject;
}




export default function Page_user_id() {
  // Example usage
  console.log(333);

  const parameters = getURLParameters(window.location.href);
  const { setCurrentPage,currentPage } = useContext(PageContext);
  const [value, setValue] = useState(parameters?.prolificId)
  const [loading, setLoading] = useState(false)

  const next = async () => {
    if (!value) {
      message.error("You need to answer all the questions to proceed.")
      return
    }
      allInfo['Page_user_id']['value'] = value
      allInfo['Page_user_id']['time'] = + new Date()
      console.log(allInfo);
      setCurrentPage(currentPage+1)
  }
  return (
    <div>
      <div className='Page_user_id_content'>
        Please enter your Prolific ID: <Input style={{ width: '400px', marginLeft: '20px' }} className='input' value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <CountButton loading={loading} countdownTime={0} onAction={next} />
    </div>
  )
}
