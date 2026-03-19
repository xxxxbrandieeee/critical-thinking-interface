import React, { useContext, useState } from 'react';
import './Page_comprehension.css';
import { Button, message, Radio, type RadioChangeEvent } from 'antd';
import allInfo from '../data.js';
import PageContext from '../PageContext.js';
import CountButton from './Countbtn.js';
import { shuffleArray } from '../utils.js';
import { Page_comprehension } from '../pageInfo';
const countdownTime=1

allInfo['Page_comprehension'] = {};

const new_data=shuffleArray([...Page_comprehension.data])


const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: '30px',
};

export default function PageComprehension() {
    const [data, setData] = useState(new_data);
    const { setCurrentPage , currentPage} = useContext(PageContext);

    const handleChange = (index: number, e: RadioChangeEvent) => {
        const newData = [...data];
        newData[index].value = e.target.value;
        setData(newData);
    };

    const next = () => {
        const allAnswered = data.every((item) => item.value !== '');
        if (!allAnswered) {
            message.error('You need to answer all the questions to proceed.');
            return;
        }
        allInfo['Page_comprehension'].info = data.map((item) => ({
            title: item.title,
            answer: item.value,
        }));
        allInfo['Page_comprehension']['time'] = +new Date();
        console.log(allInfo);
        setCurrentPage(currentPage+1);
    };

    return (
        <div className='Page_comprehension_content'>
            <div className='instruction'>
                <span className='highlight'>[Checking the Following Statements]</span> Please read each statement below carefully. Based on the documents you read, decide whether each statement is{' '}
                <span className='highlight'>Right</span> or <span className='highlight'>Wrong</span>.
            </div>
            {data.map((item, index) => (
                <div key={index}>
                    <p className='Page_comprehension_item'>{item.title}</p>
                    <Radio.Group
                        style={style}
                        onChange={(e) => handleChange(index, e)}
                        value={item.value}
                        options={item.option}
                    />
                </div>
            ))}
            <CountButton countdownTime={countdownTime} onAction={next} />
        </div>
    );
}