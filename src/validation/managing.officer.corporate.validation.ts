import { body } from "express-validator";

import { ErrorMessages } from "./error.messages";
import { principal_address_validations, principal_service_address_validations } from "./fields/address.validation";
import { start_date_validations } from "./fields/date.validation";
import { public_register_validations } from "./fields/public-register.validation";

export const managingOfficerCorporate = [
  body("name").not().isEmpty({ ignore_whitespace: true }).withMessage(ErrorMessages.MANAGING_OFFICER_CORPORATE_NAME).isLength({ max: 160 }).withMessage(ErrorMessages.MAX_NAME_LENGTH),

  ...principal_address_validations,

  body("is_service_address_same_as_principal_address").not().isEmpty().withMessage(ErrorMessages.SELECT_IF_MANAGING_OFFICER_SERVICE_ADDRESS_SAME_AS_PRINCIPAL_ADDRESS),

  ...principal_service_address_validations,

  body("legal_form").not().isEmpty({ ignore_whitespace: true }).withMessage(ErrorMessages.LEGAL_FORM).isLength({ max: 4000 }).withMessage(ErrorMessages.MAX_LEGAL_FORM_LENGTH),
  body("law_governed").not().isEmpty({ ignore_whitespace: true }).withMessage(ErrorMessages.LAW_GOVERNED).isLength({ max: 4000 }).withMessage(ErrorMessages.MAX_LAW_GOVERNED_LENGTH),

  body("is_on_register_in_country_formed_in").not().isEmpty().withMessage(ErrorMessages.SELECT_IF_MANAGING_OFFICER_REGISTER_IN_COUNTRY_FORMED_IN),

  ...public_register_validations,
  ...start_date_validations
];