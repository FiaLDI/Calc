import type { DataTransferRepository } from "../infrastructure/data-transfer.repository.js";
import { buildUserDataXml, parseUserDataXml } from "./data-transfer.xml.js";

export class DataTransferService {
  constructor(private readonly repository: DataTransferRepository) {}

  exportUserData(userId: string) {
    return buildUserDataXml(userId, this.repository);
  }

  importUserData(userId: string, xml: string) {
    return this.repository.replaceUserData(userId, parseUserDataXml(xml));
  }
}
