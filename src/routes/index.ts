import { Router } from "express";

import * as config from "../config";
import {
  beneficialOwnerGov,
  beneficialOwnerIndividual,
  beneficialOwnerOther,
  beneficialOwnerStatements,
  beneficialOwnerDeleteWarning,
  beneficialOwnerType,
  updateBeneficialOwnerBoMoReview,
  cannotUse,
  checkYourAnswers,
  confirmation,
  entity,
  healthcheck,
  interruptCard,
  updateInterruptCard,
  landing,
  updateLanding,
  overseasEntityQuery,
  overseasEntityReview,
  managingOfficerIndividual,
  managingOfficerCorporate,
  presenter,
  payment,
  soldLandFilter,
  secureRegisterFilter,
  secureUpdateFilter,
  trustInformation,
  usePaper,
  updateUsePaper,
  whoIsMakingFiling,
  dueDiligence,
  overseasEntityDueDiligence,
  accessibilityStatement,
  confirmOverseasEntityDetails,
  signOut,
  trustDetails,
  trustInvolved,
  trustHistoricalbeneficialOwner,
  trustIndividualbeneficialOwner,
  trustLegalEntitybeneficialOwner,
  trustInterrupt,
  addTrust,
  resumeSubmission,
  overseasName,
  startingNew,
  overseasEntityPayment,
  overseasEntityUpdateDetails,
  overseasEntityPresenter,
  whoIsMakingUpdate,
  updateCheckYourAnswers,
  updateDueDiligence,
  updateDueDiligenceOverseasEntity,
  updateConfirmation,
  paymentFailed,
  updateBeneficialOwnerType,
  updateBeneficialOwnerIndividual,
  updateBeneficialOwnerGov,
  updateBeneficialOwnerStatements,
  updateSignOut,
  updateBeneficialOwnerOther,
  confirmToRemove,
  updateManagingOfficerIndividual,
  updateManagingOfficerCorporate,
  updateFilingDate,
  updateRegistrableBeneficialOwner,
  updateContinueSavedFiling,
  updateReviewOverseasEntityInformation,
  updateReviewBeneficialOwnerIndividual,
  updateReviewBeneficialOwnerOther,
  updateReviewBeneficialOwnerGov,
  resumeUpdateSubmission,
  updateReviewIndividualManagingOfficer
} from "../controllers";

import { serviceAvailabilityMiddleware } from "../middleware/service.availability.middleware";
import { authentication } from "../middleware/authentication.middleware";
import { navigation } from "../middleware/navigation";
import { checkTrustValidations, checkValidations } from "../middleware/validation.middleware";
import { isFeatureEnabled } from '../middleware/is.feature.enabled.middleware';
import { validator } from "../validation";
import { companyAuthentication } from "../middleware/company.authentication.middleware";

const router = Router();

router.use(serviceAvailabilityMiddleware);

router.get(config.HEALTHCHECK_URL, healthcheck.get);
router.get(config.ACCESSIBILITY_STATEMENT_URL, accessibilityStatement.get);

router.get(config.LANDING_URL, landing.get);

router.get(config.SIGN_OUT_URL, signOut.get);
router.post(config.SIGN_OUT_URL, ...validator.signOut, checkValidations, signOut.post);

router.get(config.RESUME_SUBMISSION_URL, authentication, resumeSubmission.get);

router.get(config.STARTING_NEW_URL, authentication, startingNew.get);
router.post(config.STARTING_NEW_URL, authentication, ...validator.startingNew, checkValidations, startingNew.post);

router.get(config.SOLD_LAND_FILTER_URL, authentication, soldLandFilter.get);
router.post(config.SOLD_LAND_FILTER_URL, authentication, ...validator.soldLandFilter, checkValidations, soldLandFilter.post);

router.get(config.CANNOT_USE_URL, authentication, cannotUse.get);

router.get(config.SECURE_REGISTER_FILTER_URL, authentication, navigation.hasSoldLand, secureRegisterFilter.get);
router.post(config.SECURE_REGISTER_FILTER_URL, authentication, navigation.hasSoldLand, ...validator.secureRegisterFilter, checkValidations, secureRegisterFilter.post);

router.get(config.USE_PAPER_URL, authentication, navigation.hasSoldLand, usePaper.get);

router.get(config.INTERRUPT_CARD_URL, authentication, navigation.isSecureRegister, interruptCard.get);

router.get(config.OVERSEAS_NAME_URL, authentication, navigation.isSecureRegister, overseasName.get);
router.post(config.OVERSEAS_NAME_URL, authentication, navigation.isSecureRegister, ...validator.overseasName, checkValidations, overseasName.post);

router.get(config.PRESENTER_URL, authentication, navigation.hasOverseasName, presenter.get);
router.post(config.PRESENTER_URL, authentication, navigation.hasOverseasName, ...validator.presenter, checkValidations, presenter.post);

router.get(config.WHO_IS_MAKING_FILING_URL, authentication, navigation.hasPresenter, whoIsMakingFiling.get);
router.post(config.WHO_IS_MAKING_FILING_URL, authentication, navigation.hasPresenter, ...validator.whoIsMakingFiling, checkValidations, whoIsMakingFiling.post);

router.get(config.DUE_DILIGENCE_URL, authentication, navigation.hasPresenter, dueDiligence.get);
router.post(config.DUE_DILIGENCE_URL, authentication, navigation.hasPresenter, ...validator.dueDiligence, checkValidations, dueDiligence.post);

router.get(config.OVERSEAS_ENTITY_DUE_DILIGENCE_URL, authentication, navigation.hasPresenter, overseasEntityDueDiligence.get);
router.post(config.OVERSEAS_ENTITY_DUE_DILIGENCE_URL, authentication, navigation.hasPresenter, ...validator.overseasEntityDueDiligence, checkValidations, overseasEntityDueDiligence.post);

router.get(config.ENTITY_URL, authentication, navigation.hasDueDiligence, entity.get);
router.post(config.ENTITY_URL, authentication, navigation.hasDueDiligence, ...validator.entity, checkValidations, entity.post);

router.get(config.BENEFICIAL_OWNER_STATEMENTS_URL, authentication, navigation.hasEntity, beneficialOwnerStatements.get);
router.post(config.BENEFICIAL_OWNER_STATEMENTS_URL, authentication, navigation.hasEntity, ...validator.beneficialOwnersStatement, checkValidations, beneficialOwnerStatements.post);

router.get(config.BENEFICIAL_OWNER_DELETE_WARNING_URL, authentication, navigation.hasBeneficialOwnersStatement, beneficialOwnerDeleteWarning.get);
router.post(config.BENEFICIAL_OWNER_DELETE_WARNING_URL, authentication, navigation.hasBeneficialOwnersStatement, ...validator.beneficialOwnerDeleteWarning, checkValidations, beneficialOwnerDeleteWarning.post);

router.get(config.BENEFICIAL_OWNER_TYPE_URL, authentication, navigation.hasBeneficialOwnersStatement, beneficialOwnerType.get);
router.post(config.BENEFICIAL_OWNER_TYPE_URL, authentication, navigation.hasBeneficialOwnersStatement, ...validator.beneficialOwnersType, checkValidations, beneficialOwnerType.post);
router.post(config.BENEFICIAL_OWNER_TYPE_SUBMIT_URL, authentication, navigation.hasBeneficialOwnersStatement, ...validator.beneficialOwnersTypeSubmission, checkValidations, beneficialOwnerType.postSubmit);

router.route(config.BENEFICIAL_OWNER_INDIVIDUAL_URL)
  .all(
    authentication,
    navigation.hasBeneficialOwnersStatement
  )
  .get(beneficialOwnerIndividual.get)
  .post(...validator.beneficialOwnerIndividual, checkValidations, beneficialOwnerIndividual.post);

router.route(config.BENEFICIAL_OWNER_INDIVIDUAL_URL + config.ID)
  .all(
    authentication,
    navigation.hasBeneficialOwnersStatement
  )
  .get(beneficialOwnerIndividual.getById)
  .post(...validator.beneficialOwnerIndividual, checkValidations, beneficialOwnerIndividual.update);
router.get(config.BENEFICIAL_OWNER_INDIVIDUAL_URL + config.REMOVE + config.ID, authentication, navigation.hasBeneficialOwnersStatement, beneficialOwnerIndividual.remove);

router.route(config.BENEFICIAL_OWNER_OTHER_URL)
  .all(
    authentication,
    navigation.hasBeneficialOwnersStatement
  )
  .get(beneficialOwnerOther.get)
  .post(...validator.beneficialOwnerOther, checkValidations, beneficialOwnerOther.post);

router.route(config.BENEFICIAL_OWNER_OTHER_URL + config.ID)
  .all(
    authentication,
    navigation.hasBeneficialOwnersStatement
  )
  .get(beneficialOwnerOther.getById)
  .post(...validator.beneficialOwnerOther, checkValidations, beneficialOwnerOther.update);
router.get(config.BENEFICIAL_OWNER_OTHER_URL + config.REMOVE + config.ID, authentication, navigation.hasBeneficialOwnersStatement, beneficialOwnerOther.remove);

router.route(config.BENEFICIAL_OWNER_GOV_URL)
  .all(
    authentication,
    navigation.hasBeneficialOwnersStatement
  )
  .get(beneficialOwnerGov.get)
  .post(...validator.beneficialOwnerGov, checkValidations, beneficialOwnerGov.post);

router.route(config.BENEFICIAL_OWNER_GOV_URL + config.ID)
  .all(
    authentication,
    navigation.hasBeneficialOwnersStatement
  )
  .get(beneficialOwnerGov.getById)
  .post(...validator.beneficialOwnerGov, checkValidations, beneficialOwnerGov.update);
router.get(config.BENEFICIAL_OWNER_GOV_URL + config.REMOVE + config.ID, authentication, navigation.hasBeneficialOwnersStatement, beneficialOwnerGov.remove);

router.get(config.MANAGING_OFFICER_URL, authentication, navigation.hasBeneficialOwnersStatement, managingOfficerIndividual.get);
router.get(config.MANAGING_OFFICER_URL + config.ID, authentication, navigation.hasBeneficialOwnersStatement, managingOfficerIndividual.getById);
router.post(config.MANAGING_OFFICER_URL, authentication, navigation.hasBeneficialOwnersStatement, ...validator.managingOfficerIndividual, checkValidations, managingOfficerIndividual.post);
router.post(config.MANAGING_OFFICER_URL + config.ID, authentication, navigation.hasBeneficialOwnersStatement, ...validator.managingOfficerIndividual, checkValidations, managingOfficerIndividual.update);
router.get(config.MANAGING_OFFICER_URL + config.REMOVE + config.ID, authentication, navigation.hasBeneficialOwnersStatement, managingOfficerIndividual.remove);

router.get(config.MANAGING_OFFICER_CORPORATE_URL, authentication, navigation.hasBeneficialOwnersStatement, managingOfficerCorporate.get);
router.get(config.MANAGING_OFFICER_CORPORATE_URL + config.ID, authentication, navigation.hasBeneficialOwnersStatement, managingOfficerCorporate.getById);
router.post(config.MANAGING_OFFICER_CORPORATE_URL, authentication, navigation.hasBeneficialOwnersStatement, ...validator.managingOfficerCorporate, checkValidations, managingOfficerCorporate.post);
router.post(config.MANAGING_OFFICER_CORPORATE_URL + config.ID, authentication, navigation.hasBeneficialOwnersStatement, ...validator.managingOfficerCorporate, checkValidations, managingOfficerCorporate.update);
router.get(config.MANAGING_OFFICER_CORPORATE_URL + config.REMOVE + config.ID, authentication, navigation.hasBeneficialOwnersStatement, managingOfficerCorporate.remove);

// TO DO: add a navigation middleware that has got only BOs with the right NOC selected
router.get(
  config.TRUST_INFO_URL, authentication, navigation.hasBOsOrMOs,
  trustInformation.get
);
router.post(config.TRUST_INFO_URL, authentication, navigation.hasBOsOrMOs, ...validator.trustInformation, checkTrustValidations, trustInformation.post);

router
  .route(config.TRUST_ENTRY_URL + config.TRUST_INTERRUPT_URL)
  .all(
    isFeatureEnabled(config.FEATURE_FLAG_ENABLE_TRUSTS_WEB),
    authentication,
  )
  .get(trustInterrupt.get)
  .post(trustInterrupt.post);

router
  .route(config.TRUST_ENTRY_URL + config.ADD_TRUST_URL)
  .all(
    isFeatureEnabled(config.FEATURE_FLAG_ENABLE_TRUSTS_WEB),
    authentication,
    navigation.hasTrustData,
  )
  .get(addTrust.get)
  .post(...validator.addTrust, addTrust.post);

router
  .route(config.TRUST_DETAILS_URL + config.TRUST_ID + '?')
  .all(
    isFeatureEnabled(config.FEATURE_FLAG_ENABLE_TRUSTS_WEB),
    authentication,
    navigation.hasBOsOrMOs,
  )
  .get(trustDetails.get)
  .post(...validator.trustDetails, trustDetails.post);

router
  .route(config.TRUST_ENTRY_URL + config.TRUST_ID + config.TRUST_INVOLVED_URL)
  .all(
    isFeatureEnabled(config.FEATURE_FLAG_ENABLE_TRUSTS_WEB),
    authentication,
    navigation.hasTrustWithId,
  )
  .get(trustInvolved.get)
  .post(
    ...validator.trustInvolved,
    trustInvolved.post,
  );

router
  .route(config.TRUST_ENTRY_URL + config.TRUST_ID + config.TRUST_HISTORICAL_BENEFICIAL_OWNER_URL + config.TRUSTEE_ID + '?')
  .all(
    isFeatureEnabled(config.FEATURE_FLAG_ENABLE_TRUSTS_WEB),
    authentication,
    navigation.hasTrustWithId,
  )
  .get(trustHistoricalbeneficialOwner.get)
  .post(...validator.trustHistoricalBeneficialOwner, trustHistoricalbeneficialOwner.post);

router
  .route(config.TRUST_ENTRY_URL + config.TRUST_ID + config.TRUST_INDIVIDUAL_BENEFICIAL_OWNER_URL + config.TRUSTEE_ID + '?')
  .all(
    isFeatureEnabled(config.FEATURE_FLAG_ENABLE_TRUSTS_WEB),
    authentication,
    navigation.hasTrustWithId,
  )
  .get(trustIndividualbeneficialOwner.get)
  .post(...validator.trustIndividualBeneficialOwner, trustIndividualbeneficialOwner.post);

router
  .route(config.TRUST_ENTRY_URL + config.TRUST_ID + config.TRUST_LEGAL_ENTITY_BENEFICIAL_OWNER_URL + config.TRUSTEE_ID + '?')
  .all(
    isFeatureEnabled(config.FEATURE_FLAG_ENABLE_TRUSTS_WEB),
    authentication,
    navigation.hasTrustWithId,
  )
  .get(trustLegalEntitybeneficialOwner.get)
  .post(...validator.trustLegalEntityBeneficialOwnerValidator, trustLegalEntitybeneficialOwner.post);

router
  .route(config.TRUST_ENTRY_URL + config.TRUST_ID + config.TRUST_BENEFICIAL_OWNER_DETACH_URL + config.BO_ID)
  .get((_req, res) => {
    return res.render('#TODO BENEFICIAL OWNER DETACH FROM TRUST PAGE');
  });

router.get(config.CHECK_YOUR_ANSWERS_URL, authentication, navigation.hasBOsOrMOs, checkYourAnswers.get);
router.post(config.CHECK_YOUR_ANSWERS_URL, authentication, navigation.hasBOsOrMOs, checkYourAnswers.post);

router.get(config.PAYMENT_WITH_TRANSACTION_URL, authentication, payment.get);

router.get(config.PAYMENT_FAILED_URL, authentication, paymentFailed.get);

router.get(config.CONFIRMATION_URL, authentication, navigation.hasBOsOrMOs, confirmation.get);

// Routes for UPDATE journey
router.get(config.UPDATE_LANDING_URL, updateLanding.get);

router.get(config.RESUME_UPDATE_SUBMISSION_URL, authentication, resumeUpdateSubmission.get);

router.route(config.SECURE_UPDATE_FILTER_URL)
  .all(authentication)
  .get(secureUpdateFilter.get)
  .post(...validator.secureRegisterFilter, checkValidations, secureUpdateFilter.post);

router.route(config.UPDATE_USE_PAPER_URL)
  .all(authentication)
  .get(updateUsePaper.get);

router.route(config.UPDATE_INTERRUPT_CARD_URL)
  .all(authentication)
  .get(updateInterruptCard.get)
  .post(updateInterruptCard.post);

router.get(config.UPDATE_CONFIRMATION_URL, authentication, companyAuthentication, navigation.hasBOsOrMOsUpdate, updateConfirmation.get);

router.get(config.OVERSEAS_ENTITY_QUERY_URL, authentication, overseasEntityQuery.get);
router.post(config.OVERSEAS_ENTITY_QUERY_URL, authentication, ...validator.overseasEntityQuery, checkValidations, overseasEntityQuery.post);

router.route(config.UPDATE_SIGN_OUT_URL)
  .get(updateSignOut.get)
  .post(...validator.signOut, checkValidations, updateSignOut.post);

router.route(config.UPDATE_OVERSEAS_ENTITY_CONFIRM_URL)
  .all(
    authentication,
    navigation.hasOverseasEntity
  )
  .get(confirmOverseasEntityDetails.get)
  .post(companyAuthentication, confirmOverseasEntityDetails.post);

router.route(config.OVERSEAS_ENTITY_PRESENTER_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasOverseasEntityNumber
  )
  .get(overseasEntityPresenter.get)
  .post(...validator.presenter, checkValidations, overseasEntityPresenter.post);

router.route(config.UPDATE_BENEFICIAL_OWNER_STATEMENTS_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasOverseasEntity
  )
  .get(updateBeneficialOwnerStatements.get)
  .post(...validator.updateBeneficialOwnerStatements, checkValidations, updateBeneficialOwnerStatements.post);

router.get(config.OVERSEAS_ENTITY_PAYMENT_WITH_TRANSACTION_URL, authentication, companyAuthentication, overseasEntityPayment.get);

router.route(config.OVERSEAS_ENTITY_UPDATE_DETAILS_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasOverseasEntityNumber
  )
  .get(overseasEntityUpdateDetails.get)
  .post(...validator.entity, ...validator.overseasName, checkValidations, overseasEntityUpdateDetails.post);

router.route(config.WHO_IS_MAKING_UPDATE_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(whoIsMakingUpdate.get)
  .post(...validator.whoIsMakingUpdate, checkValidations, whoIsMakingUpdate.post);

router.route(config.UPDATE_DUE_DILIGENCE_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasWhoIsMakingUpdate
  )
  .get(updateDueDiligence.get)
  .post(...validator.dueDiligence, checkValidations, updateDueDiligence.post);

router.route(config.UPDATE_DUE_DILIGENCE_OVERSEAS_ENTITY_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasWhoIsMakingUpdate
  )
  .get(updateDueDiligenceOverseasEntity.get)
  .post(...validator.overseasEntityDueDiligence, checkValidations, updateDueDiligenceOverseasEntity.post);

router.route(config.OVERSEAS_ENTITY_REVIEW_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasOverseasEntity
  )
  .get(overseasEntityReview.get)
  .post(overseasEntityReview.post);

router.route(config.UPDATE_REVIEW_OVERSEAS_ENTITY_INFORMATION_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasDueDiligenceDetails
  )
  .get(updateReviewOverseasEntityInformation.get)
  .post(updateReviewOverseasEntityInformation.post);

router.route(config.UPDATE_BENEFICIAL_OWNER_BO_MO_REVIEW_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateBeneficialOwnerBoMoReview.get)
  .post(updateBeneficialOwnerBoMoReview.post);

router.route(config.UPDATE_CHECK_YOUR_ANSWERS_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasBOsOrMOsUpdate
  )
  .get(updateCheckYourAnswers.get)
  .post(updateCheckYourAnswers.post);

router.route(config.UPDATE_BENEFICIAL_OWNER_TYPE_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateBeneficialOwnerType.get)
  .post(...validator.updateBeneficialOwnerAndManagingOfficerType, checkValidations, updateBeneficialOwnerType.post);

router.post(config.UPDATE_BENEFICIAL_OWNER_TYPE_SUBMIT_URL, authentication, navigation.hasUpdatePresenter, updateBeneficialOwnerType.postSubmit);

router.route(config.UPDATE_REVIEW_BENEFICIAL_OWNER_OTHER_URL)
  .all(
    authentication,
    companyAuthentication,
  )
  .get(updateReviewBeneficialOwnerOther.get)
  .post(...validator.updateBeneficialOwnerOther, checkValidations, updateReviewBeneficialOwnerOther.post);

router.route(config.UPDATE_REVIEW_BENEFICIAL_OWNER_OTHER_URL + config.UPDATE_REVIEW_OWNERS_PARAMS)
  .all(
    authentication,
    navigation.hasUpdatePresenter
  )
  .get(updateReviewBeneficialOwnerOther.get);

router.route(config.UPDATE_BENEFICIAL_OWNER_GOV_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateBeneficialOwnerGov.get)
  .post(...validator.updateBeneficialOwnerGov, checkValidations, updateBeneficialOwnerGov.post);

router.route(config.UPDATE_BENEFICIAL_OWNER_GOV_URL + config.ID)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateBeneficialOwnerGov.getById)
  .post(...validator.updateBeneficialOwnerGov, checkValidations, updateBeneficialOwnerGov.update);

router.route(config.UPDATE_REVIEW_INDIVIDUAL_MANAGING_OFFICER_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateReviewIndividualManagingOfficer.get)
  .post(...validator.reviewManagingOfficers, checkValidations, updateReviewIndividualManagingOfficer.post);

router.route(config.UPDATE_REVIEW_INDIVIDUAL_MANAGING_OFFICER_URL + config.UPDATE_REVIEW_OWNERS_PARAMS)
  .all(
    authentication,
    navigation.hasUpdatePresenter
  )
  .get(updateReviewIndividualManagingOfficer.get);

router.route(config.UPDATE_REVIEW_BENEFICIAL_OWNER_GOV_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateReviewBeneficialOwnerGov.get)
  .post(...validator.updateReviewBeneficialOwnerGovValidator, checkValidations, updateReviewBeneficialOwnerGov.post);

router.route(config.UPDATE_REVIEW_BENEFICIAL_OWNER_GOV_URL + config.UPDATE_REVIEW_OWNERS_PARAMS)
  .all(
    authentication,
    navigation.hasUpdatePresenter
  )
  .get(updateReviewBeneficialOwnerGov.get);

router.route(config.UPDATE_REVIEW_BENEFICIAL_OWNER_INDIVIDUAL_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateReviewBeneficialOwnerIndividual.get)
  .post(...validator.updateBeneficialOwnerAndReviewValidator, checkValidations, updateReviewBeneficialOwnerIndividual.post);

router.route(config.UPDATE_REVIEW_BENEFICIAL_OWNER_INDIVIDUAL_URL + config.UPDATE_REVIEW_OWNERS_PARAMS)
  .all(
    authentication,
    navigation.hasUpdatePresenter
  )
  .get(updateReviewBeneficialOwnerIndividual.get);

router.route(config.UPDATE_BENEFICIAL_OWNER_INDIVIDUAL_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateBeneficialOwnerIndividual.get)
  .post(...validator.updateBeneficialOwnerIndividual, checkValidations, updateBeneficialOwnerIndividual.post);

router.route(config.UPDATE_BENEFICIAL_OWNER_INDIVIDUAL_URL + config.ID)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateBeneficialOwnerIndividual.getById)
  .post(...validator.updateBeneficialOwnerIndividual, checkValidations, updateBeneficialOwnerIndividual.update);

router.route(config.UPDATE_MANAGING_OFFICER_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateManagingOfficerIndividual.get)
  .post(...validator.updateManagingOfficerIndividual, checkValidations, updateManagingOfficerIndividual.post);

router.route(config.UPDATE_MANAGING_OFFICER_URL + config.ID)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateManagingOfficerIndividual.getById)
  .post(...validator.updateManagingOfficerIndividual, checkValidations, updateManagingOfficerIndividual.update);
router.get(config.UPDATE_MANAGING_OFFICER_URL + config.REMOVE + config.ID, authentication, navigation.hasUpdatePresenter, updateManagingOfficerIndividual.remove);

router.route(config.UPDATE_BENEFICIAL_OWNER_OTHER_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateBeneficialOwnerOther.get)
  .post(...validator.updateBeneficialOwnerOther, checkValidations, updateBeneficialOwnerOther.post);

router.route(config.UPDATE_BENEFICIAL_OWNER_OTHER_URL + config.ID)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateBeneficialOwnerOther.getById)
  .post(...validator.updateBeneficialOwnerOther, checkValidations, updateBeneficialOwnerOther.update);

router.route(config.UPDATE_MANAGING_OFFICER_CORPORATE_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateManagingOfficerCorporate.get)
  .post(...validator.updateManagingOfficerCorporate, checkValidations, updateManagingOfficerCorporate.post);

router.route(config.UPDATE_MANAGING_OFFICER_CORPORATE_URL + config.ID)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasUpdatePresenter
  )
  .get(updateManagingOfficerCorporate.getById)
  .post(...validator.updateManagingOfficerCorporate, checkValidations, updateManagingOfficerCorporate.update);
router.get(config.UPDATE_MANAGING_OFFICER_CORPORATE_URL + config.REMOVE + config.ID, authentication, navigation.hasUpdatePresenter, updateManagingOfficerCorporate.remove);

router.route(config.UPDATE_CONFIRM_TO_REMOVE_URL + config.ROUTE_PARAM_BENEFICIAL_OWNER_TYPE + config.ID)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasGivenValidBODetails
  )
  .get(confirmToRemove.get)
  .post(...validator.confirmToRemove, checkValidations, confirmToRemove.post);

router.route(config.UPDATE_FILING_DATE_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasOverseasEntity
  )
  .get(updateFilingDate.get)
  .post(...validator.updateFilingDate, checkValidations, updateFilingDate.post);

router.route(config.UPDATE_REGISTRABLE_BENEFICIAL_OWNER_URL)
  .all(
    authentication,
    companyAuthentication,
    navigation.hasOverseasEntity
  )
  .get(updateRegistrableBeneficialOwner.get)
  .post(...validator.registrableBeneficialOwner, checkValidations, updateRegistrableBeneficialOwner.post);

router.route(config.UPDATE_CONTINUE_WITH_SAVED_FILING_URL)
  .all(authentication)
  .get(updateContinueSavedFiling.get)
  .post(...validator.updateContinueSavedFiling, checkValidations, updateContinueSavedFiling.post);

export default router;
