import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const FlowNode: React.FC<NodeProps> = ({ id, data, isConnectable }) => {
  const [title, setTitle] = useState(data.title);
  const [messageTemplate, setMessageTemplate] = useState(data.messageTemplate);

  useEffect(() => {
    setTitle(data.title);
    setMessageTemplate(data.messageTemplate);
  }, [data.title, data.messageTemplate]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (data.onChange) {
      data.onChange({ ...data, title: newTitle });
    }
  }, [data]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessageTemplate(newMessage);
    if (data.onChange) {
      data.onChange({ ...data, messageTemplate: newMessage });
    }
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 min-w-[250px]">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white"
      />
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Step Name
          </label>
          <input
            value={title}
            onChange={handleTitleChange}
            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400"
            placeholder="Enter step name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Message Template
          </label>
          <textarea
            value={messageTemplate}
            onChange={handleMessageChange}
            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400 min-h-[80px] resize-y"
            placeholder="Enter message template with {{variables}}"
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
};

export default FlowNode; 