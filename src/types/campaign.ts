import { Node, Edge } from 'reactflow';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  flow: Flow;
  createdAt: string;
  updatedAt: string;
}

export interface Flow {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

export type NodeType = 'trigger' | 'sms' | 'email' | 'delay' | 'condition' | 'input';

export interface BaseNodeData {
  type: NodeType;
  title: string;
  onChange?: (data: NodeData) => void;
}

export interface TriggerNodeData extends BaseNodeData {
  type: 'trigger';
}

export interface SMSNodeData extends BaseNodeData {
  type: 'sms';
  template: string;
}

export interface EmailNodeData extends BaseNodeData {
  type: 'email';
  subject: string;
  template: string;
  senderName: string;
}

export interface DelayNodeData extends BaseNodeData {
  type: 'delay';
  delay: number;
  unit: 'minutes' | 'hours' | 'days';
}

export interface ConditionNodeData extends BaseNodeData {
  type: 'condition';
  condition: string;
  trueLabel: string;
  falseLabel: string;
}

export interface InputNodeData extends BaseNodeData {
  type: 'input';
  inputType: string;
  placeholder: string;
}

export type NodeData = 
  | TriggerNodeData 
  | SMSNodeData
  | EmailNodeData
  | DelayNodeData 
  | ConditionNodeData 
  | InputNodeData;

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface CampaignState {
  campaigns: Campaign[];
}

export type CampaignAction =
  | { type: 'ADD_CAMPAIGN'; payload: Campaign }
  | { type: 'UPDATE_CAMPAIGN'; payload: Campaign }
  | { type: 'DELETE_CAMPAIGN'; payload: string }
  | { type: 'CLONE_CAMPAIGN'; payload: string }
  | { type: 'UPDATE_FLOW'; payload: { id: string; flow: Flow } }; 