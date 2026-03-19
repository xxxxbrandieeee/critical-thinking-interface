import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, message, Spin, Tooltip } from 'antd';
import callOpenAI from './ai1'
import { PaperClipOutlined } from '@ant-design/icons';
import axios from 'axios'
import aidocument from '../aidocument'
import allInfo from '../data.js'
import { getCurrentConfig } from '../config/projectConfig';

const config = getCurrentConfig();


export default function AIChat({ tapActive, setValue: setDocumentValue, value: documentValue, disabledAi }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [count, setCount] = useState(20)
  const isBlueRef = useRef<any>(false)


  useLayoutEffect(() => {
    setValue('')
  }, [tapActive])

  const handSend = async () => {
    console.log(77777, value);

    if (!value) {
      message.error("You need to enter at least one query to proceed：")
      return
    }
    setLoading(true)
    console.log(3333, tapActive);
    let num = count

    try {
      console.log(value)
      const arr: any = [...(data || [])]
      arr.push({
        type: 'search',
        content: value
      })
      if (!allInfo['Page_task_interface'].ai.chat_first) {
        allInfo['Page_task_interface'].ai.chat_first = {
          value: value,
          time: + new Date()
        }
      }
      const res = await callOpenAI(value)
      console.log(2222, res);
      num--
      arr.push(...JSON.parse(res).aiOverview)
      if (allInfo['Page_task_interface'].ai.chat) {
        allInfo['Page_task_interface'].ai.chat.content = arr
      } else {
        allInfo['Page_task_interface'].ai.chat = {
          content: arr
        }
      }
      setData(arr)

      setCount(num)
    } catch (error) {
      console.log(111, error);

      message.error('Sorry, we cannot fulfill your request.')
    } finally {
      setLoading(false)
      setValue('')
    }
    allInfo['Page_task_interface'].ai.num = num
  }

  useEffect(() => {
    // Listen for keyboard Enter key event
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isBlueRef.current) {
        event.preventDefault(); // Prevent default Enter key behavior
        handSend(); // Call the send message function
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handSend]);

  const handChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setValue(e.target.value)
  }


  const toLink = (item) => {
    if (!allInfo['Page_task_interface'].ai.click_li) {
      allInfo['Page_task_interface'].ai.click_li = [item.content.pageId]
    } else {
      allInfo['Page_task_interface'].ai.click_li.push(item.content.pageId)
    }
    setDocumentValue(item.content?.pageId * 1)
  }

  const ONECONTENT = useMemo(() => {
    return <div className='ai_content'>
      {
        data.map(item => {
          if (item.type === 'image') {
            return <img className='ai_img' src={`/${item.content}`} alt="" />
          } else if (item.type === 'text') {
            return <div className='ai_text'>{item.content}</div>
          } else if (item.type === 'list') {
            return <ul>
              {
                item.content?.map((ele: string) => {
                  return <li className='ai_li'>
                    {ele}</li>
                })
              }
            </ul>
          } else if (item.type == 'url') {
            return <div className='ai_document'>
              <p className='ai_title'>
                {item.content.title}
              </p>
              <p className='ai_desc'>
                {item.content.description}
                <Tooltip color="blueviolet" title="Click to view the referred document in the Document Viewer">
                  <PaperClipOutlined className='ai_icon' onClick={() => {
                    toLink(item)
                  }} />
                </Tooltip>
              </p>
            </div>
          } else if (item.type === 'search') {
            return <div className='ai_search'>
              <span className='ai_question'>
                {item.content}
              </span>
            </div>
          }
        })
      }
    </div>
  }, [data])

  const sharedProps = {
    spinning: true,
    percent: 0,
  };

 const stylesFn = ({ props }) => {
  return {
      indicator: {
        color: '#722ed1',
      },
    };
};

  return (
    <>
      <div className='aichat'>
        {
         loading ? <div style={{
          height:'100%',
          display:'flex',
          justifyContent:'center',
          alignItems:'center'
         }}>
          <Spin {...sharedProps} size='large' styles={stylesFn} />
         </div> : ONECONTENT
        }
      </div>
      <div className='aifoot'>
        <Input.TextArea
          disabled={disabledAi}
          onBlur={() => {
            isBlueRef.current = false
          }}
          onFocus={() => {
            isBlueRef.current = true
          }}
          rows={2} value={value} placeholder={disabledAi ? "AI Chatbot is no longer available." : `You can ask ${count} more questions to Al...`} onChange={handChange} />
        <Button className='yinying' disabled={count == 0 || disabledAi} loading={loading} type="primary" style={{ marginLeft: "20px", background: 'rgb(210, 197, 255)', color: "#000" }} onClick={handSend}>Send</Button>
      </div>

    </>
  )
}
