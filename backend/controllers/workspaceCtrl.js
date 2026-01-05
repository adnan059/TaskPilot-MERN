import Workspace from "../models/Workspace.js";

export const createWorkspace = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req?.user?._id,
      members: [
        {
          user: req?.user?._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    res.status(201).json(workspace);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user?._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(workspaces);
  } catch (error) {
    next(error);
  }
};
