import React, { useState, useCallback, useEffect, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { InputNodeData } from '../../types/campaign';
import { MessageSquare, ChevronDown } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';

const InputNode: React.FC<NodeProps<InputNodeData>> = memo(({ data, isConnectable, selected }) => {
  const [title, setTitle] = useState(data.title);
  const [inputType, setInputType] = useState(data.inputType || 'text');
  const [placeholder, setPlaceholder] = useState(data.placeholder || '');
  const [options, setOptions] = useState(data.options || []);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setTitle(data.title);
    setInputType(data.inputType || 'text');
    setPlaceholder(data.placeholder || '');
    setOptions(data.options || []);
  }, [data.title, data.inputType, data.placeholder, data.options]);

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

  const handleInputTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'text' | 'number' | 'date' | 'select';
    setInputType(newType);
    if (data.onChange) {
      data.onChange({
        ...data,
        inputType: newType
      });
    }
  }, [data]);

  const handlePlaceholderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlaceholder = e.target.value;
    setPlaceholder(newPlaceholder);
    if (data.onChange) {
      data.onChange({
        ...data,
        placeholder: newPlaceholder
      });
    }
  }, [data]);

  const handleOptionsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOptions = e.target.value.split('\n').filter(option => option.trim() !== '');
    setOptions(newOptions);
    if (data.onChange) {
      data.onChange({
        ...data,
        options: newOptions
      });
    }
  }, [data]);

  const handleTitleBlur = useCallback(() => {
    if (data.onChange && title.trim() === '') {
      const defaultTitle = 'Input Step';
      setTitle(defaultTitle);
      data.onChange({
        ...data,
        title: defaultTitle
      });
    }
  }, [data, title]);

  const themeColor = 'rose';

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className={`group relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ease-in-out
        ${selected ? `border-${themeColor}-400 shadow-lg` : `border-${themeColor}-200`}
        hover:shadow-md hover:border-${themeColor}-300 min-w-[300px]`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-2 border-b border-${themeColor}-100`}>
          <div className="flex items-center gap-2">
            <MessageSquare className={`w-4 h-4 text-${themeColor}-500`} />
            <input
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className={`text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-${themeColor}-700 placeholder-${themeColor}-300`}
              placeholder="Enter input name"
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
                Input Type
              </label>
              <select
                value={inputType}
                onChange={handleInputTypeChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg
                  border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                  bg-white transition-colors duration-200`}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="select">Select</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                Placeholder
              </label>
              <input
                value={placeholder}
                onChange={handlePlaceholderChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg
                  border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                  placeholder-${themeColor}-300 bg-white transition-colors duration-200`}
                placeholder="Enter placeholder text"
              />
            </div>

            {inputType === 'select' && (
              <div>
                <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                  Options (one per line)
                </label>
                <textarea
                  value={options.join('\n')}
                  onChange={handleOptionsChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                    placeholder-${themeColor}-300 min-h-[60px] resize-y bg-white transition-colors duration-200`}
                  placeholder="Enter options, one per line"
                />
              </div>
            )}
          </div>
        </Collapsible.Content>

        {/* Handles */}
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className={`!bg-${themeColor}-400 !w-3 !h-3 !border-2 !border-white !left-0 !transform !-translate-x-1/2`}
        />
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

InputNode.displayName = 'InputNode';

export { InputNode }; 