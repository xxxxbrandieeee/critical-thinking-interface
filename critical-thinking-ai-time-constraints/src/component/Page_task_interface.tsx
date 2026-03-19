import React, { useRef, useContext, useEffect, useMemo, useState, useLayoutEffect } from 'react'
import './Page_task_interface.css'
import { Input, message, Select } from 'antd';
import aidocument from '../aidocument.js';
import allInfo from '../data.js'
import AIChat from './AIChat.js';
import PageContext from '../PageContext.js';
const { TextArea } = Input;
import CountButton from './Countbtn.js';
import axios from 'axios';
import { getCurrentConfig } from '../config/projectConfig.js';

// Get current config
const config = getCurrentConfig();
const countdownTime = config.Page_task_interface.countdownTime;




allInfo['Page_task_interface'] = {}
allInfo['Page_task_interface'].document = {};
allInfo['Page_task_interface'].essay = {};
allInfo['Page_task_interface'].ai = {};
allInfo['Page_task_interface']['stop_input_time'] = []

const documentArr = [
    { value: 1, label: 'Scenario and Task' },
    { value: 2, label: 'Map of Bryn Bower indicating the contaminated areas' },
    { value: 3, label: 'A leaked confidential Hallman document that estimates cleanup costs' },
    { value: 4, label: 'A newspaper article describing the tumultuous townhall meeting' },
    { value: 5, label: 'Pamphlet of the Clean Bryn Bower Initiative (CBBI)' },
    { value: 6, label: 'EPA brochure on the toxicity of Exafluoran' },
    { value: 7, label: 'Interview with David Hallman Sr., founder of Hallman Inc., on his 90th birthday' },
    { value: 8, label: 'Resolution of the Southern Illinois Chapter of the Chemical Workers Union (CWU)' },
]

const documentType: any = documentArr.reduce((pre, cur) => {
    pre[cur.value] = cur.label
    return pre
}, {} as any)



export default function Page_task_interface() {

    const [btnArr, setBtnArr] = useState([])
    const [value, setValue] = useState()
    const { setCurrentPage, currentPage } = useContext(PageContext);
    const isBlueRef = useRef<any>(false)
    const [loading, setLoading] = useState(false)
    const [time, setTime] = useState(0)
    const isInKnownAreaRef = useRef(false)

    // Initial state: for 'first' mode, AI should be enabled initially; for 'last' mode, disabled initially
    const [disabledAi, setDisabledAi] = useState(
        config.aiTool.availability === 'last' || config.aiTool.availability === 'none'
    )


    const handleChange = (v: string) => {
        if (!allInfo['Page_task_interface'].document[`${v}_look`]) {
            allInfo['Page_task_interface'].document[`${v}_look`] = [
                {
                    start_time: +new Date(),
                }
            ]
        } else {
            allInfo['Page_task_interface'].document[`${v}_look`].push(
                {
                    start_time: +new Date(),
                }
            )
        }
        if (allInfo['Page_task_interface'].document[`${value}_look`]) {
            const len = allInfo['Page_task_interface'].document[`${value}_look`].length
            allInfo['Page_task_interface'].document[`${value}_look`][len - 1] = {
                ...allInfo['Page_task_interface'].document[`${value}_look`][len - 1],
                end_time: +new Date(),
            }
        }

        setValue(v)
    };

    const handBtnClick = async (num: number) => {
        if (!btnArr.includes(num)) {
            const arr = [...btnArr]
            arr.push(num)
            if (arr.length == config.Page_task_interface.buttonCount) {
                // Show AI reminder message (if configured)
                if (config.Page_task_interface.aiReminderMessage) {
                    message.warning(config.Page_task_interface.aiReminderMessage)
                }
                allInfo['Page_task_interface'].three_btn_click_end_time = +new Date()
            }
            setBtnArr(arr)
        }
    }

    useEffect(() => {
        // Observe whether the end element appears in the viewport
        const end = document.querySelector(`.end_${value}`)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!allInfo['Page_task_interface'].document[`${value}_scroll`]) {
                        allInfo['Page_task_interface'].document[`${value}_scroll`] = {
                            title: documentType[value],
                            time: +new Date()
                        }
                    }
                    observer.disconnect()
                }
            })
        })
        if (end) {
            observer.observe(end)
        }

        const pastefn = (event) => {
            // Get pasted content
            let clipboardData = event.clipboardData || window.clipboardData;
            let pastedData = clipboardData.getData('text');
            if (isBlueRef.current) {
                if (allInfo['Page_task_interface'].essay.copy_text) {
                    allInfo['Page_task_interface'].essay.copy_text.push(pastedData)
                } else {
                    allInfo['Page_task_interface'].essay.copy_text = [pastedData]
                }
            }
        }

        document.addEventListener('paste', pastefn);

        return () => {
            observer.disconnect()
            document.removeEventListener('paste', pastefn);
        }
    }, [value])

    const isShow = useMemo(() => {
        // disable button validation
        // return true
        return btnArr.length === config.Page_task_interface.buttonCount
    }, [btnArr])

    useLayoutEffect(() => {
        if (isShow) {
            setTime(countdownTime)
        }
    }, [isShow])

    // Countdown logic, updates the time variable
    useEffect(() => {
        if (!isShow) return;

        const timer = setInterval(() => {
            setTime(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isShow])

    // Watch countdown time, enable/disable AI tool based on AI config
    useEffect(() => {
        if (!isShow || !config.aiTool.enabled || config.aiTool.availability === 'none') return;

        // Ensure time has been properly initialized (not the initial value 0)
        if (time === 0 && isShow) return;

        const totalSeconds = countdownTime;
        const { availability, duration } = config.aiTool;
        const aiDurationSeconds = duration || 0;
        // Calculate elapsed time
        const elapsedTime = totalSeconds - time;

        if (availability === 'first') {
            // Available for the first N seconds, disabled after time is up
            // When elapsed time >= aiDurationSeconds, disable AI
            if (elapsedTime >= aiDurationSeconds && !disabledAi) {
                setDisabledAi(true);
                allInfo['Page_task_interface'].timeout_essay_text = allInfo['Page_task_interface'].essay?.bottom?.text;
                // Record AI disabled time
                if (!allInfo['Page_task_interface'].ai.disabledTime) {
                    allInfo['Page_task_interface'].ai.disabledTime = +new Date();
                }
            }
        } else if (availability === 'last') {
            // Available for the last N seconds, enabled after time is up
            // When elapsed time >= (totalSeconds - aiDurationSeconds), enable AI
            const aiStartElapsedTime = totalSeconds - aiDurationSeconds;

            // Enable AI after time is up
            if (elapsedTime >= aiStartElapsedTime && disabledAi) {
                setDisabledAi(false);
                allInfo['Page_task_interface'].timeout_essay_text = allInfo['Page_task_interface'].essay?.bottom?.text;
                // Record AI enabled time
                if (!allInfo['Page_task_interface'].ai.enabledTime) {
                    allInfo['Page_task_interface'].ai.enabledTime = +new Date();
                }
            }
        }
    }, [time, isShow, config.aiTool, countdownTime])

    const TLCONTENT = useMemo(() => {
        const data = aidocument[value]
        if (!data) return
        return <div className='tcl_content'>
            <div className='tcl_title'>
                {data.title}
            </div>
            <div className='tcl_author'>
                {data.author}
            </div>
            {
                data.contents.map(item => {
                    if (item.type === 'image') {
                        return <img className='tcl_img' src={`/${item.content}`} alt="" />
                    } else if (item.type === 'text') {
                        return <div className='tcl_text' dangerouslySetInnerHTML={{ __html: item.content }}></div>
                    } else if (item.type === 'empty') {
                        return <div className='tcl_empty'></div>
                    } else if (item.type === 'list') {
                        return <ul>
                            {
                                item.content.map((ele: string) => {
                                    return <li className='tcl_li'>
                                        {ele}</li>
                                })
                            }
                        </ul>
                    }
                })
            }
            <div className={`end end_${value}`}></div>
        </div>
    }, [value])

    const handTopLMouseEnter = () => {
        if (!isShow) return
        if (!isInKnownAreaRef.current) {
            // Leaving the rest area
            handleRestAreaLeave()
        }
        isInKnownAreaRef.current = true
        console.log('handTopLMouseEnter');

        if (!allInfo['Page_task_interface']['top_l']) {
            allInfo['Page_task_interface']['top_l'] = [
                {
                    type: "enter",
                    time: +new Date()
                }
            ]
        } else {
            allInfo['Page_task_interface']['top_l'].push({
                type: "enter",
                time: +new Date()
            })
        }
    }

    const handTopLMouseLeave = () => {
        if (!isShow) return

        console.log('handTopLMouseLeave');

        if (!allInfo['Page_task_interface']['top_l']) {
            allInfo['Page_task_interface']['top_l'] = [
                {
                    type: "leave",
                    time: +new Date()
                }
            ]
        } else {
            allInfo['Page_task_interface']['top_l'].push({
                type: "leave",
                time: +new Date()
            })
        }
        isInKnownAreaRef.current = false
        // Entering the rest area
        handleRestAreaEnter()
    }

    const handTopRMouseEnter = () => {
        if (!isShow) return

        if (!isInKnownAreaRef.current) {
            // Leaving the rest area
            handleRestAreaLeave()
        }
        isInKnownAreaRef.current = true
        console.log('handTopRMouseEnter');

        if (!allInfo['Page_task_interface']['top_r']) {
            allInfo['Page_task_interface']['top_r'] = [
                {
                    type: "enter",
                    time: +new Date()
                }
            ]
        } else {
            allInfo['Page_task_interface']['top_r'].push({
                type: "enter",
                time: +new Date()
            })
        }
    }
    const handTopRMouseLeave = () => {
        if (!isShow) return

        console.log('handTopRMouseLeave');

        if (!allInfo['Page_task_interface']['top_r']) {
            allInfo['Page_task_interface']['top_r'] = [
                {
                    type: "leave",
                    time: +new Date()
                }
            ]
        } else {
            allInfo['Page_task_interface']['top_r'].push({
                type: "leave",
                time: +new Date()
            })
        }
        isInKnownAreaRef.current = false
        // Entering the rest area
        handleRestAreaEnter()
    }

    const handBottomMouseEnter = () => {
        if (!isShow) return

        if (!isInKnownAreaRef.current) {
            // Leaving the rest area
            handleRestAreaLeave()
        }
        console.log("handBottomMouseEnter")
        isInKnownAreaRef.current = true
        if (!allInfo['Page_task_interface']['bottom']) {
            allInfo['Page_task_interface']['bottom'] = [
                {
                    type: "enter",
                    time: +new Date()
                }
            ]
        } else {
            allInfo['Page_task_interface']['bottom'].push({
                type: "enter",
                time: +new Date()
            })
        }
    }

    const handBottomMouseLeave = () => {
        if (!isShow) return

        console.log("handBottomMouseLeave")
        if (!allInfo['Page_task_interface']['bottom']) {
            allInfo['Page_task_interface']['bottom'] = [
                {
                    type: "leave",
                    time: +new Date()
                }
            ]
        } else {
            allInfo['Page_task_interface']['bottom'].push({
                type: "leave",
                time: +new Date()
            })
        }
        isInKnownAreaRef.current = false
        // Entering the rest area
        handleRestAreaEnter()
    }

    const handleRestAreaEnter = () => {
        if (!isShow) return

        console.log("handleRestAreaEnter")

        if (!allInfo['Page_task_interface']['rest_area']) {
            allInfo['Page_task_interface']['rest_area'] = [
                {
                    type: "enter",
                    time: +new Date()
                }
            ]
        } else {
            allInfo['Page_task_interface']['rest_area']?.push({
                type: "enter",
                time: +new Date()
            })
        }
    }

    const handleRestAreaLeave = () => {
        if (!isShow) return

        console.log("handleRestAreaLeave")
        if (!allInfo['Page_task_interface']['rest_area']) {
            allInfo['Page_task_interface']['rest_area'] = [
                {
                    type: "enter",
                    time: allInfo['Page_task_interface'].three_btn_click_end_time
                }
            ]
        }
        allInfo['Page_task_interface']['rest_area']?.push({
            type: "leave",
            time: +new Date()
        })
    }

    const timer = useRef<any>(null)

    const handBottomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(33333, allInfo['Page_task_interface']['input_time']);
        if (timer.current) {
            clearTimeout(timer.current)
        }
        if (allInfo['Page_task_interface']['stop_input_time'].at(-1)?.type == 'start') {
            allInfo['Page_task_interface']['stop_input_time'].push({
                type: "end",
                time: +new Date()
            })
        }
        timer.current = setTimeout(() => {
            if (allInfo['Page_task_interface']['input_time'].at(-1).type !== 'end') {
                allInfo['Page_task_interface']['input_time'].push({
                    type: "end",
                    time: +new Date()
                })
            }
            console.log(33333333, '3 seconds idle');

            if (allInfo['Page_task_interface']['stop_input_time'].at(-1)?.type !== 'start') {
                allInfo['Page_task_interface']['stop_input_time'].push({
                    type: "start",
                    time: +new Date()
                })
            }
        }, 3000);
        if (allInfo['Page_task_interface']['input_time'].at(-1).type == "end") {
            allInfo['Page_task_interface']['input_time'].push({
                type: "start",
                time: +new Date()
            })
        }

        if (!allInfo['Page_task_interface'].essay.bottom) {
            allInfo['Page_task_interface'].essay.bottom = {
                text: e.target.value,
                start_time: +new Date()
            }
        } else {
            allInfo['Page_task_interface'].essay.bottom.text = e.target.value
        }
    }

    const handFocus = () => {
        isBlueRef.current = true
        if (!allInfo['Page_task_interface']['input_time']) {
            allInfo['Page_task_interface']['input_time'] = [
                {
                    type: "start",
                    time: +new Date()
                }
            ]
        } else {
            allInfo['Page_task_interface']['input_time'].push({
                type: "start",
                time: +new Date()
            })
        }
    }

    const handBlur = () => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        isBlueRef.current = false
        if (allInfo['Page_task_interface']['input_time'].at(-1).type !== 'end') {
            allInfo['Page_task_interface']['input_time'].push({
                type: "end",
                time: +new Date()
            })
        }
        console.log(99999);

        if (allInfo['Page_task_interface']['stop_input_time'].at(-1)?.type == 'start') {
            allInfo['Page_task_interface']['stop_input_time'].push({
                type: "end",
                time: +new Date()
            })
        }

    }

    const next = async () => {
        if(config.Page_task_interface.VerifyThatTheEssayIsEmpty && !allInfo['Page_task_interface'].essay.bottom?.text) {
            message.error("You need to write your essay to proceed.")
            return
        }
        if (allInfo['Page_task_interface']['rest_area']?.at(-1).type !== "leave") {
            allInfo['Page_task_interface']['rest_area']?.push({
                type: "leave",
                time: +new Date()
            })
        }
        // if (btnArr.length != 3) {
        //     message.error("You need to answer all the questions to proceed.")
        //     return
        // }
        // if (!allInfo['Page_task_interface']?.essay?.bottom) {
        //     message.error("You need to answer all the questions to proceed.")
        //     return
        // }
        // if (allInfo['Page_task_interface'].ai.num === 20 || allInfo['Page_task_interface'].ai.num == undefined) {
        //     message.error("You need to ask at least one question to the AI Chatbot to proceed.")
        //     return
        // }

        if (allInfo['Page_task_interface'].essay.bottom) {
            allInfo['Page_task_interface'].essay.bottom.end_time = +new Date()
        }
        if (allInfo['Page_task_interface'].document[`${value}_look`] && !allInfo['Page_task_interface'].document[`${value}_look`][allInfo['Page_task_interface'].document[`${value}_look`].length - 1].end_time) {
            allInfo['Page_task_interface'].document[`${value}_look`][allInfo['Page_task_interface'].document[`${value}_look`].length - 1].end_time = +new Date()
        }
        allInfo['Page_task_interface']['time'] = + new Date()
        try {
            let top_l_total_time = 0
            if (allInfo['Page_task_interface'].top_l) {
                for (let i = 1; i < allInfo['Page_task_interface'].top_l.length; i += 2) {
                    const enterTime = allInfo['Page_task_interface'].top_l[i - 1].time;
                    const leaveTime = allInfo['Page_task_interface'].top_l[i].time;
                    const stayTime = leaveTime - enterTime;
                    top_l_total_time += stayTime;
                }
            }
            allInfo['Page_task_interface'].top_l_total_time = top_l_total_time / 1000;
            let top_r_total_time = 0
            if (allInfo['Page_task_interface'].top_r) {
                for (let i = 1; i < allInfo['Page_task_interface'].top_r.length; i += 2) {
                    const enterTime = allInfo['Page_task_interface'].top_r[i - 1].time;
                    const leaveTime = allInfo['Page_task_interface'].top_r[i].time;
                    const stayTime = leaveTime - enterTime;
                    top_r_total_time += stayTime;
                }
            }
            allInfo['Page_task_interface'].top_r_total_time = top_r_total_time / 1000;
            let bottom_total_time = 0
            if (allInfo['Page_task_interface'].bottom) {
                for (let i = 1; i < allInfo['Page_task_interface'].bottom.length; i += 2) {
                    const enterTime = allInfo['Page_task_interface'].bottom[i - 1].time;
                    const leaveTime = allInfo['Page_task_interface'].bottom[i].time;
                    const stayTime = leaveTime - enterTime;
                    bottom_total_time += stayTime;
                }
            }
            allInfo['Page_task_interface'].bottom_total_time = bottom_total_time / 1000;
            let rest_area_total_time = 0
            if (allInfo['Page_task_interface'].rest_area) {
                for (let i = 1; i < allInfo['Page_task_interface'].rest_area.length; i += 2) {
                    const enterTime = allInfo['Page_task_interface'].rest_area[i - 1].time;
                    const leaveTime = allInfo['Page_task_interface'].rest_area[i].time;
                    const stayTime = leaveTime - enterTime;
                    rest_area_total_time += stayTime;
                }
            }
            allInfo['Page_task_interface'].rest_area_total_time = rest_area_total_time / 1000;
            let input_total_time = 0
            if (allInfo['Page_task_interface'].input_time) {
                for (let i = 1; i < allInfo['Page_task_interface'].input_time.length; i += 2) {
                    const enterTime = allInfo['Page_task_interface'].input_time[i - 1].time;
                    const leaveTime = allInfo['Page_task_interface'].input_time[i].time;
                    const stayTime = leaveTime - enterTime;
                    input_total_time += stayTime;
                }
            }
            allInfo['Page_task_interface'].input_total_time = input_total_time / 1000;
            let stop_input_total_time = 0
            if (allInfo['Page_task_interface'].stop_input_time) {
                for (let i = 1; i < allInfo['Page_task_interface'].stop_input_time.length; i += 2) {
                    const enterTime = allInfo['Page_task_interface'].stop_input_time[i - 1].time;
                    const leaveTime = allInfo['Page_task_interface'].stop_input_time[i].time;
                    const stayTime = leaveTime - enterTime;
                    stop_input_total_time += stayTime;
                }
            }
            allInfo['Page_task_interface'].stop_input_total_time = stop_input_total_time / 1000;
        } catch (error) {
            allInfo['Page_task_interface'].hover_total = "Error occurred while calculating total hover time"
            allInfo['Page_task_interface'].hover_error = error
        }
        console.log("allInfo", allInfo);
        setCurrentPage(currentPage + 1)
    }

    const handPageMouseEnter = () => {
        if (!isInKnownAreaRef.current) {
            handleRestAreaEnter()
        }
    }

    const handPageMouseLeave = () => {
        if (!isInKnownAreaRef.current) {
            handleRestAreaLeave()
        }
    }

    // AI enable/disable callback function
    const onAiEnableCallback = () => {
        allInfo['Page_task_interface'].timeout_essay_text = allInfo['Page_task_interface'].essay?.bottom?.text
        // No longer setting disabledAi state directly here; let useEffect calculate based on actual time
        // This avoids conflicts with state updates in useEffect
    }

    // Generate AI Chatbot description text
    const getAiChatbotDescription = () => {
        const { aiTool, taskTime } = config;

        if (!aiTool.enabled || aiTool.availability === 'none') {
            return null; // No AI tool
        }

        if (aiTool.availability === 'full') {
            return `<strong>[Using the AI Chatbot]</strong> This is the general <strong>AI Chatbot</strong> (a version of ChatGPT) that you are free to use, but not required to. You can use it to help answer questions about the documents provided and make a reasoned decision. <strong>The chatbot has access to all documents included in this task.</strong> You may ask it to answer questions about all or some of the documents, or help with anything else that might be useful along the way. Avoid entering any personally identifiable information when using the chatbot.`;
        } else if (aiTool.availability === 'first') {
            return `<strong>[Using the AI Chatbot]</strong> For the <strong>first <span class="red">${(aiTool.duration || 0) / 60} minutes</span></strong> of the task, this is the general <strong>AI Chatbot</strong> (a version of ChatGPT) that you are free to use, but not required to. <strong>After <span class="red">${(aiTool.duration || 0) / 60} minutes</span>,</strong> the AI chatbot will no longer be available for further conversation. You can use it to help answer questions about the documents provided and make a reasoned decision. <strong>The chatbot has access to all documents included in this task.</strong> You may ask it to answer questions about all or some of the documents, or help with anything else that might be useful along the way. Avoid entering any personally identifiable information when using the AI.`;
        } else if (aiTool.availability === 'last') {
            const waitTime = taskTime - (aiTool.duration || 0);
            return `<strong>[Using the AI Chatbot]</strong> After ${waitTime / 60} minutes, for the <strong>last <span class="red">${(aiTool.duration || 0) / 60} minutes</span></strong> of the task, this is the general <strong>AI Chatbot</strong> (a version of ChatGPT) that you are free to use, but not required to. You can use it to help answer questions about the documents provided and make a reasoned decision. <strong>The chatbot has access to all documents included in this task.</strong> You may ask it to answer questions about all or some of the documents, or help with anything else that might be useful along the way. Avoid entering any personally identifiable information when using the chatbot.`;
        }
    }

    return (
        <div className='Page_task_interface' onMouseEnter={handPageMouseEnter} onMouseLeave={handPageMouseLeave}>
            <div className='page_title'>
                <div className={`page_title_text ${!config.aiTool.enabled || config.aiTool.availability === 'none' ? 'full-width' : ''}`}>
                    <img src='/dot.png' className='page_title_img' />
                    Document Viewer
                </div>
                {config.aiTool.enabled && config.aiTool.availability !== 'none' && (
                    <div className='page_title_text'>
                        <img src='/start.png' className='page_title_img' />
                        AI Chatbot
                    </div>
                )}
            </div>
            <div className='p_top'>
                <div className={`top_l ${!config.aiTool.enabled || config.aiTool.availability === 'none' ? 'full-width' : ''}`} onMouseEnter={handTopLMouseEnter} onMouseLeave={handTopLMouseLeave}>
                    <div className='select_document'>
                        <span className='highlight select_text'>Select Document:</span>
                        <Select
                            style={{ minWidth: 120, width: "100%" }}
                            onChange={handleChange}
                            value={value}
                            disabled={!isShow}
                            options={documentArr}
                        />
                    </div>

                    {
                        !isShow ? <div className='desc_content desc_content_h'>
                            <p>
                                <span className='highlight'>[Using the Document Viewer]</span> This is a simple <span className='highlight'>Document Viewer</span> for you to read <span className='highlight'>potentially relevant</span> documents to make a decision about whether to accept Hallman’s proposal or not. Use the dropdown menu next to <span className='highlight'>“Select Document:”</span> to browse and open a document.
                            </p>
                            <div className={btnArr.includes(1) ? 'desc_btn btn_active yinying' : 'desc_btn yinying'} onClick={() => handBtnClick(1)}>
                                {
                                    btnArr.includes(1) ? 'I have confirmed that I understand.' : 'I understand'
                                }
                            </div>
                        </div> : TLCONTENT
                    }

                </div>
                {config.aiTool.enabled && config.aiTool.availability !== 'none' && (
                    <div className='top_r' onMouseEnter={handTopRMouseEnter} onMouseLeave={handTopRMouseLeave}>
                        {
                            !isShow ? <div className='desc_content desc_content_h'>
                                <p dangerouslySetInnerHTML={{ __html: getAiChatbotDescription() }} />

                                <div className={
                                    btnArr.includes(2) ? 'desc_btn btn_active yinying' : 'desc_btn yinying'
                                } onClick={() => handBtnClick(2)}>
                                    {btnArr.includes(2) ? 'I have confirmed that I understand.' : 'I understand'}
                                </div>
                            </div> : (
                                <>
                                    <AIChat
                                        disabledAi={disabledAi}
                                        value={value}
                                        setValue={setValue}
                                    />
                                </>
                            )
                        }
                    </div>
                )}
            </div>
            <div className='p_bottom' onMouseEnter={handBottomMouseEnter} onMouseLeave={handBottomMouseLeave}>
                <div className='p_bottom_btn'>
                    Your Essay
                </div>
                <div className='p_bottom_content'>
                    {
                        !isShow ? <div className='desc_content bottom_desc_content'>
                            <p>
                                <span className='highlight'>[Writing an Essay]</span> You are a member of the city council and are preparing a ten-minute statement to explain the deliberative process of your decision on whether the city should accept or reject Hallman’s proposal. After reading enough to feel confident in your decision, please prepare <span className='highlight'>an essay that describes your reasoning for your decision</span> in 1~3 paragraphs, <span className='highlight'>outlining your thoughts, weighing the pros and cons, and explaining your final decision.</span> Your argument should be based <span className='highlight'>exclusively</span> on information drawn from <span className='highlight'>some or all</span> the documents provided. You are encouraged to explain what documents you drew on, and why or how they informed your decision.
                            </p>
                            <div className={
                                btnArr.includes(config.Page_task_interface.buttonCount) ? 'desc_btn btn_active yinying' : 'desc_btn yinying'
                            } onClick={() => handBtnClick(config.Page_task_interface.buttonCount)}>
                                {btnArr.includes(config.Page_task_interface.buttonCount) ? 'I have confirmed that I understand.' : 'I understand'}
                            </div>
                        </div> : <TextArea
                            onBlur={handBlur}
                            onFocus={handFocus}
                            rows={9} placeholder="" onChange={handBottomChange} />
                    }
                </div>
            </div>
            <CountButton
                disabled={!isShow}
                isStart={isShow}
                trigger={true}
                countdownTime={countdownTime}
                currentTime={time}
                loading={loading}
                onAction={next}
                on5Callback={onAiEnableCallback}
                onFinish={next} />
        </div>
    )
}
