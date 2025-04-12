import React, { useState, useCallback, useEffect, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { TriggerNodeData } from '../../types/campaign';
import { Play, Calendar, ChevronDown } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';

const TriggerNode: React.FC<NodeProps<TriggerNodeData>> = memo(({ data, isConnectable, selected }) => {
  const [title, setTitle] = useState(data.title);
  const [triggerType, setTriggerType] = useState(data.triggerType || 'event');
  const [eventName, setEventName] = useState(data.eventName || '');
  const [triggerDate, setTriggerDate] = useState(data.triggerDate || '');
  const [triggerTime, setTriggerTime] = useState(data.triggerTime || '');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setTitle(data.title);
    setTriggerType(data.triggerType || 'event');
    setEventName(data.eventName || '');
    setTriggerDate(data.triggerDate || '');
    setTriggerTime(data.triggerTime || '');
  }, [data.title, data.triggerType, data.eventName, data.triggerDate, data.triggerTime]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (data.onChange) {
      data.onChange({
        ...data,
        title: newTitle
      });
    }
  }, [data]);

  const handleTriggerTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'event' | 'date';
    setTriggerType(newType);
    if (data.onChange) {
      data.onChange({
        ...data,
        triggerType: newType
      });
    }
  }, [data]);

  const handleEventNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEventName = e.target.value;
    setEventName(newEventName);
    if (data.onChange) {
      data.onChange({
        ...data,
        eventName: newEventName
      });
    }
  }, [data]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setTriggerDate(newDate);
    if (data.onChange) {
      data.onChange({
        ...data,
        triggerDate: newDate
      });
    }
  }, [data]);

  const handleTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTriggerTime(newTime);
    if (data.onChange) {
      data.onChange({
        ...data,
        triggerTime: newTime
      });
    }
  }, [data]);

  const handleTitleBlur = useCallback(() => {
    if (data.onChange && title.trim() === '') {
      const defaultTitle = 'Start Campaign';
      setTitle(defaultTitle);
      data.onChange({
        ...data,
        title: defaultTitle
      });
    }
  }, [data, title]);

  const themeColor = 'violet';

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className={`group relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ease-in-out
        ${selected ? `border-${themeColor}-400 shadow-lg` : `border-${themeColor}-200`}
        hover:shadow-md hover:border-${themeColor}-300 min-w-[300px]`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-2 border-b border-${themeColor}-100`}>
          <div className="flex items-center gap-2">
            <Play className={`w-4 h-4 text-${themeColor}-500`} />
            <input
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className={`text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-${themeColor}-700 placeholder-${themeColor}-300`}
              placeholder="Enter campaign name"
            />
          </div>
          <Collapsible.Trigger asChild>
            <button 
              className={`p-1 rounded-md hover:bg-${themeColor}-50 transition-colors`}
            >
              <ChevronDown className={`w-4 h-4 text-${themeColor}-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
          </Collapsible.Trigger>
        </div>

        <Collapsible.Content>
          <div className="p-4 space-y-4">
            <div>
              <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                Trigger Type
              </label>
              <select
                value={triggerType}
                onChange={handleTriggerTypeChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg
                  border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                  bg-white transition-colors duration-200`}
              >
                <option value="event">Event</option>
                <option value="date">Date</option>
              </select>
            </div>

            {triggerType === 'event' ? (
              <div>
                <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                  Event Name
                </label>
                <input
                  value={eventName}
                  onChange={handleEventNameChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                    placeholder-${themeColor}-300 bg-white transition-colors duration-200`}
                  placeholder="Enter event name"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={triggerDate}
                    onChange={handleDateChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg
                      border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                      bg-white transition-colors duration-200`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={triggerTime}
                    onChange={handleTimeChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg
                      border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                      bg-white transition-colors duration-200`}
                  />
                </div>
              </div>
            )}
          </div>
        </Collapsible.Content>

        {/* Handle */}
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className={`!bg-${themeColor}-400 !w-3 !h-3 !border-2 !border-white !right-0 !transform !translate-x-1/2`}
        />
      </div>
    </Collapsible.Root>
  );
});

TriggerNode.displayName = 'TriggerNode';

export { TriggerNode }; 