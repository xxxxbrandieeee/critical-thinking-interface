import { Button, Input, message, Radio } from 'antd';

import './Page_consent.css'
import { useContext, useState } from 'react';
import allInfo from '../data'
import PageContext from '../PageContext';
import CountButton from './Countbtn';
import { pageArr } from '../config/projectConfig'
import axios from 'axios';
const countdownTime = 1


const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
};

allInfo.Page_consent = {}


export default function Page_consent() {
    const [value, setValue] = useState()
    const { currentPage, setCurrentPage } = useContext(PageContext);
    const [loading, setLoading] = useState(false)

    const onChange = (e: any) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };
    const next = () => {
        allInfo['Page_consent']['value'] = value
        allInfo['Page_consent']['time'] = + new Date()
        if(!value){
            message.error("You need to answer all the questions to proceed.")
            return
        }
        if (value == 'I agree to participate in the research.') {
            setCurrentPage(currentPage+1)
        } else {
            setCurrentPage(14)
        }
    }
    return (
        <>
            <div className='div_des'>
                <span className='highlight'>University of Chicago Online Consent Form for Research Participation </span>
            </div>
            <div className='content'>
                <p className='list_item'>
                    <span className='highlight'>Study Number: </span> IRB25-0205
                </p>
                <p className='list_item'><span className='highlight'>Study Title:</span> Reading Documents and Writing an Essay to Decide on a Water Contamination Issue <br /><br />This is a consent form for research participation. It contains important information about this study and what to expect if you decide to participate. Your participation is voluntary.</p>
                <p className='list_item'>
                    <span className='highlight'>Purpose: </span>The purpose of this research is to investigate your thought process when completing a real-world decision task.
                </p>
                <div className='list_item'>
                    <span className='highlight'>Procedures and Time Required:</span> During this study, you will complete a series of steps listed below to <span className='highlight'>read some documents and write an essay</span> explaining your decision about a water contamination issue. The estimated total time to complete the study is approximately 20 minutes, though this may vary depending on individual pace. <span className='highlight'>Please stay free from distractions during this time.</span> Before the task, you will answer some basic demographic questions. The study consists of the following steps:
                    <p className='list_item' style={{ marginLeft: '15px', marginTop: '5px', marginBottom: '5px' }}> <span className='highlight'>1) Instructions:</span> You will begin by reading the study instructions and learning about the task.</p>
                    <p className='list_item' style={{ marginLeft: '15px', marginBottom: '5px' }}> <span className='highlight'>2) Task Scenario:</span> You will review the background scenario that introduces the decision you are expected to make. </p>
                    <p className='list_item' style={{ marginLeft: '15px', marginBottom: '5px' }}> <span className='highlight'>3) Main Task - Reading Documents and Writing an Essay:</span> <span className='highlight'>Within a 10-minute time frame</span>, on a single page, you will use the embedded tool(s) provided in this interface to explore information until you feel confident in your decision, and you will write an essay of your decision, reasoning, and deliberation process. <span className='highlight'>Please stay free from distractions during this time.</span> </p>
                    <p className='list_item' style={{ marginLeft: '15px', marginBottom: '5px' }}> <span className='highlight'>4) Follow-up questions:</span> You will answer a set of questions about the task. </p>
                </div>
                <p className='list_item'>
                    <span className='highlight'>Eligibility:</span> 1) Above 18 years old; 2) Proficiency in reading and writing in English; 3) Do not have a disability in reading or cognitive impairment that affects decision-making ability; 4) Use <span className='highlight'>a desktop or a laptop</span> (as opposed to cell phones to ensure the desired rendering of the interface) for participating in the study.
                </p>
                <p className='list_item'>
                    <span className='highlight'>Incentives:</span> You will be paid <span className='highlight'>the amount listed on the Prolific study page</span> upon completing the entire study. If you choose to withdraw from the study at any point, you will no longer receive any compensation for participating in the study.
                </p>
                <p className='list_item'>
                    <span className='highlight'>Risks and Benefits:</span> Your participation in this study does not involve any risk to you beyond those associated with completing a personality survey, including boredom or excessive introspection. Although participating in the research may not directly benefit you, the study will help us learn how to better design robots as well as their behavior for use.
                </p>
                <p className='list_item'>
                    <span className='highlight'>Confidentiality:</span> Any data collected during the study will be stored and protected in a secure cloud platform hosting our study website. Study data will be anonymized and accessible only to the UChicago research team. If the data is later released for research purposes, it will be fully anonymized and will not contain any identifiable information. If you decide to withdraw from this study at any point, all data already collected will be destroyed. Following the conclusion of the experiment, all data retained for analysis will also be carefully destroyed.
                </p>
                <p className='list_item'>
                    <span className='highlight'>Contacts & Questions:</span> If you have questions or concerns about the study, you can contact: Jiayin Zhi, PhD student, Department of Computer Science, University of Chicago, jzhi@uchicago.edu. If you have any questions about your rights as a participant in this research, feel you have been harmed, or wish to discuss other study-related concerns with someone who is not part of the research team, you can contact the University of Chicago Social & Behavioral Sciences Institutional Review Board (IRB) Office by phone at (773) 702-2915, or by email at sbs-irb@uchicago.edu.
                </p>
                <p className='list_item'>
                    <span className='highlight'>Consent:</span> Participation is voluntary. Refusal to participate or withdrawing from the research will involve no penalty or loss of benefits to which you might otherwise be entitled.
                </p>
                <p className='list_item'>
                    By clicking “Agree” below, you confirm that you have read the consent form, <span className='highlight'>meet all the eligibility criteria</span> and agree to participate in the research. Please print or save a copy of this page for your records.
                </p>

            </div>
            <div className='select'>
                <Radio.Group
                    style={style}
                    onChange={onChange}
                    value={value}
                    options={[
                        { value: 'I agree to participate in the research.', label: 'I agree to participate in the research.' },
                        { value: 'I do NOT agree to participate in the research', label: 'I do NOT agree to participate in the research' },
                    ]}
                />
            </div>
            <div className='page-btn'>
                <CountButton loading={loading} countdownTime={0} onAction={next} />
            </div>
        </>

    )
}
