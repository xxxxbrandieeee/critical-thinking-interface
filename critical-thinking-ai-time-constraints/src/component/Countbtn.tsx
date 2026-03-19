import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Button, message } from 'antd';
import { getCurrentConfig } from '../config/projectConfig';

// Time formatting function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

// Props type definition
interface CountDownButtonProps {
  defaultText?: string;         // Text displayed after countdown ends
  countingTextPrefix?: string;  // Prefix displayed during countdown
  countdownTime?: number;       // Total countdown time (seconds)
  currentTime?: number;         // Current countdown time (seconds) - passed from parent component
  onAction?: () => void;        // Action to execute after countdown ends
  onFinish?: () => void;
  className?: string;
  style?: React.CSSProperties;
  trigger?: any;
  disabled?: boolean;
  isStart?: boolean;
  loading?: boolean;
  on5Callback?: () => void;
}

const CountDownButton: React.FC<CountDownButtonProps> = ({
  defaultText = 'Next',
  countingTextPrefix = '',
  countdownTime = 1,
  currentTime,
  onAction = () => { },
  className = 'next_btn',
  style,
  trigger,
  disabled = false,
  onFinish = () => { },
  isStart = false,
  loading,
  on5Callback
}) => {
  // Use currentTime passed from parent component as the current countdown time
  const remaining = currentTime !== undefined ? currentTime : 0;
  const isCounting = remaining > 0;
  
  // Track already shown reminders to avoid duplicates
  const shownRemindersRef = useRef<Set<string>>(new Set());
  
  // Get current config
  const config = getCurrentConfig();

  useEffect(() => {
    if (trigger !== undefined) {
      // Reset shown reminders when trigger changes
      shownRemindersRef.current.clear();
    }
  }, [trigger]);

  // Countdown end logic
  useEffect(() => {
    if (remaining&&remaining <= 0 && isStart) {
      onFinish();
    }
  }, [remaining, isStart, onFinish]);

  useEffect(() => {
    if (isStart && isCounting) {
      // Calculate elapsed time
      const elapsedTime = countdownTime - remaining;

      // Task remaining time reminder
      if (config.notifications?.taskReminderTimes) {
        config.notifications.taskReminderTimes.forEach(seconds => {
          if (remaining == seconds) {
            const reminderKey = `task-${seconds}`;
            if (!shownRemindersRef.current.has(reminderKey)) {
              const minutes = Math.floor(seconds / 60);
              const messageText = config.notifications.taskReminderMessage?.replace('{minutes}', minutes.toString()) || 
                `Just a reminder that you have ${minutes} more minutes to read documents and write your essay.`;
              message.warning(messageText);
              shownRemindersRef.current.add(reminderKey);
            }
          }
        });
      }

      // AI availability reminder - shows after N seconds
      if (config.notifications?.aiReminderTime) {
        const seconds = config.notifications.aiReminderTime;
        if (elapsedTime == seconds) {
          const reminderKey = 'ai-availability';
          if (!shownRemindersRef.current.has(reminderKey)) {
            const messageText = config.notifications.aiReminderMessage || 
              "It is a gentle reminder that the AI Chatbot is still available for 1 minutes.";
            message.warning(messageText);
            shownRemindersRef.current.add(reminderKey);
          }
        }
      }

      // AI about to be disabled reminder (first mode) - shows after N seconds
      if (config.notifications?.aiDisableWarningTime) {
        const seconds = config.notifications.aiDisableWarningTime;
        if (elapsedTime == seconds) {
          const reminderKey = 'ai-disable-warning';
          if (!shownRemindersRef.current.has(reminderKey)) {
            const messageText = config.notifications.aiDisableWarningMessage || 
              "AI Chatbot will be disabled in 1 minute";
            message.warning(messageText);
            shownRemindersRef.current.add(reminderKey);
          }
        }
      }

      // AI about to be enabled reminder (last mode) - shows after N seconds
      if (config.notifications?.aiEnableWarningTime) {
        const seconds = config.notifications.aiEnableWarningTime;
        if (elapsedTime == seconds) {
          const reminderKey = 'ai-enable-warning';
          if (!shownRemindersRef.current.has(reminderKey)) {
            const messageText = config.notifications.aiEnableWarningMessage || 
              "AI Chatbot will be available in 1 minute";
            message.warning(messageText);
            shownRemindersRef.current.add(reminderKey);
          }
        }
      }

      // Call on5Callback (if provided)
      if (config.Page_task_interface?.aiCallbackTime) {
        const seconds = config.Page_task_interface.aiCallbackTime;
        if (remaining == seconds) {
          const reminderKey = 'on5-callback';
          if (!shownRemindersRef.current.has(reminderKey)) {
            on5Callback && on5Callback();
            shownRemindersRef.current.add(reminderKey);
          }
        }
      }
      
      // Countdown finished
      if (remaining == 0) {
        const reminderKey = 'on-finish';
        if (!shownRemindersRef.current.has(reminderKey)) {
          onFinish();
          shownRemindersRef.current.add(reminderKey);
        }
      }
    }
  }, [
    isStart, isCounting, remaining, config, countdownTime, on5Callback, onFinish
  ])


  const handleClick = () => {
    if (!isCounting) {
      onAction();
    }
  };

  return (
    <Button
      type="primary"
      onClick={handleClick}
      disabled={isCounting || disabled}
      className={`yinying ${className}`}
      loading={loading}
      style={style}
    >
      {isCounting ? `${countingTextPrefix}${formatTime(remaining)}` : defaultText}
    </Button>
  );
};

export default CountDownButton;