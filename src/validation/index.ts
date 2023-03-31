import { beneficialOwnerGov } from "./beneficial.owner.gov.validation";
import { beneficialOwnerIndividual } from "./beneficial.owner.individual.validation";
import { beneficialOwnerOther } from "./beneficial.owner.other.validation";
import { beneficialOwnersStatement } from "./beneficial.owner.statements.validation";
import { beneficialOwnerDeleteWarning } from "./beneficial.owner.delete.warning.validation";
import { beneficialOwnersType, updateBeneficialOwnerAndManagingOfficerType } from "./beneficial.owner.type.validation";
import { soldLandFilter } from "./sold.land.filter.validation";
import { entity } from "./entity.validation";
import { managingOfficerCorporate } from "./managing.officer.corporate.validation";
import { managingOfficerIndividual } from "./managing.officer.validation";
import { presenter } from "./presenter.validation";
import { overseasEntityQuery } from "./overseas.entity.query.validation";
import { secureRegisterFilter } from "./secure.register.filter.validation";
import { trustInformation } from "./trust.information.validation";
import { whoIsMakingFiling, whoIsMakingUpdate } from "./who.is.making.filing.validation";
import { dueDiligence } from "./due.diligence.validation";
import { overseasEntityDueDiligence } from "./overseas.entity.due.diligence.validation";
import { signOut } from "./sign.out.validation";
import { overseasName } from "./overseas.name.validation";
import { startingNew } from "./starting.new.validation";
import { trustInvolved } from './trust.involved.validation';
import { beneficialOwnersTypeSubmission } from "./beneficial.owner.type.validation.submission";
import { trustDetails } from "./trust.details.validation";
import { trustIndividualBeneficialOwner } from "./trust.individual.beneficial.owner.validation";
import { trustHistoricalBeneficialOwner } from "./trust.historical.beneficial.owner.validation";
import { addTrustValidations } from "./add.trust.validation";
import { updateBeneficialOwnerStatements } from "./update.beneficial.owner.statements.validation";
import { trustLegalEntityBeneficialOwnerValidator } from "./trust-legal-entity-beneficial-owner.validation";
import { registrableBeneficialOwner } from "./registrable.beneficial.owner.validation";

export const validator = {
  soldLandFilter,
  secureRegisterFilter,
  entity,
  presenter,
  overseasEntityQuery,
  beneficialOwnersStatement,
  beneficialOwnersType,
  beneficialOwnersTypeSubmission,
  managingOfficerIndividual,
  managingOfficerCorporate,
  beneficialOwnerIndividual,
  beneficialOwnerOther,
  beneficialOwnerGov,
  whoIsMakingFiling,
  whoIsMakingUpdate,
  dueDiligence,
  overseasEntityDueDiligence,
  trustInformation,
  beneficialOwnerDeleteWarning,
  signOut,
  overseasName,
  startingNew,
  trustInvolved,
  trustDetails,
  updateBeneficialOwnerAndManagingOfficerType,
  updateBeneficialOwnerStatements,
  trustIndividualBeneficialOwner,
  trustHistoricalBeneficialOwner,
  addTrust: addTrustValidations,
  trustLegalEntityBeneficialOwnerValidator,
  registrableBeneficialOwner
};
