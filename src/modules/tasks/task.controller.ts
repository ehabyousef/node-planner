import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { IGoal } from "../../utils/types";
import { goalModel } from "../../DB/models/goal.model";

export const getTasks = expressAsyncHandler(
  async (req: Request, res: Response) => {
    
  },
);
