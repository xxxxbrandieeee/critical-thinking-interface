<div align="center">

<img src="AI_CT_cover/cover_1.png" width="350px"/>

**Interface for Examing the Effects of AI Use on Critical Thinking**

</div>

# Interface

This repository contains the study interface code for the experiment in the paper *["Investigating the Effects of LLM Use on Critical Thinking Under Time Constraints: Access Timing and Time Availability"](https://doi.org/10.1145/3772318.3791796)*. The interface is used for studying (1) how AI use under different access timing and time availability conditions affects critical thinking task performance and (2) how people use AI during critical thinking tasks. The critical thinking task asks participants to make a reasoned written decision based on a decision-making scenario and a set of documents of varying characteristics. The main task interface has three components: a document viewer, an LLM chatbot (if applicable for the experimental condition), and a text editor. It controls the access timing of the LLM chatbot and the time availability for task completion, enabling experiments within a two-dimensional time constraint space. After the task, participants sequentially restate their decision, complete a free recall assessment, evaluate document characteristics, and answer comprehension questions.
 
**What it logs:** The interface captures keystroke, cursor, and navigation events across all panels, enabling analysis of how participants move between reading, using the LLM, and writing throughout the task. These raw logs yield behavioral metrics at different granularities — see the [data dictionary](https://github.com/xxxxbrandieeee/critical-thinking-data-dictionary).
 
**For reuse:**
- The interface can support human-centered experiments on AI's impact on critical thinking and other cognitive tasks involving a non-linear process of reading and writing. Researchers can replace the task scenario and documents, and revise or skip the post-task questions.
- Researchers can select from eight pre-set configurations in a two-dimensional time constraint space (4 LLM access timing levels × 2 time availability levels), which can be used individually or randomly assigned per participant. Alternatively, researchers can use the two base versions (with or without the LLM) without any time constraints.
 
---
 
## Repository Structure
 
```
/
├── critical-thinking-ai-time-constraints/   # Frontend (React + TypeScript)
└── backend/                                  # Backend (Node.js + Express)
```
 
---
 
## Frontend (`critical-thinking-ai-time-constraints/`)
 
### Study Procedure (Pre-set)
 
The following is the pre-set study procedure.

| Page order | Component | Description |
|------|-----------|-------------|
| Page 1 | `Page_consent` | Online consent |
| Page 2 | `Page_user_id` | Entering participant ID |
| Page 3 | `Page_demographic` | Demographics and questions about prior LLM experience |
| Page 4 | `Page_introduction` | Study instructions |
| Page 5 | `Page_scenario` | Reading the task scenario |
| Page 6 | `Page_task_interface` | Main critical thinking task |
| Page 7 | `Page_decision` | Confidence of decision ratings |
| Page 8 | `Page_experience` | Task experience ratings |
| Page 9 | `Page_recall` | Free recall of documents |
| Page 10 | `Page_evaluation` | Evaluation of document characteristics |
| Page 11 | `Page_comprehension` | Inferential comprehension of of documents|
| Page 12 | `Page_self_assessment` | Self-reported critical thinking assessment |
| Page 13 | `Page_feedback` | Study feedback |
| Page 14 | `Page_ending` | Ending message for completion (redirect to recruitment platform) |
| Page 15 | `Page_ending_noconsent` | Ending message for not providing consent |

<!-- TODO: Replace the redirect URL in Page_ending.tsx with your own recruitment platform redirect URL. If not recruiting via an online platform, use a simple ending by commenting out. -->
 
The page order is defined in the `pageArr` array in `src/config/projectConfig.ts`. Pages can be reordered or removed by editing this array.


### Pre-Set Configurations
 
The interface has eight pre-set configurations organized along two experimental dimensions.
 
**LLM Access Timing** (4 levels) controls when the LLM chatbot is available during the task:
- **Early**: LLM accessible in the first third of task time
- **Continuous**: LLM accessible throughout
- **Late**: LLM accessible in the final third of task time
- **No LLM access**: LLM chatbot is not available
 
**Time Availability** controls the total time allocated for the main task:
- **Insufficient**: 10 minutes
- **Sufficient**: 30 minutes
- **Unconstrained**: No time limit
 
The following eight configurations used in the paper are the combinations of 4 LLM access timing levels × 2 time availability levels:
 
| Variant | LLM Access Timing | Time Availability | Duration | AI Duration |
|---------|-----------|------|---------------|-------------|
| `no-access-insufficient` | None | 10 min | 600 s | — |
| `early-access-insufficient` | First third | 10 min | 600 s | 210 s (3.5 min) |
| `continuous-access-insufficient` | Full | 10 min | 600 s | 600 s |
| `late-access-insufficient` | Last third | 10 min | 600 s | 210 s (3.5 min) |
| `no-access-sufficient` | None | 30 min | 1800 s | — |
| `early-access-sufficient` | First third | 30 min | 1800 s | 600 s (10 min) |
| `continuous-access-sufficient` | Full | 30 min | 1800 s | 1800 s |
| `late-access-sufficient` | Last third | 30 min | 1800 s | 600 s (10 min) |
 
Two base configurations are provided for use without time constraints:
 
| Variant | LLM Access Timing | Description |
|---------|-----------|-------------|
| `continuous-access-unconstrained` | Full | LLM chatbot available, no time availability constraint |
| `no-access-unconstrained` | None | No LLM chatbot, no time availability constraint |

 
To use a specific configuration, edit `src/config/projectConfig.ts`:
```ts
export let CURRENT_PROJECT_VARIANT: ProjectVariant = 'continuous-access-insufficient';
```
 
Setting the variant to `random` randomly assigns one of the 8 experimental conditions per participant at session start. These two unconstrained variants are not included in the random assignment pool. The assignment is stored in `sessionStorage` and remains consistent within the same browser tab; a new assignment is made when the tab is closed and reopened:
```ts
export let CURRENT_PROJECT_VARIANT: ProjectVariant = 'random';
```
 
### Customization
 
- **Task scenario and documents**: Edit `src/aidocument.ts` (document content) and the `documentArr` array in `src/component/Page_task_interface.tsx` (document list for the dropdown menu).
- **LLM chatbot**: Edit `src/aitext.ts` to change the document provided to the LLM.
- **Page order or inclusion**: Edit the `pageArr` array in `src/config/projectConfig.ts`. Remove or reorder entries to change the study procedure.
- **Time constraints**: Each variant in `PROJECT_CONFIGS` in `src/config/projectConfig.ts` controls task duration (`taskTime`), the timing and duration of the LLM access (`aiTool.availability`, `aiTool.duration`), and notification messages (`notifications`).
- **Adding new configurations**: Add a new entry to `PROJECT_CONFIGS` and add the variant name to the `ProjectVariant` type.
 
---
 
## Backend (`backend/`)
 
The backend proxies LLM chat requests to the OpenAI API and stores participant response data as JSON files.
 
### Endpoints
 
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/response` | POST | Saves participant response data as a timestamped JSON file |
| `/api/chat` | POST | Proxies chat requests to the OpenAI API (GPT-4 Turbo) |
 
To use a different LLM provider, modify the `/api/chat` endpoint in `backend/server.js`.
 
### Data Storage
 
Participant responses are saved as timestamped JSON files under `backend/`, in subdirectories named after the configuration variant (e.g., `no-access-sufficient/`, `early-access-insufficient/`). These files are the raw input for the data processing pipeline — see the [data dictionary](https://github.com/xxxxbrandieeee/critical-thinking-data-dictionary).
 
---

## Setup and Deployment
 
### 1. Clone this repository
 
```bash
git clone https://github.com/xxxxbrandieeee/critical-thinking-interface
```
 
### 2. Add your API key
 
The backend proxies LLM chat requests to the OpenAI API. Open `backend/server.js` and replace the placeholder API key with your own:
 
```js
const OPENAI_API_KEY = ""; // Add your own API key here
```
 
### 3. Run the frontend
 
**Local machine**
```bash
cd critical-thinking-ai-time-constraints
npm install
npm run dev
# Visit http://localhost:3009
```
 
**Server**
```bash
cd critical-thinking-ai-time-constraints
npm install
npm run build
```

Upload the generated `dist/` folder to your server and configure Nginx to serve it and bind your domain.
 
### 4. Run the backend
 
**Local machine**
```bash
cd backend
npm install
npm run start
# You should see: Server running on port 4001
```
 
**Server**
 
The server requires a Node.js environment. Upload `server.js` and `package.json` to your server, then:
```bash
cd backend
npm install
npm run pm2
```
 
This starts the server with PM2 for process management, auto-restart, and log rotation. Logs are written to `logs/out.log` and `logs/err.log`. Note that some files in the `backend/` directory are generated during local development and can be ignored when uploading to the server.


---

## Citation

If you use this interface, please kindly cite:
```bibtex
@inproceedings{zhi2026investigating,
  title={Investigating the Effects of LLM Use on Critical Thinking Under Time Constraints: Access Timing and Time Availability},
  author={Zhi, Jiayin and Kumar, Harsh and Lee, Mina},
  booktitle={Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems},
  series={CHI '26},
  year={2026},
  month={April},
  location={Barcelona, Spain},
  publisher={ACM},
  address={New York, NY, USA},
  pages={1--21},
  doi={10.1145/3772318.3791796}
}
```
---

## Contact

If you have any questions, please contact Jiayin Zhi at jzhi@uchicago.edu.
