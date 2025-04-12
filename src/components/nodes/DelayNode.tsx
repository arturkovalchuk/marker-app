import React, { useState, useCallback, useEffect, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { DelayNodeData } from '../../types/campaign';
import { Clock, ChevronDown } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';

const DelayNode: React.FC<NodeProps<DelayNodeData>> = memo(({ data, isConnectable, selected }) => {
  const [title, setTitle] = useState(data.title);
  const [delay, setDelay] = useState(data.delay || 1);
  const [unit, setUnit] = useState(data.unit || 'minutes');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTitle(data.title);
    setDelay(data.delay || 1);
    setUnit(data.unit || 'minutes');
  }, [data.title, data.delay, data.unit]);

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

  const handleDelayChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDelay = parseInt(e.target.value) || 1;
    setDelay(newDelay);
    if (data.onChange) {
      data.onChange({
        ...data,
        delay: newDelay
      });
    }
  }, [data]);

  const handleUnitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as 'minutes' | 'hours' | 'days';
    setUnit(newUnit);
    if (data.onChange) {
      data.onChange({
        ...data,
        unit: newUnit
      });
    }
  }, [data]);

  const handleTitleBlur = useCallback(() => {
    if (data.onChange && title.trim() === '') {
      const defaultTitle = 'Delay Step';
      setTitle(defaultTitle);
      data.onChange({
        ...data,
        title: defaultTitle
      });
    }
  }, [data, title]);

  const themeColor = 'amber';

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className={`group relative bg-white rounded-lg shadow-sm border transition-all duration-200 ease-in-out
        ${selected ? `border-${themeColor}-400 shadow-lg` : `border-${themeColor}-200`}
        hover:shadow-md hover:border-${themeColor}-300 min-w-[240px]`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-3 py-2 ${isOpen ? `border-b border-${themeColor}-100` : ''}`}>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 flex items-center justify-center bg-${themeColor}-50 border border-${themeColor}-200`}>
              <Clock className={`w-4 h-4 text-${themeColor}-500`} />
            </div>
            <input
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className={`text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-${themeColor}-700 placeholder-${themeColor}-300`}
              placeholder="Enter delay name"
            />
          </div>
          <Collapsible.Trigger asChild>
            <button 
              className={`p-1 rounded hover:bg-${themeColor}-50 transition-colors`}
            >
              <ChevronDown className={`w-4 h-4 text-${themeColor}-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
          </Collapsible.Trigger>
        </div>

        <Collapsible.Content>
          <div className="p-3 space-y-3">
            <div>
              <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                Delay Duration
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={delay}
                  onChange={handleDelayChange}
                  className={`flex-1 px-2.5 py-1.5 text-sm border rounded
                    border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                    bg-white transition-colors duration-200`}
                />
                <select
                  value={unit}
                  onChange={handleUnitChange}
                  className={`px-2.5 py-1.5 text-sm border rounded
                    border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                    bg-white transition-colors duration-200`}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        </Collapsible.Content>

        {/* Handles */}
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className={`!bg-${themeColor}-400 !w-3 !h-3 !border-2 !border-white !left-0 !transform !-translate-x-1/2 !top-[20px]`}
        />
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className={`!bg-${themeColor}-400 !w-3 !h-3 !border-2 !border-white !right-0 !transform !translate-x-1/2 !top-[20px]`}
        />
      </div>
    </Collapsible.Root>
  );
});

DelayNode.displayName = 'DelayNode';

export { DelayNode }; 