import { Copy, Download, History, ListTree, Trash2 } from 'lucide-react';
import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

const EditorControls: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', margin: '0 12px' }}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Download style={{ cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = 'gray'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'} />
          </TooltipTrigger>
          <TooltipContent>
            <div>Download</div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Copy style={{ cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = 'gray'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'} />
          </TooltipTrigger>
          <TooltipContent>
            <div>Copy</div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <History style={{ cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = 'gray'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'} />
          </TooltipTrigger>
          <TooltipContent>
            <div>History</div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <ListTree style={{ cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = 'gray'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'} />
          </TooltipTrigger>
          <TooltipContent>
            <div>Add Structure</div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Trash2 style={{ cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = 'red'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'} />
          </TooltipTrigger>
          <TooltipContent>
            <div>Delete</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EditorControls;
