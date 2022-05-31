import { beneficialOwnersStatement } from "./beneficial.owner.statements.validation";
import { beneficialOwnersType } from "./beneficial.owner.type.validation";
import { soldLandFilter } from "./sold.land.filter.validation";
import { entity } from "./entity.validation";
import { managingOfficerCorporate } from "./managing.officer.corporate.validation";
import { managingOfficerIndividual } from "./managing.officer.validation";
import { presenter } from "./presenter.validation";

export const validator = {
  soldLandFilter,
  entity,
  presenter,
  beneficialOwnersStatement,
  beneficialOwnersType,
  managingOfficerIndividual,
  managingOfficerCorporate
};
