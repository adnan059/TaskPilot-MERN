import Project from "./../models/Projects.js";
import Workspace from "./../models/Workspace.js";
import Task from "./../models/Task.js";
import { createError } from "../libs/error.js";

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assignees } =
      req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return next(createError(404, "Project not found"));
    }

    const workspace = await Workspace.findById(project.workspace);

    if (!workspace) {
      return next(createError(404, "Workspace not found"));
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return next(createError(403, "You are not a member of this workspace"));
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
      project: projectId,
      createdBy: req.user._id,
    });

    project.tasks.push(newTask._id);
    await project.save();

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};
