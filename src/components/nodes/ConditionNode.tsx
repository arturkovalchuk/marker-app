import React, { useState, useCallback, useEffect, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ConditionNodeData } from '../../types/campaign';
import { GitBranch, ChevronDown } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';

const ConditionNode: React.FC<NodeProps<ConditionNodeData>> = memo(({ data, isConnectable, selected }) => {
  const [title, setTitle] = useState(data.title);
  const [condition, setCondition] = useState(data.condition || '');
  const [trueLabel, setTrueLabel] = useState(data.trueLabel || 'Yes');
  const [falseLabel, setFalseLabel] = useState(data.falseLabel || 'No');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTitle(data.title);
    setCondition(data.condition || '');
    setTrueLabel(data.trueLabel || 'Yes');
    setFalseLabel(data.falseLabel || 'No');
  }, [data.title, data.condition, data.trueLabel, data.falseLabel]);

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

  const handleConditionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCondition = e.target.value;
    setCondition(newCondition);
    if (data.onChange) {
      data.onChange({
        ...data,
        condition: newCondition
      });
    }
  }, [data]);

  const handleTrueLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setTrueLabel(newLabel);
    if (data.onChange) {
      data.onChange({
        ...data,
        trueLabel: newLabel
      });
    }
  }, [data]);

  const handleFalseLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setFalseLabel(newLabel);
    if (data.onChange) {
      data.onChange({
        ...data,
        falseLabel: newLabel
      });
    }
  }, [data]);

  const handleTitleBlur = useCallback(() => {
    if (data.onChange && title.trim() === '') {
      const defaultTitle = 'Condition Step';
      setTitle(defaultTitle);
      data.onChange({
        ...data,
        title: defaultTitle
      });
    }
  }, [data, title]);

  const themeColor = 'emerald';

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
              <GitBranch className={`w-4 h-4 text-${themeColor}-500`} />
            </div>
            <input
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className={`text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-${themeColor}-700 placeholder-${themeColor}-300`}
              placeholder="Enter condition name"
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
                Condition
              </label>
              <textarea
                value={condition}
                onChange={handleConditionChange}
                className={`w-full px-2.5 py-1.5 text-sm border rounded
                  border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                  placeholder-${themeColor}-300 min-h-[80px] resize-y bg-white transition-colors duration-200`}
                placeholder="Enter condition..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                  True Label
                </label>
                <input
                  value={trueLabel}
                  onChange={handleTrueLabelChange}
                  className={`w-full px-2.5 py-1.5 text-sm border rounded
                    border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                    placeholder-${themeColor}-300 bg-white transition-colors duration-200`}
                  placeholder="Yes"
                />
              </div>

              <div>
                <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                  False Label
                </label>
                <input
                  value={falseLabel}
                  onChange={handleFalseLabelChange}
                  className={`w-full px-2.5 py-1.5 text-sm border rounded
                    border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                    placeholder-${themeColor}-300 bg-white transition-colors duration-200`}
                  placeholder="No"
                />
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
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          isConnectable={isConnectable}
          className={`!bg-red-400 !w-3 !h-3 !border-2 !border-white !bottom-0 !transform !translate-y-1/2 !left-1/2`}
        />
      </div>
    </Collapsible.Root>
  );
});

ConditionNode.displayName = 'ConditionNode';

export { ConditionNode }; 