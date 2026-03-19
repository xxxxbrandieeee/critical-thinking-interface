import React, { useContext, useState } from 'react'
import './Page_evaluation.css'
import allInfo from '../data.js'
import PageContext from '../PageContext.ts';
import { produce } from 'immer'
import { Button, Checkbox, message, Select, Table, type TableColumnsType } from 'antd';
import CountButton from './Countbtn.tsx';
import {shuffleArray} from '../utils.ts'
const countdownTime=1

allInfo['Page_evaluation'] = {}

interface DataType {
  key: React.Key;
  one: string;
  info: any;
}

const init_data: DataType[] = [
  {
    key: '1',
    one: 'Map of Bryn Bower indicating the contaminated areas',
    info: {}
  },
  {
    key: '2',
    one: 'A leaked confidential Hallman document that estimates cleanup costs',
    info: {}
  },
  {
    key: '3',
    one: 'A newspaper article describing the tumultuous townhall meeting',
    info: {}
  },
  {
    key: '4',
    one: 'Pamphlet of the Clean Bryn Bower Initiative (CBBl)',
    info: {}
  },
  {
    key: '5',
    one: 'EPA brochure on the toxicity of Exhaustluoran',
    info: {}
  },
  {
    key: '6',
    one: 'Interview with David Hallman Sr., founder of Hallman Inc., on his 90th birthday',
    info: {}
  }, 
  {
    key: '7',
    one: 'Resolution of the Southern Illinois Chapter of the Chemical Workers Union (CWU)',
    info: {}
  }
];

const data=shuffleArray([...init_data])


export default function Page_evaluation() {
  const { setCurrentPage ,currentPage} = useContext(PageContext);
  const [dataSource, setDataSource] = useState(data)
  const [curcount, setCurcount] = useState(1)

  const next = () => {
    for (const element of dataSource) {
      if(Object.keys(element.info).length==0){
      message.error("You need to answer all the questions to proceed.")
        return
      }
      if(!element.info.two){
        if(!element.info.three||!element.info.four||!element.info.five){
          message.error("You need to answer all the questions to proceed.")
          return
        }
      }
      // if(element.info.three||element.info.four||element.info.five){
      //   if(!element.info.two){
      //     message.error("You need to select at least one document to proceed：")
      //     return
      //   }
      // }
    }
  
    allInfo['Page_evaluation'].dataSource = dataSource
    allInfo['Page_evaluation'].time = +new Date()
    setCurrentPage(currentPage+1)
  }


  const handleChange = (value, key, index) => {
    console.log(value, key, index);
    const arr = produce(dataSource, (draft) => {
      draft[index].info[key] = value
    })
    setDataSource(arr)
    if ((index + 2) > curcount) {
      setCurcount(index + 2)
    }
  }

  const handleCheckboxChange = (e, row, index) => {
    console.log(1111, e.target.checked, row, index);
    const arr = produce(dataSource, (draft) => {
      draft[index].info = {
        two: e.target.checked
      }
    })
    setDataSource(
      arr
    )
     if ((index + 2) > curcount) {
      setCurcount(index + 2)
    }
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Document Title',
      dataIndex: 'one',
      width:400,
    },
    {
      title: "I didn't read this.",
      dataIndex: 'two',
      width:200,
      render: (text: string, row, index) => {
        return <Checkbox checked={dataSource[index].info.two} onChange={(e) => handleCheckboxChange(e, row, index)}></Checkbox>
      },
    },
    {
      title: 'Relevance',
      dataIndex: 'three',
      render: (text, row, index) => {
        return <Select
          style={{ width: '150px' }}
          disabled={dataSource[index].info.two}
          value={dataSource[index].info.three}
          onChange={(value) => { handleChange(value, 'three', index) }}
          options={[
            { value: 'Relevant', label: 'Relevant' },
            { value: 'Mixed', label: 'Mixed' },
            { value: 'Irrelevant', label: 'Irrelevant' },
            { value: "I don't know", label: "I don't know" },
          ]}
        />
      }
    },
    {
      title: 'Trustworthiness	',
      dataIndex: 'four',
      render: (text, row, index) => {
        return <Select
          style={{ width: '150px' }}
          disabled={dataSource[index].info.two}
          value={dataSource[index].info.four}
          onChange={(value) => { handleChange(value, 'four', index) }}
          options={[
            { value: 'Trustworthy', label: 'Trustworthy' },
            { value: 'Mixed', label: 'Mixed' },
            { value: 'Untrustworthy', label: 'Untrustworthy' },
            { value: "I don't know", label: "I don't know" },
          ]}
        />
      }
    },
    {
      title: 'Stance',
      dataIndex: 'five',
      render: (text, row, index) => {
        return <Select
          style={{ width: '150px' }}
          disabled={dataSource[index].info.two}
          value={dataSource[index].info.five}
          onChange={(value) => { handleChange(value, 'five', index) }}
          options={[
            { value: 'Pro', label: 'Pro' },
            { value: 'Neutral', label: 'Neutral' },
            { value: 'Con', label: 'Con' },
            { value: "I don't know", label: "I don't know" },
          ]}
        />
      }
    },
  ];


  return (
    <div className='Page_evaluation_content'>
      <div className='Page_evaluation_title instruction'>
        <span className='highlight'>[Evaluating Each Document]</span> For each document, you are asked to evaluate its <span className='highlight'>Relevance, Trustworthiness, and Stance </span>in relation to the decision regarding the proposal made by Hallman. 
        <p className='Page_evaluation_item'>
          ● <span className='highlight'>Relevance</span> refers to how relevant the document is for making the decision.
        </p>
        <p className='Page_evaluation_item'>
          ● <span className='highlight'>Trustworthiness</span> refers to  how credible and reliable you find the information presented in the document. 
        </p>
        <p className='Page_evaluation_item'>
          ● <span className='highlight'>Stance</span> indicates the document's position regarding the proposal: <span className='highlight'>Pro</span> means it supports the proposal, <span className='highlight'>Neutral or No Clear Stance </span>means it does not take a clear side, and  <span className='highlight'>Con</span> means it opposes the proposal.
        </p>
      </div>

      <Table<DataType>
        columns={columns}
        pagination={false}
        dataSource={data.slice(0, curcount)}
      />
      <CountButton countdownTime={countdownTime} onAction={next} />
    </div>
  )
}
