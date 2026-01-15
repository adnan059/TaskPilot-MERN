import { createError } from "../libs/error.js";
import Project from "../models/Projects.js";
import Workspace from "../models/Workspace.js";

export const createProject = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return next(createError(404, "Workspace not found"));
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return next(createError(403, "You are not a member of this workspace"));
    }

    const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      workspace: workspaceId,
      members,
      createdBy: req.user._id,
    });

    workspace.projects.push(newProject._id);

    await workspace.save();

    res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
};
