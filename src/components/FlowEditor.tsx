import React, { useCallback, useState, useRef, DragEvent as ReactDragEvent } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  BackgroundVariant,
  useReactFlow,
  NodeDragHandler,
  ReactFlowInstance,
  XYPosition,
  EdgeChange,
  NodeChange,
  NodeMouseHandler,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nanoid } from 'nanoid';
import { Flow, NodeData, NodeType } from '../types/campaign';
import { Plus, MessageSquare, Clock, GitBranch, Mail, Play, Trash2, X } from 'lucide-react';
import { cn } from '../lib/utils';

// Import node components
import { SMSNode } from './nodes/SMSNode';
import { EmailNode } from './nodes/EmailNode';
import { DelayNode } from './nodes/DelayNode';
import { ConditionNode } from './nodes/ConditionNode';
import { TriggerNode } from './nodes/TriggerNode';
import { InputNode } from './nodes/InputNode';

type CustomNode = Node<NodeData>;
type CustomEdge = Edge;

interface FlowEditorProps {
  initialFlow?: Flow;
  onChange?: (flow: Flow) => void;
}

const nodeTypes = {
  trigger: TriggerNode,
  sms: SMSNode,
  email: EmailNode,
  delay: DelayNode,
  condition: ConditionNode,
  input: InputNode,
};

const nodeColors = {
  trigger: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    hover: 'hover:border-violet-300',
  },
  sms: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    hover: 'hover:border-blue-300',
  },
  email: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    hover: 'hover:border-blue-300',
  },
  delay: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hover: 'hover:border-amber-300',
  },
  condition: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    hover: 'hover:border-emerald-300',
  },
  input: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    hover: 'hover:border-rose-300',
  },
};

const nodeIcons = {
  trigger: Play,
  sms: MessageSquare,
  email: Mail,
  delay: Clock,
  condition: GitBranch,
  input: MessageSquare,
};

const getDefaultDataForNodeType = (type: NodeType): NodeData => {
  switch (type) {
    case 'trigger':
      return {
        type: 'trigger',
        title: 'Start Campaign',
      };
    case 'sms':
      return {
        type: 'sms',
        title: 'SMS Message',
        template: '',
      };
    case 'email':
      return {
        type: 'email',
        title: 'Email Message',
        subject: '',
        template: '',
        senderName: '',
      };
    case 'delay':
      return {
        type: 'delay',
        title: 'Delay Step',
        delay: 1,
        unit: 'minutes',
      };
    case 'condition':
      return {
        type: 'condition',
        title: 'Condition Step',
        condition: '',
        trueLabel: 'Yes',
        falseLabel: 'No',
      };
    case 'input':
      return {
        type: 'input',
        title: 'Input Step',
        inputType: 'text',
        placeholder: 'Enter value...',
      };
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
};

export function FlowEditor({ initialFlow, onChange }: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges || []);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  const handleNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node as CustomNode);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleClearFlow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    if (onChange) {
      onChange({ nodes: [], edges: [] });
    }
  }, [setNodes, setEdges, onChange]);

  const handleConnect = useCallback<OnConnect>((connection: Connection) => {
    setEdges((eds) => {
      const newEdges = addEdge(connection, eds);
      if (onChange) {
        onChange({ nodes, edges: newEdges });
      }
      return newEdges;
    });
  }, [nodes, onChange]);

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/nodeType', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const addNode = useCallback((type: NodeType) => {
    if (!reactFlowInstance) return;

    const viewport = reactFlowInstance.getViewport();
    const centerX = (window.innerWidth / 2 - reactFlowWrapper.current!.getBoundingClientRect().left) * (1 / viewport.zoom) - viewport.x;
    const centerY = (window.innerHeight / 2 - reactFlowWrapper.current!.getBoundingClientRect().top) * (1 / viewport.zoom) - viewport.y;

    const newNode: CustomNode = {
      id: `${type}-${nanoid()}`,
      type,
      position: { x: centerX, y: centerY },
      data: getDefaultDataForNodeType(type),
    };

    setNodes((nds) => {
      const newNodes = nds.concat(newNode);
      if (onChange) {
        onChange({ nodes: newNodes, edges });
      }
      return newNodes;
    });
  }, [reactFlowInstance, edges, onChange]);

  const onDragOver = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const nodeType = event.dataTransfer.getData('application/nodeType') as NodeType;
    if (!nodeType || !Object.keys(nodeTypes).includes(nodeType)) return;

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!reactFlowBounds || !reactFlowInstance) return;

    const { zoom } = reactFlowInstance.getViewport();
    const position = {
      x: (event.clientX - reactFlowBounds.left - reactFlowInstance.getViewport().x) / zoom,
      y: (event.clientY - reactFlowBounds.top - reactFlowInstance.getViewport().y) / zoom
    };

    const newNode: CustomNode = {
      id: `${nodeType}-${nanoid()}`,
      type: nodeType,
      position,
      data: getDefaultDataForNodeType(nodeType),
    };

    setNodes((nds) => {
      const newNodes = nds.concat(newNode);
      if (onChange) {
        onChange({ nodes: newNodes, edges });
      }
      return newNodes;
    });
  }, [reactFlowInstance, edges, onChange]);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Delay the onChange call to ensure the state is updated
    requestAnimationFrame(() => {
      if (onChange) {
        onChange({ nodes, edges });
      }
    });
  }, [nodes, edges, onChange, onNodesChange]);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    
    // Delay the onChange call to ensure the state is updated
    requestAnimationFrame(() => {
      if (onChange) {
        onChange({ nodes, edges });
      }
    });
  }, [nodes, edges, onChange, onEdgesChange]);

  return (
    <div className="h-full w-full flex">
      {/* Sidebar */}
      <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-medium text-slate-900">Available Steps</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Triggers Section */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-2">Triggers</h4>
            <div className="grid grid-cols-1 gap-2">
              {(['trigger'] as const).map((type) => {
                const Icon = nodeIcons[type];
                const colors = nodeColors[type];
                return (
                  <button
                    key={type}
                    draggable
                    onDragStart={(event) => onDragStart(event, type)}
                    onClick={() => addNode(type)}
                    className={`group flex items-center gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg} ${colors.hover} transition-colors cursor-grab active:cursor-grabbing`}
                  >
                    <div className={`w-6 h-6 flex items-center justify-center bg-${colors.bg} border ${colors.border}`}>
                      {Icon && <Icon className="w-4 h-4 text-violet-500" />}
                    </div>
                    <span className="text-sm font-medium">Start Campaign</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Section */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-2">Messages</h4>
            <div className="grid grid-cols-1 gap-2">
              <button
                draggable
                onDragStart={(event) => onDragStart(event, 'sms')}
                onClick={() => addNode('sms')}
                className={`group flex items-center gap-3 p-3 rounded-lg border ${nodeColors.sms.border} ${nodeColors.sms.bg} ${nodeColors.sms.hover} transition-colors cursor-grab active:cursor-grabbing`}
              >
                <div className={`w-6 h-6 flex items-center justify-center bg-${nodeColors.sms.bg} border ${nodeColors.sms.border}`}>
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-medium">SMS Message</span>
              </button>
              <button
                draggable
                onDragStart={(event) => onDragStart(event, 'email')}
                onClick={() => addNode('email')}
                className={`group flex items-center gap-3 p-3 rounded-lg border ${nodeColors.email.border} ${nodeColors.email.bg} ${nodeColors.email.hover} transition-colors cursor-grab active:cursor-grabbing`}
              >
                <div className={`w-6 h-6 flex items-center justify-center bg-${nodeColors.email.bg} border ${nodeColors.email.border}`}>
                  <Mail className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-medium">Email Message</span>
              </button>
            </div>
          </div>

          {/* Flow Control Section */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-2">Flow Control</h4>
            <div className="grid grid-cols-1 gap-2">
              {(['delay', 'condition'] as const).map((type) => {
                const Icon = nodeIcons[type];
                const colors = nodeColors[type];
                const iconColors = {
                  delay: 'text-amber-500',
                  condition: 'text-emerald-500',
                };
                return (
                  <button
                    key={type}
                    draggable
                    onDragStart={(event) => onDragStart(event, type)}
                    onClick={() => addNode(type)}
                    className={`group flex items-center gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg} ${colors.hover} transition-colors cursor-grab active:cursor-grabbing`}
                  >
                    <div className={`w-6 h-6 flex items-center justify-center bg-${colors.bg} border ${colors.border}`}>
                      {Icon && <Icon className={`w-4 h-4 ${iconColors[type]}`} />}
                    </div>
                    <span className="text-sm font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Flow Area */}
      <div className="flex-1 relative flex flex-col" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={1.5}
          className="flex-1"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          
          <Panel position="top-right" className="m-4">
            <button
              onClick={handleClearFlow}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
              title="Clear Flow"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Clear All</span>
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}