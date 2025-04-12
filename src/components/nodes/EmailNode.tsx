import React, { useState, useCallback, useEffect, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { EmailNodeData } from '../../types/campaign';
import { Mail, ChevronDown } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';

const EmailNode: React.FC<NodeProps<EmailNodeData>> = memo(({ data, isConnectable, selected }) => {
  const [title, setTitle] = useState(data.title);
  const [template, setTemplate] = useState(data.template || '');
  const [subject, setSubject] = useState(data.subject || '');
  const [senderName, setSenderName] = useState(data.senderName || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTitle(data.title);
    setTemplate(data.template || '');
    setSubject(data.subject || '');
    setSenderName(data.senderName || '');
  }, [data.title, data.template, data.subject, data.senderName]);

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

  const handleTemplateChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTemplate = e.target.value;
    setTemplate(newTemplate);
    if (data.onChange) {
      data.onChange({
        ...data,
        template: newTemplate
      });
    }
  }, [data]);

  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSubject = e.target.value;
    setSubject(newSubject);
    if (data.onChange) {
      data.onChange({
        ...data,
        subject: newSubject
      });
    }
  }, [data]);

  const handleSenderNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSenderName = e.target.value;
    setSenderName(newSenderName);
    if (data.onChange) {
      data.onChange({
        ...data,
        senderName: newSenderName
      });
    }
  }, [data]);

  const handleTitleBlur = useCallback(() => {
    if (data.onChange && title.trim() === '') {
      const defaultTitle = 'Email Message';
      setTitle(defaultTitle);
      data.onChange({
        ...data,
        title: defaultTitle
      });
    }
  }, [data, title]);

  const themeColor = 'blue';

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
              <Mail className={`w-4 h-4 text-${themeColor}-500`} />
            </div>
            <input
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className={`text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-${themeColor}-700 placeholder-${themeColor}-300`}
              placeholder="Enter message name"
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
                Subject
              </label>
              <input
                value={subject}
                onChange={handleSubjectChange}
                className={`w-full px-2.5 py-1.5 text-sm border rounded
                  border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                  placeholder-${themeColor}-300 bg-white transition-colors duration-200`}
                placeholder="Enter email subject"
              />
            </div>

            <div>
              <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                Sender Name
              </label>
              <input
                value={senderName}
                onChange={handleSenderNameChange}
                className={`w-full px-2.5 py-1.5 text-sm border rounded
                  border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                  placeholder-${themeColor}-300 bg-white transition-colors duration-200`}
                placeholder="Enter sender name"
              />
            </div>

            <div>
              <label className={`block text-xs font-medium text-${themeColor}-700 mb-1`}>
                Message Template
              </label>
              <textarea
                value={template}
                onChange={handleTemplateChange}
                className={`w-full px-2.5 py-1.5 text-sm border rounded
                  border-${themeColor}-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500
                  placeholder-${themeColor}-300 min-h-[80px] resize-y bg-white transition-colors duration-200`}
                placeholder="Enter email template..."
              />
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

EmailNode.displayName = 'EmailNode';

export { EmailNode }; 