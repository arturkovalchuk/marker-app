import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCampaigns } from '../../context/CampaignContext';
import { FlowEditor } from '../../components/FlowEditor';
import { Flow } from '../../types/campaign';
import { ArrowLeft } from 'lucide-react';
import { ReactFlowProvider } from 'reactflow';

const CampaignFlow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateFlow } = useCampaigns();

  const campaign = state.campaigns.find(c => c.id === id);

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Campaign not found</h2>
        <p className="text-slate-600 mb-4">It might have been deleted or moved</p>
        <button
          onClick={() => navigate('/campaigns')}
          className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-md hover:bg-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to campaigns
        </button>
      </div>
    );
  }

  const handleFlowChange = (flow: Flow) => {
    if (id) {
      console.log('Updating flow:', flow);
      updateFlow(id, flow);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/campaigns')}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
        </div>
      </div>

      <div className="h-[600px] w-full border border-slate-200 rounded-lg bg-white">
        <ReactFlowProvider>
          <FlowEditor initialFlow={campaign.flow} onChange={handleFlowChange} />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default CampaignFlow; 