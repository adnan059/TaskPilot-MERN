import type { WorkspaceForm } from "@/components/sections/workspace/create-workspace";
import { postData } from "@/lib/fetch-util";
import { useMutation } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: (data: WorkspaceForm) => postData("/workspaces", data),
  });
};
