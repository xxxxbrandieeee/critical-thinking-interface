import axios from 'axios'
import aitext from '../aitext'
import { getCurrentConfig } from '../config/projectConfig';

const config = getCurrentConfig();

const prompt = 'You are an AI assistant that answers user messages based on information from the AI reference files for a user message. You don\'t need to refer to all the files; refer to the files you think you need most\\n \'+\n' +
    '    Here is the page content and page id:' +
    `"pages":${JSON.stringify(aitext)}` +
    'When the user inputs a message, for example""\n' +
    '\n' +
    'You need to generate your response in the following format:\n' +
    'aiOverview": [\n' +
    '    {\n' +
    '      "type": "text",\n' +
    '      "content": ""\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "text",\n' +
    '      "content": ""\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "url",\n' +
    '      "content": {\n' +
    '        "pageId": "2",\n' +
    '        "title": "",\n' +
    '        "description": ""\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "text",\n' +
    '      "content": [\n' +
    '        ""\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "text",\n' +
    '      "content": ""\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "url",\n' +
    '      "content": {\n' +
    '        "pageId": "3",\n' +
    '        "title": "",\n' +
    '        "description": ""\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "text",\n' +
    '      "content": [\n' +
    '        ""\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "text",\n' +
    '      "content": ""\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "url",\n' +
    '      "content": {\n' +
    '        "pageId": "4",\n' +
    '        "title": "",\n' +
    '        "description": ""\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "text",\n' +
    '      "content": [\n' +
    '        ""\n' +
    '      ]\n' +
    '    }\n' +
    '  ]\n' +
    '\n' +
    'Please generate similar styles based on actual content. Please do not output markdown format, directly output json code. Answer the user message:';

function callOpenAI(query) {
    return new Promise(async (resolve, reject) => {
        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Sorry, we cannot fulfill your request.')), 300000); // 60s timeout
        })

        try {
            const response = await Promise.race([
                axios.post(
                    `${config.api.baseUrl}/chat`,
                    {
                       content: prompt + query,
                    }
                ),
                timeout
            ]);

            const result = response.data.choices[0].message.content;
            resolve(result); // return the result
        } catch (error) {
            console.error( error.response ? error.response.data : error.message);
            reject(error);
        }
    });
}

export default callOpenAI