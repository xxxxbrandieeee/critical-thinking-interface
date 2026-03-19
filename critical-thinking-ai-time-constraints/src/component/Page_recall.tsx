import React, { useContext, useEffect, useState } from 'react'
import './Page_recall.css'
import { Button, Form, Input, message, Radio, type RadioChangeEvent } from 'antd'
import allInfo from '../data.js'
import PageContext from '../PageContext';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CountButton from './Countbtn';
const countdownTime = 1

allInfo['Page_recall'] = {}


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

export default function Page_recall() {
    const { setCurrentPage ,currentPage} = useContext(PageContext);
    const [form1] = Form.useForm();
    const [form] = Form.useForm();

    useEffect(() => {
        const pasteHandler = (e: ClipboardEvent) => {
            e.preventDefault();
        }
        document.addEventListener('paste', pasteHandler);
        return () => {
            document.removeEventListener('paste', pasteHandler);
        }
    }, [])

    const next = () => {
        console.log(1111, form.getFieldsValue());
        if (!form.getFieldsValue() || !form.getFieldsValue().names) {
            message.error("You need to answer all the questions to proceed.")
            return
        }
        const arr = form.getFieldsValue().names.filter((item: any) => item)
        if (arr.length !== form.getFieldsValue().names.length || !arr.length) {
            message.error("You need to answer all the questions to proceed.")
            return
        }
        const arr2 = form1.getFieldsValue().names1?.filter((item: any) => item) || []


        allInfo['Page_recall']['recall'] = arr
        allInfo['Page_recall']['recall2'] = arr2
        allInfo['Page_recall']['time'] = + new Date()

        console.log(allInfo);
        setCurrentPage(currentPage+1)
    }
    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };
    return (
        <div className='Page_recall_content'>
            <p className='Page_recall_title instruction'>
                <span className='highlight'>[Summarizing Documents You Recall] List any document(s) in the task you can recall.</span> For each one, <span className='highlight'>summarize its main idea or key message in one sentence</span> to clearly convey its core point. Click the “Add a description for a document” button to enter your answer for each document separately.
                <p className='Page_recall_title_desc'>
                    <span className='highlight'>Please note:</span> This question is to help understand what information you retained from the task. Thus, pasting is disabled for this question to encourage original responses based on your memory. We appreciate your time and understanding.
                </p>
            </p>
            <Form
                name="dynamic_form_item"
                {...formItemLayout}
                form={form}
                onFinish={onFinish}
                style={{ maxWidth: 1100 }}
            >
                <Form.List
                    name="names"
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <Form.Item
                                    {...formItemLayout}
                                    required={false}
                                    key={field.key}

                                >
                                    <Form.Item
                                        {...field}
                                        noStyle
                                    >
                                        <Input.TextArea
                                            showCount
                                            maxLength={200}
                                            rows={2} placeholder="Describe a document you remember by summarizing its main idea or key message in one sentence." style={{ width: '80%' }} />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => remove(field.name)}
                                    />
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '80%' }}
                                    icon={<PlusOutlined />}
                                >
                                    Add a description for a document
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                {/* <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item> */}
            </Form>

            <p className='Page_recall_title' style={{ marginLeft: '10px', marginRight: '10px' }}>
                <span className='highlight'>(Optional) Bonus Question:</span> For each document you remember, <span className='highlight'>write down as many details</span> as you can recall. Try to include facts such as what happened, why or how it happened, when and where it occurred, and who was involved. You can get up to a <span className='highlight'>$1</span> bonus for high-quality response. Click the “Add a description for a document” button to enter your answer for each document separately.
            </p>

            <Form
                name="dynamic_form_item"
                {...formItemLayout}
                form={form1}
                style={{ maxWidth: 1100 }}
            >
                <Form.List
                    name="names1"
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <Form.Item
                                    {...formItemLayout}
                                    required={false}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        noStyle
                                    >
                                        <Input.TextArea
                                            rows={3} placeholder='Describe a document by writing down as many details as you can remember.'
                                            style={{ width: '80%' }} />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => remove(field.name)}
                                    />
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '80%' }}
                                    icon={<PlusOutlined />}
                                >
                                    Add a description for a document
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

            </Form>

            <CountButton countdownTime={countdownTime} onAction={next} />
        </div>
    )
}
