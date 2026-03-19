import { useEffect, useState } from 'react'
import Page_consent from './component/Page_consent'
import Page_user_id from './component/Page_user_id'
import Page_introduction from './component/Page_introduction'
import Page_scenario from './component/Page_scenario'
import Page_task_interface from './component/Page_task_interface'
import Page_decision from './component/Page_decision'
import Page_recall from './component/Page_recall'
import Page_evaluation from './component/Page_evaluation'
import Page_comprehension from './component/Page_comprehension'
import Page_experience from './component/Page_experience'
import Page_self_assessment from './component/Page_self_assessment'
import Page_feedback from './component/Page_feedback'
import Page_ending from './component/Page_ending'
import Page_ending_noconsent from './component/Page_ending_noconsent'
import Page_demographic from './component/Page_demographic'
import allInfo from './data'
import PageContext from './PageContext'
import { pageArr } from './config/projectConfig'
import { Button, Modal, Progress } from 'antd'
import './App.css'
import React from 'react'


const PAGE_MAP = {
  'Page_consent': Page_consent,
  'Page_user_id': Page_user_id,
  "Page_demographic": Page_demographic,
  'Page_introduction': Page_introduction,
  'Page_scenario': Page_scenario,
  'Page_task_interface': Page_task_interface,
  'Page_decision': Page_decision,
  'Page_experience': Page_experience,
  'Page_recall': Page_recall,
  'Page_evaluation': Page_evaluation,
  'Page_comprehension': Page_comprehension,
  'Page_self_assessment': Page_self_assessment,
  'Page_feedback': Page_feedback,
  'Page_ending': Page_ending,
  'Page_ending_noconsent': Page_ending_noconsent,
}

const handleBeforeUnload = (event: any) => {
  event.preventDefault()
  event.returnValue = 'Are you sure you want to leave this page? Your progress will be lost.'
}


function App() {
  // navigate to a specific page
  const [currentPage, setCurrentPage] = useState(0)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const load = () => {
      if (localStorage.getItem('isRefreshed')) {
        allInfo.isRefresh = true;
      } else {
        localStorage.setItem('isRefreshed', 'true');
      }
    }
    window.addEventListener('load', load)
    return () => {
      window.removeEventListener('load', load)
    }
  }, [])
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    const handVisibilitychange = () => {
      if (document.hidden) {
        // disable the pop up
        if (![1, 2, 13, 14].includes(currentPage)) {
          setOpen(true)
        }
        if (!allInfo['page' + currentPage]['leave_page']) {
          allInfo['page' + currentPage]['leave_page'] = []
        }
        allInfo['page' + currentPage]['leave_page'].push({
          "type": "leave",
          "time": + new Date()
        })
      } else {
        allInfo['page' + currentPage]['leave_page'].push({
          "type": "return",
          "time": + new Date()
        })
      }
    }

    document.addEventListener('visibilitychange', handVisibilitychange);
    return () => {

      document.removeEventListener('visibilitychange', handVisibilitychange);
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentPage])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // if(localStorage.getItem('state') === '1'){
  //   return <h2>You have already answered this system</h2>
  // }

  
  const percent =currentPage>=12? 100: (currentPage + 1) / pageArr.length * 100

  return (
    <>
      <Modal
        open={open}
        title=""
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <h2>Please do not leave this page.</h2>
        <p>While participating in this study, we ask that you remain on the study’s interface and refrain from using any other systems (e.g., search engines, ChatGPT, etc.).</p>
        <div className='modal_btn'>
          <Button onClick={() => setOpen(false)}>I understand</Button>
        </div>
      </Modal>
      <PageContext.Provider value={{ currentPage, setCurrentPage }}>
        <Progress size="small" percent={percent} showInfo={false} />
        {React.createElement(currentPage == 14 ? Page_ending_noconsent : PAGE_MAP[pageArr[currentPage]])}
      </PageContext.Provider>
    </>
  )
}

export default App
