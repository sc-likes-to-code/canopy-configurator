import React from 'react';
import { Header } from '@/features/configurator/components/Header';
import { CanvasViewer } from '@/features/viewer/components/CanvasViewer';
import { Sidebar } from '@/features/configurator/components/Sidebar';

export const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Top Application Header */}
      <Header />

      {/* Main Studio Workspace: 3D Canvas + Customization Sidebar */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* 3D R3F Viewport Container */}
        <div className="flex-1 h-1/2 md:h-full relative overflow-hidden">
          <CanvasViewer />
        </div>

        {/* Configurator Controls Sidebar */}
        <div className="h-1/2 md:h-full overflow-hidden">
          <Sidebar />
        </div>
      </main>
    </div>
  );
};

export default App;
