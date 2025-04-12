import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Campaign, CampaignState, CampaignAction, Flow } from '../types/campaign';

const STORAGE_KEY = 'campaigns';

const initialState: CampaignState = {
  campaigns: []
};

interface CampaignContextType {
  state: CampaignState;
  dispatch: React.Dispatch<CampaignAction>;
  addCampaign: () => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  cloneCampaign: (id: string) => void;
  updateFlow: (id: string, flow: Flow) => void;
}

const CampaignContext = createContext<CampaignContextType | null>(null);

function createDefaultCampaign(index: number): Campaign {
  return {
    id: crypto.randomUUID(),
    name: `Новая кампания #${index}`,
    active: false,
    flow: { nodes: [], edges: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function campaignReducer(state: CampaignState, action: CampaignAction): CampaignState {
  switch (action.type) {
    case 'ADD_CAMPAIGN': {
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload]
      };
    }
    case 'UPDATE_CAMPAIGN': {
      return {
        ...state,
        campaigns: state.campaigns.map(campaign =>
          campaign.id === action.payload.id
            ? { ...action.payload, updatedAt: new Date().toISOString() }
            : campaign
        )
      };
    }
    case 'DELETE_CAMPAIGN': {
      return {
        ...state,
        campaigns: state.campaigns.filter(campaign => campaign.id !== action.payload)
      };
    }
    case 'CLONE_CAMPAIGN': {
      const campaignToClone = state.campaigns.find(c => c.id === action.payload);
      if (!campaignToClone) return state;

      const clone: Campaign = {
        ...campaignToClone,
        id: crypto.randomUUID(),
        name: `${campaignToClone.name} (копия)`,
        active: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        ...state,
        campaigns: [...state.campaigns, clone]
      };
    }
    case 'UPDATE_FLOW': {
      return {
        ...state,
        campaigns: state.campaigns.map(campaign =>
          campaign.id === action.payload.id
            ? {
                ...campaign,
                flow: action.payload.flow,
                updatedAt: new Date().toISOString()
              }
            : campaign
        )
      };
    }
    default:
      return state;
  }
}

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  // Load campaigns from localStorage on mount
  useEffect(() => {
    const savedCampaigns = localStorage.getItem(STORAGE_KEY);
    console.log('Loading campaigns from localStorage:', savedCampaigns);
    if (savedCampaigns) {
      const campaigns = JSON.parse(savedCampaigns);
      console.log('Parsed campaigns:', campaigns);
      campaigns.forEach((campaign: Campaign) => {
        dispatch({ type: 'ADD_CAMPAIGN', payload: campaign });
      });
    }
  }, []);

  // Save campaigns to localStorage when state changes
  useEffect(() => {
    console.log('Saving campaigns to localStorage:', state.campaigns);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.campaigns));
  }, [state.campaigns]);

  const addCampaign = () => {
    const newCampaign = createDefaultCampaign(state.campaigns.length + 1);
    console.log('Creating new campaign:', newCampaign);
    dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
  };

  const updateCampaign = (campaign: Campaign) => {
    console.log('Updating campaign:', campaign);
    dispatch({ type: 'UPDATE_CAMPAIGN', payload: campaign });
  };

  const deleteCampaign = (id: string) => {
    console.log('Deleting campaign:', id);
    dispatch({ type: 'DELETE_CAMPAIGN', payload: id });
  };

  const cloneCampaign = (id: string) => {
    console.log('Cloning campaign:', id);
    dispatch({ type: 'CLONE_CAMPAIGN', payload: id });
  };

  const updateFlow = (id: string, flow: Flow) => {
    console.log('Updating flow for campaign:', id, flow);
    dispatch({ type: 'UPDATE_FLOW', payload: { id, flow } });
  };

  return (
    <CampaignContext.Provider
      value={{
        state,
        dispatch,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        cloneCampaign,
        updateFlow
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
} 