import { Response, Request } from "express";


import * as service from "./quote.service";

export async function create(
  req: Request,
  res: Response
) {
  const quote = await service.create(
    req.body,
    req.user!.id
  );

  res.status(201).json(quote);
}

export async function getAll(
  req: Request,
  res: Response
) {
  res.json(await service.getAll());
}

export async function getOne(
  req: Request,
  res: Response
) {
  res.json(
    await service.getOne(Number(req.params.id))
  );
}

export async function remove(
  req: Request,
  res: Response
) {
  await service.remove(Number(req.params.id));

  res.json({
    message: "Deleted",
  });
}
export async function approve(
  req: Request,
  res: Response
) {
  const quote = await service.approve(
    Number(req.params.id),
    req.user!.id
);

  res.json(quote);
}

export async function reject(
  req: Request,
  res: Response
) {
  const quote = await service.reject(
    Number(req.params.id),
    req.user!.id,
    req.body.note
  );

  res.json(quote);
}

export async function convertToInvoice(
  req: Request,
  res: Response
) {
  const invoice =
    await service.convertToInvoice(
      Number(req.params.id),
      req.user!.id
    );

  res.status(201).json(invoice);
}