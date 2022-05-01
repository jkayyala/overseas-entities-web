import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import * as config from "../config";
import { ApplicationData, ApplicationDataType, beneficialOwnerGovType } from "../model";
import { getApplicationData, mapFieldsToDataObject, prepareData, setApplicationData } from "../utils/application.data";
import { AddressKeys, BeneficialOwnerNoc, HasSamePrincipalAddressKey, InputDateKeys, NonLegalFirmNoc } from "../model/data.types.model";

export const get = (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debugRequest(req, `GET ${config.BENEFICIAL_OWNER_GOV_PAGE}`);

    const appData: ApplicationData = getApplicationData(req.session);

    return res.render(config.BENEFICIAL_OWNER_GOV_PAGE, {
      backLinkUrl: config.BENEFICIAL_OWNER_TYPE_URL,
      ...appData.beneficial_owners_government_or_public_authority
    });
  } catch (error) {
    logger.errorRequest(req, error);
    next(error);
  }
};

export const post = (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debugRequest(req, `POST ${config.BENEFICIAL_OWNER_GOV_PAGE}`);

    const data: ApplicationDataType = prepareData(req.body, beneficialOwnerGovType.BeneficialOwnerGovKeys);

    data[beneficialOwnerGovType.PrincipalAddressKey] =
        mapFieldsToDataObject(req.body, beneficialOwnerGovType.PrincipalAddressKeys, AddressKeys);
    data[beneficialOwnerGovType.ServiceAddressKey] =
        mapFieldsToDataObject(req.body, beneficialOwnerGovType.ServiceAddressKeys, AddressKeys);

    data[beneficialOwnerGovType.StartDateKey] =
        mapFieldsToDataObject(req.body, beneficialOwnerGovType.StartDateKeys, InputDateKeys);

    // It needs concatenations because if in the check boxes we select only one option
    // nunjucks returns just a string and with concat we will return an array.
    data[BeneficialOwnerNoc] = (data[BeneficialOwnerNoc]) ? [].concat(data[BeneficialOwnerNoc]) : [];
    data[NonLegalFirmNoc] = (data[NonLegalFirmNoc]) ? [].concat(data[NonLegalFirmNoc]) : [];

    data[HasSamePrincipalAddressKey] = (data[HasSamePrincipalAddressKey]) ? +data[HasSamePrincipalAddressKey] : '';

    setApplicationData(req.session, data, beneficialOwnerGovType.BeneficialOwnerGovKey);

    return res.redirect(config.BENEFICIAL_OWNER_TYPE_URL);
  } catch (error) {
    logger.errorRequest(req, error);
    next(error);
  }
};
