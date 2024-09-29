import type { NextFunction, Request, Response } from "express";

const JobControllers = {
  handleGetAllJobs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // untuk testing di boilerplate, silahkan diubah jika sudah mulai proses development fitur terkait
      res.status(200).json({ message: "Successfully get all jobs", data: [] });
    } catch (error) {
      next(error);
    }
  },
};

export default JobControllers;
