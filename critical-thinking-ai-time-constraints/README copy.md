# 本地启动说明

## 前端 

### 本地开发
 - 进入new-project目录 第一次执行 npm install (执行完毕项目new-project下面会有一个node_modules目录) 后续看到了这个目录可以不用npm install执行了
 - 执行 npm run dev 启动项目 启动成功后会看到 http://localhost:3009/ 这个地址，访问就可以点开

### 部署说明
进入new-project目录 第一次执行 npm install (执行完毕项目new-project下面会有一个node_modules目录)后 续看到了这个目录可以不用npm install执行了

 - 执行 npm run build 构建项目 构建成功后会在项目根目录下生成一个frontend目录

 - 部署时将frontend目录部署到服务器上 也就是上传到服务器某个路径下面。通过nginx绑定域名前端就可以访问了


## 后端部署 

### 本地开发
 - 进入backend目录下面 第一次执行 npm install (执行完毕项目backend下面会有一个node_modules目录) 后续看到了这个目录可以不用npm install执行了
 - 执行 npm run start 启动项目 启动成功后会看到 Server running on port 4001 这句话就代表成功

### 部署说明 

 - 服务器需要有node环境

 - 把这个目录下面的backend/server.js、backend/package.json 一并都上传到服务器上 也就是上传到服务器某个路径下面。**有些文件是本地测试运行生成的 可以忽略他们呢**

- 上传成功进入backend目录 执行 npm install (执行完毕项目backend下面会有一个node_modules目录) 后续看到了这个目录可以不用npm install执行了
- 执行 npm run pm2 就可以了。注意服务器和本地执行命令不同

## 收集的数据 

不管服务器还是本地。收集的数据都在backend目录下面。 会有一些project1-variation-type1 等类似文件，名称就是前端选择的项目名称



# 项目配置说明

本项目整合了8个不同的项目变体,通过全局配置文件可以轻松切换。

## 如何切换项目变体

打开文件 `src/config/projectConfig.ts`,修改 `CURRENT_PROJECT_VARIANT` 变量的值:

```typescript
// 当前使用的项目变体 - 修改这个变量来切换项目
export let CURRENT_PROJECT_VARIANT: ProjectVariant = 'continuous-access-insufficient';
```

### 随机模式（random）

将值设为 `'random'` 可开启随机分配模式：

```typescript
export let CURRENT_PROJECT_VARIANT: ProjectVariant = 'random';
```

- 用户首次访问时，系统会从 variants 变量中随机选择一个：

- 随机结果会存入 `sessionStorage`（key: `new_project_random_variant`），保证同一会话内变体不变
- 刷新页面或关闭标签页重新打开后，会重新随机分配
- `continuous-access-unconstrainted` 和 `no-access-unconstrainted` 两个测试变体不在随机池中

## 可用的项目变体

### 1. no-access-sufficient
- 总时长: 40分钟
- 任务时长: 30分钟
- AI工具: 无
- Page_task_interface倒计时: 1800秒(30分钟)
- 按钮数量: 2个

### 2. continuous-access-sufficient
- 总时长: 40分钟
- 任务时长: 30分钟
- AI工具: 全程可用
- Page_task_interface倒计时: 1800秒(30分钟)
- 按钮数量: 3个

### 3. late-access-sufficient
- 总时长: 40分钟
- 任务时长: 30分钟
- AI工具: 后10分钟可用
- Page_task_interface倒计时: 1800秒(30分钟)
- 按钮数量: 3个
- AI启用时间: 20分钟后
- 提示消息:
  - 过了1200秒后提示"It is a gentle reminder that the AI Chatbot is available to you for 10 minutes from now until the end of the task."
  - 过了1500秒后提示"It is a gentle reminder that the AI Chatbot is still available for 5 minutes until the end of the task."

### 4. early-access-sufficient
- 总时长: 40分钟
- 任务时长: 30分钟
- AI工具: 前10分钟可用
- Page_task_interface倒计时: 1800秒(30分钟)
- 按钮数量: 3个
- AI禁用时间: 10分钟后
- 提示消息:
  - 过了300秒后提示"It is a gentle reminder that the AI Chatbot is still available for 5 minutes."

### 5. no-access-insufficient
- 总时长: 20分钟
- 任务时长: 10分钟
- AI工具: 无
- Page_task_interface倒计时: 600秒(10分钟)
- 按钮数量: 2个

### 6. continuous-access-insufficient
- 总时长: 20分钟
- 任务时长: 10分钟
- AI工具: 全程可用
- Page_task_interface倒计时: 600秒(10分钟)
- 按钮数量: 3个

### 7. early-access-insufficient
- 总时长: 20分钟
- 任务时长: 10分钟
- AI工具: 前3.5分钟可用
- Page_task_interface倒计时: 600秒(10分钟)
- 按钮数量: 3个
- AI禁用时间: 3.5分钟后
- 提示消息:
  - 过了150秒后提示"It is a gentle reminder that the AI Chatbot is still available for 1 minutes."

### 8. late-access-insufficient
- 总时长: 20分钟
- 任务时长: 10分钟
- AI工具: 后3.5分钟可用
- Page_task_interface倒计时: 600秒(10分钟)
- 按钮数量: 3个
- AI启用时间: 6.5分钟后
- 提示消息:
  - 过了390秒后提示"It is a gentle reminder that the AI Chatbot is available to you for 3.5 minutes from now until the end of the task."
  - 过了480秒后提示"It is a gentle reminder that the AI Chatbot is still available for 2 minutes until the end of the task."


### 9. continuous-access-unconstrainted

### 10. no-access-unconstrainted

### 11. random


## 配置文件位置

- **主配置文件**: `src/config/projectConfig.ts`
- **使用配置的页面**:
  - `src/component/Page3.tsx` - 指导页面
  - `src/component/Page_task_interface.tsx` - 主任务页面
  - `src/component/Page_experience.tsx` - 反馈问卷页面
  - `src/component/AIChat.tsx` - AI聊天组件
  - `src/component/ai1.js` - AI调用模块

## 修改后的页面

### Page3 (指导页面)
- **Page3_1**: 根据配置显示不同的总时长(20/40分钟)和任务时长(10/30分钟)
- **Page3_2**: 根据配置显示不同的会议时间(10/30分钟)
- **Page3_4**: 根据配置显示不同的工具说明
  - 无AI工具
  - AI全程可用
  - AI前N分钟可用
  - AI后N分钟可用
- **Page3_5**: 根据是否有AI工具显示不同的写作说明

### Page_task_interface (主任务页面)
- **倒计时时间**: 根据配置自动设置(600秒或1800秒)
- **按钮数量**: 根据是否有AI工具显示2个或3个按钮
- **AI Chatbot区域**:
  - 无AI时不显示
  - 有AI时显示,并根据配置控制启用/禁用时间
- **AI描述文本**: 根据AI可用时间动态生成
- **提示消息**: 在点击完所有按钮后显示(如果配置了)
- **项目类型**: 自动使用配置的项目类型标识提交到API

### Page_experience (反馈问卷页面)
- **任务时长显示**: 根据配置显示10分钟或30分钟
- **第4个问题**: 根据是否有AI工具显示不同的问题
  - 有AI工具: How did you use the AI Chatbot to help you read the documents and make a reasoned decision? Please explain what you used it for, how it helped the process (if at all), and why you used it that way.
  - 无AI工具: How did you approach reading the documents and making a reasoned decision, and why? Please explain your strategy, what helped you most, and why you chose to approach the task in that way.

- **问题标题**: 保存到 allInfo 时也会根据配置使用不同的标题

## API配置

所有项目的API调用都已配置化,不再硬编码在代码中。

### API配置项

每个项目变体都包含以下API配置:

```typescript
api: {
  baseUrl: string;  // API基础URL
}
```

### 当前配置

所有8个项目变体使用相同的API配置:
- **baseUrl**: `https://server.uchi-study-participation.site`

### 使用API配置的文件

1. **AIChat.tsx** (`/chat` 接口)
   - 用户与AI聊天时调用
   - 使用 `config.api.baseUrl` 

2. **ai1.js** (`/chat` 接口)
   - AI Overview 功能调用
   - 使用 `config.api.baseUrl` 


### 如何修改API配置

如果需要修改API地址或类型参数:

1. 打开 `src/config/projectConfig.ts`
2. 找到对应的项目变体配置
3. 修改 `api` 对象中的值:

```typescript
'continuous-access-insufficient': {
  // ... 其他配置
  api: {
    baseUrl: 'https://your-new-api-url.com/api',  // 修改API地址
  },
}
```

### 注意事项

- 所有API调用都会自动使用配置的 `baseUrl` 
- 修改配置后需要重新启动开发服务器
- `projectType` 参数在 `Page_task_interface.projectType` 中配置,用于标识不同的项目变体

## 提示配置说明

本项目新增了详细的提示配置选项，方便您根据需要修改AI可用时间、提示时间等规则。

### 提示配置项

每个项目变体都包含以下提示配置:

```typescript
notifications: {
  // 任务剩余时间提示(秒) - 剩余多少秒时弹出
  taskReminderTimes?: number[];
  // 任务剩余时间提示消息
  taskReminderMessage?: string;
  // AI即将禁用提示时间(秒) - 过了多少秒后弹出，仅用于first模式
  aiDisableWarningTime?: number;
  // AI即将禁用提示消息
  aiDisableWarningMessage?: string;
  // AI即将启用提示时间(秒) - 过了多少秒后弹出，仅用于last模式
  aiEnableWarningTime?: number;
  // AI即将启用提示消息
  aiEnableWarningMessage?: string;
  // AI可用状态提示时间(秒) - 过了多少秒后弹出
  aiReminderTime?: number;
  // AI可用状态提示消息
  aiReminderMessage?: string;
};
```

### Page_task_interface 配置项

每个项目变体都包含以下 Page_task_interface 特定配置:

```typescript
Page_task_interface: {
  // 倒计时时间(秒)
  countdownTime: number;
  // 需要点击的按钮数量(有AI是3个,无AI是2个)
  buttonCount: number;
  // AI提示消息(当点击完所有按钮后显示)
  aiReminderMessage?: string;
  // AI回调触发时间(秒) - 剩余多少秒时触发on5Callback
  // 注意：此配置用于触发回调函数记录用户输入内容，不是控制按钮禁用的逻辑
  // 按钮禁用状态由aiTool.availability和aiTool.duration配置共同控制
  aiCallbackTime?: number;
  // 项目类型标识(用于API提交)
  projectType: string;
};
```

### 如何修改提示配置

打开 `src/config/projectConfig.ts` 文件，找到对应的项目变体配置，修改 `notifications` 对象中的值即可：

```typescript
'early-access-insufficient': {
  // ... 其他配置
  notifications: {
    // 任务剩余时间提示(秒) - 剩余多少秒时弹出
    taskReminderTimes: [300, 120],
    // 任务剩余时间提示消息
    taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
    // AI即将禁用提示时间(秒) - 过了多少秒后弹出，仅用于first模式
    aiDisableWarningTime: 6,
    // AI即将禁用提示消息
    aiDisableWarningMessage: 'AI Chatbot will be disabled in 1 minute',
    // AI可用状态提示时间(秒) - 过了多少秒后弹出
    aiReminderTime: 60,
    // AI可用状态提示消息
    aiReminderMessage: 'It is a gentle reminder that the AI Chatbot is still available for 1 minutes.',
  },
  Page_task_interface: {
    countdownTime: 600,
    buttonCount: 3,
    aiReminderMessage: 'It is a gentle reminder that the AI Chatbot is available to you for 3.5 minutes from now.',
    aiCallbackTime: 390, // 剩余390秒时触发回调
    projectType: 'early-access-insufficient',
  },
  // ... 其他配置
};
```

### 配置说明

- **taskReminderTimes**: 任务剩余时间提示数组，每个元素为秒数，表示在剩余多少秒时弹出提示
- **taskReminderMessage**: 任务剩余时间提示消息，`{minutes}` 占位符会被替换为实际的剩余分钟数
- **aiDisableWarningTime**: AI即将禁用前的提示时间（秒），表示过了多少秒后弹出提示，仅用于first模式
- **aiDisableWarningMessage**: AI即将禁用提示消息
- **aiEnableWarningTime**: AI即将启用前的提示时间（秒），表示过了多少秒后弹出提示，仅用于last模式
- **aiEnableWarningMessage**: AI即将启用提示消息
- **aiReminderTime**: AI可用状态提示时间（秒），表示过了多少秒后弹出提示
- **aiReminderMessage**: AI可用状态提示消息
- **aiCallbackTime**: AI回调触发时间（秒），表示剩余多少秒时触发on5Callback回调函数
  - 注意：此配置用于触发回调函数记录用户输入内容，不是控制按钮禁用的逻辑
  - 按钮禁用状态由aiTool.availability和aiTool.duration配置共同控制

### 示例配置

#### early-access-insufficient 配置示例：
- AI前3.5分钟（210秒）可用
- 过了150秒后提示"It is a gentle reminder that the AI Chatbot is still available for 1 minutes."
- 剩余300秒（5分钟）和120秒（2分钟）时分别提示任务剩余时间

#### late-access-insufficient 配置示例：
- AI后3.5分钟（210秒）可用
- 过了390秒后提示"It is a gentle reminder that the AI Chatbot is available to you for 3.5 minutes from now until the end of the task."
- 过了480秒后提示"It is a gentle reminder that the AI Chatbot is still available for 2 minutes until the end of the task."
- 剩余300秒（5分钟）和120秒（2分钟）时分别提示任务剩余时间

#### late-access-sufficient 配置示例：
- AI后10分钟（600秒）可用
- 过了1200秒后提示"It is a gentle reminder that the AI Chatbot is available to you for 10 minutes from now until the end of the task."
- 过了1500秒后提示"It is a gentle reminder that the AI Chatbot is still available for 5 minutes until the end of the task."
- 剩余300秒（5分钟）和120秒（2分钟）时分别提示任务剩余时间

#### early-access-sufficient 配置示例：
- AI前10分钟（600秒）可用
- 过了300秒后提示"It is a gentle reminder that the AI Chatbot is still available for 5 minutes."
- 剩余300秒（5分钟）和120秒（2分钟）时分别提示任务剩余时间


## 关于第五页的aidoocument配置说明

### 下拉菜单 选项

找到这个文件new-project/src/component/Page_task_interface.tsx 下面这段代码

```js
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
```
以上代码意思是下拉菜单的选项，每个选项对应一个aidoocument ，选项的value值就是aidoocument的id。label值就是下拉菜单显示的文本。

找到这个文件new-project/src/aidocument.ts ，里面有8个aidoocument，每个aidoocument的id就是下拉菜单的选项value值。 注意 key和id相同  

大概有这么几个结构 以第一篇document为例  title 就是 页面加粗的标题 
contents 就是内容   
 - type = type 代表是一行的文本 
 - type = empty 代表空行 也就是间距
 - type = image 代表图片  图片放在new-project/src/image目录下 文件名就是content值

```json
1: {
  "id": "1",
  "title": "Scenario and Task",
  "contents": [
    {
      "type": "text",
      "content": "第一行文本"
    },
    {
      "type": "empty",
    },
    {
      "type": "text",
      "content": "第二行文本"
    },
    {
      "type": "image",
      "content": "图片文字"
    }
  ]
}
```


## 注意事项

1. 修改 `CURRENT_PROJECT_VARIANT` 后需要重新启动开发服务器
2. 所有代码都在 new-project 中,其他项目目录不再需要维护
3. 如需添加新的变体,在 `PROJECT_CONFIGS` 中添加新的配置即可
4. Page_task_interface 的 AI 启用/禁用时间通过 CountButton 的回调函数自动控制
5. 配置中的时间单位:
   - 所有时间配置均使用**秒**作为单位
   - `totalStudyTime`: 总时长（秒）
   - `taskTime`: 任务时长（秒）
   - `aiTool.duration`: AI可用时长（秒）
   - `notifications.*`: 提示时间（秒）
   - `Page_task_interface.countdownTime`: 倒计时时间（秒）
6. 修改提示配置后，所有相关的提示逻辑会自动更新，无需修改其他代码
