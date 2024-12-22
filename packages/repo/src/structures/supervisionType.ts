import { SupervisionType as ISupervisionType } from "@workspace/database";
import { injectable } from "tsyringe";

@injectable()
export class SupervisionType implements ISupervisionType {
  typeOfSupervisionId!: number;
  typeOfSupervision!: string;
  calculationFactor!: number;
  validFrom!: number;

  constructor(private data: ISupervisionType) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }
}