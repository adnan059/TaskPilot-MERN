import Header from "@/components/layout/header";
import SidebarComponent from "@/components/layout/sidebar-component";
import CreateWorkspace from "@/components/sections/workspace/create-workspace";
import Loader from "@/components/shared/loader";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router";

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );

  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={"/sign-in"} />;
  }

  return (
    <div className="flex h-screen w-full">
      <SidebarComponent currentWorkspace={currentWorkspace} />
      <div className="flex flex-1 flex-col h-full">
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
      {/* create work space */}
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
