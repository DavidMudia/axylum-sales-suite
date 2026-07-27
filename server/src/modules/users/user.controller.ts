import { Request, Response } from "express";

import * as service from "./user.service";

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export async function create(
  req: Request,
  res: Response
) {
  const user =
    await service.create(req.body);

  return res.status(201).json({
    message:
      "User created successfully.",
    user,
  });
}

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

export async function getAll(
  req: Request,
  res: Response
) {
  const search =
    req.query.search as
      | string
      | undefined;

  const page =
    Number(req.query.page) || 1;

  const limit =
    Number(req.query.limit) ||
    20;

  const users =
    await service.getAll(
      search,
      page,
      limit
    );

  return res.json(users);
}

/*
|--------------------------------------------------------------------------
| Get One User
|--------------------------------------------------------------------------
*/

export async function getOne(
  req: Request,
  res: Response
) {
  const user =
    await service.getOne(
      Number(req.params.id)
    );

  return res.json(user);
}

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export async function update(req: Request, res: Response) {
  const user = await service.update(
    Number(req.params.id),
    {
      ...req.body,
      currentUserId: req.user.id, // add the logged-in user's id
    }
  );
  // ...
}
/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Activate User
|--------------------------------------------------------------------------
*/

export async function activate(
  req: Request,
  res: Response
) {
  const user =
    await service.activate(
      Number(req.params.id)
    );

  return res.json({
    message:
      "User activated successfully.",
    user,
  });
}

/*
|--------------------------------------------------------------------------
| Deactivate User
|--------------------------------------------------------------------------
*/

export async function deactivate(
  req: Request,
  res: Response
) {
  const user =
    await service.deactivate(
      Number(req.params.id)
    );

  return res.json({
    message:
      "User deactivated successfully.",
    user,
  });
}

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export async function remove(
  req: Request,
  res: Response
) {
  await service.remove(
    Number(req.params.id)
  );

  return res.json({
    message:
      "User deleted successfully.",
  });
}

/*
|--------------------------------------------------------------------------
| Restore User
|--------------------------------------------------------------------------
*/

export async function restore(
  req: Request,
  res: Response
) {
  const user =
    await service.restore(
      Number(req.params.id)
    );

  return res.json({
    message:
      "User restored successfully.",
    user,
  });
}

/*
|--------------------------------------------------------------------------
| User Statistics
|--------------------------------------------------------------------------
*/

export async function stats(
  req: Request,
  res: Response
) {
  const statistics =
    await service.stats();

  return res.json(statistics);
}
export async function changePassword(req: Request, res: Response) {
  const userId = req.user.id;
  await service.changePassword(userId, req.body.currentPassword, req.body.newPassword);
  res.json({ message: "Password changed successfully." });
}