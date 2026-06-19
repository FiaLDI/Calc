import type { Request, Response } from "express";

import { getRequestUserId } from "../../../shared/auth/request-user.js";
import type { DataTransferService } from "../application/data-transfer.service.js";
import type { ImportResult } from "../domain/data-transfer.types.js";

type ImportResponse = {
  data: ImportResult;
};

export class DataTransferController {
  constructor(private readonly service: DataTransferService) {}

  exportData = async (request: Request, response: Response) => {
    const xml = await this.service.exportUserData(getRequestUserId(request));
    const date = new Date().toISOString().slice(0, 10);

    response
      .set({
        "Content-Disposition": `attachment; filename="calc-data-${date}.xml"`,
        "Content-Type": "application/xml; charset=utf-8",
      })
      .send(xml);
  };

  importData = async (
    request: Request<Record<string, string>, ImportResponse, string>,
    response: Response<ImportResponse>
  ) => {
    const result = await this.service.importUserData(
      getRequestUserId(request),
      request.body
    );

    response.json({ data: result });
  };
}
