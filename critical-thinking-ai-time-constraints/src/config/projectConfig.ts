// Current project variant - modify this variable to switch projects
export let CURRENT_PROJECT_VARIANT: ProjectVariant = 'random';

// Pages below can be freely removed or reordered. The last page is page 14, which does not support configuration
export const pageArr = ['Page_consent', 'Page_user_id', 'Page_demographic', 'Page_introduction', 'Page_scenario', 'Page_task_interface', 'Page_decision', 'Page_experience', 'Page_recall', 'Page_evaluation', 'Page_comprehension', 'Page_self_assessment', 'Page_feedback', 'Page_ending', 'Page_ending_noconsent']


// Project config type definition
export type ProjectVariant =
  | 'no-access-sufficient'
  | 'continuous-access-sufficient'
  | 'late-access-sufficient'
  | 'early-access-sufficient'
  | 'no-access-insufficient'
  | 'continuous-access-insufficient'
  | 'early-access-insufficient'
  | 'late-access-insufficient'
  | 'continuous-access-unconstrainted'
  | 'no-access-unconstrainted'
  | 'random';

// Add server address; use the local URL for development
// const BASE_API_URL = '';
const BASE_API_URL = 'http://127.0.0.1:4001/api';

export interface ProjectConfig {
  // Time for the fourth page
  Page_scenario:{
    time:number;
  },
  // Total duration (seconds)
  totalStudyTime: number;
  // Task duration (seconds)
  taskTime: number;
  // AI tool config
  aiTool: {
    enabled: boolean;
    // 'full' - available throughout, 'first' - first N seconds, 'last' - last N seconds
    availability: 'full' | 'first' | 'last' | 'none';
    // Available duration (seconds), only effective when availability is 'first' or 'last'
    duration?: number;
  };
  // Notification config
  notifications: {
    // Task remaining time reminder (seconds) - triggers when this many seconds remain
    taskReminderTimes?: number[];
    // Task remaining time reminder message
    taskReminderMessage?: string;
    // AI about to be disabled warning time (seconds) - triggers after this many seconds, only for 'first' mode
    aiDisableWarningTime?: number;
    // AI about to be disabled warning message
    aiDisableWarningMessage?: string;
    // AI about to be enabled warning time (seconds) - triggers after this many seconds, only for 'last' mode
    aiEnableWarningTime?: number;
    // AI about to be enabled warning message
    aiEnableWarningMessage?: string;
    // AI availability reminder time (seconds) - triggers after this many seconds
    aiReminderTime?: number;
    // AI availability reminder message
    aiReminderMessage?: string;
  };
  Page_task_interface: {
    VerifyThatTheEssayIsEmpty: boolean; // Whether to validate that essay is not empty
    // Countdown time (seconds)
    countdownTime: number;
    // Number of buttons to click (3 with AI, 2 without AI)
    buttonCount: number;
    // AI reminder message (shown after all buttons are clicked)
    aiReminderMessage?: string;
    // AI callback trigger time (seconds) - triggers on5Callback when this many seconds remain
    // Note: this config triggers a callback to record user input, not for controlling button disable logic
    // Button disable state is controlled by aiTool.availability and aiTool.duration together
    aiCallbackTime?: number;
    // Project type identifier (for API submission), i.e. the backend storage folder
    projectType: string;
  };
  // API config
  api: {
    // API base URL
    baseUrl: string;
  };
}

// Project configurations
export const PROJECT_CONFIGS: Record<Exclude<ProjectVariant, 'random'>, ProjectConfig> = {
  'no-access-sufficient': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 2400,
    taskTime: 1800,
    aiTool: {
      enabled: false,
      availability: 'none',
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [300, 120],
      // Task remaining time reminder message
      taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 1800,
      buttonCount: 2,
      projectType: 'no-access-sufficient',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
  'continuous-access-sufficient': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 2400,
    taskTime: 1800,
    aiTool: {
      enabled: true,
      availability: 'full',
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [300, 120],
      // Task remaining time reminder message
      taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 1800,
      buttonCount: 3,
      projectType: 'continuous-access-sufficient',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
  'late-access-sufficient': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 2400,
    taskTime: 1800,
    aiTool: {
      enabled: true,
      availability: 'last',
      duration: 600,
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [300, 120],
      // Task remaining time reminder message
      taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
      // AI availability reminder time (seconds) - triggers after this many seconds
      aiReminderTime: 1200,
      // AI availability reminder message
      aiReminderMessage: 'It is a gentle reminder that the AI Chatbot is available to you for 10 minutes from now until the end of the task.',
      // AI about to be disabled warning time (seconds) - triggers after this many seconds
      aiDisableWarningTime: 1500,
      // AI about to be disabled warning message
      aiDisableWarningMessage: 'It is a gentle reminder that the AI Chatbot is still available for 5 minutes until the end of the task.',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 1800,
      buttonCount: 3,
      projectType: 'late-access-sufficient',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
  'early-access-sufficient': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 2400,
    taskTime: 1800,
    aiTool: {
      enabled: true,
      availability: 'first',
      duration: 600,
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [300, 120],
      // Task remaining time reminder message
      taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
      // AI availability reminder time (seconds) - triggers after this many seconds
      aiReminderTime: 300,
      // AI availability reminder message
      aiReminderMessage: 'It is a gentle reminder that the AI Chatbot is still available for 5 minutes.',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 1800,
      buttonCount: 3,
      aiReminderMessage: 'It is a gentle reminder that the AI Chatbot is available to you for 10 minutes from now.',
      aiCallbackTime: 1200,
      projectType: 'early-access-sufficient',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
  'no-access-insufficient': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 1200,
    taskTime: 600,
    aiTool: {
      enabled: false,
      availability: 'none',
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [300, 120],
      // Task remaining time reminder message
      taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 600,
      buttonCount: 2,
      projectType: 'no-access-insufficient',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
  'continuous-access-insufficient': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 1200,
    taskTime: 600,
    aiTool: {
      enabled: true,
      availability: 'full',
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [300, 120],
      // Task remaining time reminder message
      taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 600,
      buttonCount: 3,
      projectType: 'continuous-access-insufficient',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
  'early-access-insufficient': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 1200,
    taskTime: 600,
    aiTool: {
      enabled: true,
      availability: 'first',
      // AI available duration (seconds)
      duration: 210,
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [300, 120],
      // Task remaining time reminder message
      taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
      // AI availability reminder time (seconds) - triggers after this many seconds
      aiReminderTime: 150,
      // AI availability reminder message
      aiReminderMessage: 'It is a gentle reminder that the AI Chatbot is still available for 1 minutes.',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 600,
      buttonCount: 3,
      aiReminderMessage: 'It is a gentle reminder that the AI Chatbot is available to you for 3.5 minutes from now.',
      aiCallbackTime: 390,
      projectType: 'early-access-insufficient',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
  'late-access-insufficient': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 1200,
    taskTime: 600,
    aiTool: {
      enabled: true,
      availability: 'last',
      duration: 210, // AI available duration
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [300, 120],
      // Task remaining time reminder message
      taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
      // AI availability reminder time (seconds) - triggers after this many seconds
      aiReminderTime: 390,
      // AI availability reminder message
      aiReminderMessage: 'It is a gentle reminder that the AI Chatbot is available to you for 3.5 minutes from now until the end of the task.',
      // AI about to be disabled warning time (seconds) - triggers after this many seconds
      aiDisableWarningTime: 480,
      // AI about to be disabled warning message
      aiDisableWarningMessage: 'It is a gentle reminder that the AI Chatbot is still available for 2 minutes until the end of the task.',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 600,
      buttonCount: 3,
      projectType: 'late-access-insufficient',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
  'continuous-access-unconstrainted': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 1200,
    taskTime: 600,
    aiTool: {
      enabled: true,
      availability: 'full',
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [],
      // Task remaining time reminder message
      taskReminderMessage: 'Just a reminder that you have {minutes} more minutes to read documents and write your essay.',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 2,
      buttonCount: 3,
      projectType: 'continuous-access-unconstrainted',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
  'no-access-unconstrainted': {
    Page_scenario:{
      time:10
    },
    totalStudyTime: 1200,
    taskTime: 600,
    aiTool: {
      enabled: false,
      availability: 'none',
    },
    notifications: {
      // Task remaining time reminder (seconds) - triggers when this many seconds remain
      taskReminderTimes: [],
      // Task remaining time reminder message
      taskReminderMessage: '',
    },
    Page_task_interface: {
      VerifyThatTheEssayIsEmpty: true,
      countdownTime: 2,
      buttonCount: 2,
      projectType: 'no-access-unconstrainted',
    },
    api: {
      baseUrl: BASE_API_URL,
    },
  },
};

// Get current project config
export const getCurrentConfig = (): ProjectConfig => {
  if (CURRENT_PROJECT_VARIANT === 'random') {
    const SESSION_KEY = 'new_project_random_variant';
    let resolved = sessionStorage.getItem(SESSION_KEY) as Exclude<ProjectVariant, 'random'> | null;
    if (!resolved) {
      const variants: Exclude<ProjectVariant, 'random'>[] = [
        'no-access-sufficient',
        'continuous-access-sufficient',
        'late-access-sufficient',
        'early-access-sufficient',
        'no-access-insufficient',
        'continuous-access-insufficient',
        'early-access-insufficient',
        'late-access-insufficient',
      ];
      resolved = variants[Math.floor(Math.random() * variants.length)];
      sessionStorage.setItem(SESSION_KEY, resolved);
    }
    PROJECT_CONFIGS[resolved].Page_task_interface.projectType = resolved;
    return PROJECT_CONFIGS[resolved];
  }
  return PROJECT_CONFIGS[CURRENT_PROJECT_VARIANT];
};


