import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { logger } from "../utils/logger";
import { saveAndContinue } from "../utils/save.and.continue";
import { ApplicationDataType } from "../model";
import { getFromApplicationData, mapDataObjectToFields, mapFieldsToDataObject, prepareData, removeFromApplicationData, setApplicationData } from "../utils/application.data";
import {
  AddressKeys,
  BeneficialOwnerNoc,
  HasSamePrincipalAddressKey,
  ID,
  InputDateKeys,
  IsOnSanctionsListKey,
  NonLegalFirmNoc
} from "../model/data.types.model";
import { PrincipalAddressKey, PrincipalAddressKeys, ServiceAddressKey, ServiceAddressKeys } from "../model/address.model";
import { StartDateKey, StartDateKeys } from "../model/date.model";
import { BeneficialOwnerGovKey, BeneficialOwnerGovKeys } from "../model/beneficial.owner.gov.model";
import { v4 as uuidv4 } from "uuid";

export const getBeneficialOwnerGov = (req: Request, res: Response, templateName: string, backLinkUrl: string) => {
  logger.debugRequest(req, `${req.method} ${req.route.path}`);

  res.render(templateName, {
    backLinkUrl: backLinkUrl,
    templateName: templateName
  });
};

export const getBeneficialOwnerGovById = (req: Request, res: Response, next: NextFunction, templateName: string, backLinkUrl: string) => {
  try {
    logger.debugRequest(req, `GET BY ID ${req.route.path}`);

    const id = req.params[ID];
    const data = getFromApplicationData(req, BeneficialOwnerGovKey, id, true);

    const principalAddress = (data) ? mapDataObjectToFields(data[PrincipalAddressKey], PrincipalAddressKeys, AddressKeys) : {};
    const serviceAddress = (data) ? mapDataObjectToFields(data[ServiceAddressKey], ServiceAddressKeys, AddressKeys) : {};
    const startDate = (data) ? mapDataObjectToFields(data[StartDateKey], StartDateKeys, InputDateKeys) : {};

    return res.render(templateName, {
      backLinkUrl: backLinkUrl,
      templateName: `${templateName}/${id}`,
      id,
      ...data,
      ...principalAddress,
      ...serviceAddress,
      [StartDateKey]: startDate
    });
  } catch (error) {
    logger.errorRequest(req, error);
    next(error);
  }
};

export const postBeneficialOwnerGov = async (req: Request, res: Response, next: NextFunction, nextPage: string, registrationFlag: boolean): Promise<void> => {
  try {
    logger.debugRequest(req, `${req.method} ${req.route.path}`);

    const data: ApplicationDataType = setBeneficialOwnerData(req.body, uuidv4());

    const session = req.session as Session;
    setApplicationData(session, data, BeneficialOwnerGovKey);

    if (registrationFlag) {
      await saveAndContinue(req, session);
    }
    return res.redirect(nextPage);
  } catch (error) {
    logger.errorRequest(req, error);
    next(error);
  }
};

export const updateBeneficialOwnerGov = async (req: Request, res: Response, next: NextFunction, nextPage: string, registrationFlag: boolean): Promise<void> => {
  try {
    logger.debugRequest(req, `UPDATE ${req.route.path}`);
    const id = req.params[ID];

    // Remove old Beneficial Owner
    removeFromApplicationData(req, BeneficialOwnerGovKey, id);

    // Set Beneficial Owner data
    const data: ApplicationDataType = setBeneficialOwnerData(req.body, id);

    // Save new Beneficial Owner
    const session = req.session as Session;
    setApplicationData(session, data, BeneficialOwnerGovKey);

    if (registrationFlag) {
      await saveAndContinue(req, session);
    }
    return res.redirect(nextPage);
  } catch (error) {
    logger.errorRequest(req, error);
    next(error);
  }
};

export const removeBeneficialOwnerGov = async (req: Request, res: Response, next: NextFunction, nextPage: string, registrationFlag: boolean): Promise<void> => {
  try {
    logger.debugRequest(req, `REMOVE ${req.route.path}`);

    removeFromApplicationData(req, BeneficialOwnerGovKey, req.params[ID]);
    const session = req.session as Session;

    if (registrationFlag) {
      await saveAndContinue(req, session);
    }
    return res.redirect(nextPage);
  } catch (error) {
    logger.errorRequest(req, error);
    next(error);
  }
};

const setBeneficialOwnerData = (reqBody: any, id: string): ApplicationDataType => {
  const data: ApplicationDataType = prepareData(reqBody, BeneficialOwnerGovKeys);

  data[PrincipalAddressKey] = mapFieldsToDataObject(reqBody, PrincipalAddressKeys, AddressKeys);
  data[HasSamePrincipalAddressKey] = (data[HasSamePrincipalAddressKey]) ? +data[HasSamePrincipalAddressKey] : '';
  data[ServiceAddressKey] = (!data[HasSamePrincipalAddressKey])
    ? mapFieldsToDataObject(reqBody, ServiceAddressKeys, AddressKeys)
    : {};
  data[StartDateKey] = mapFieldsToDataObject(reqBody, StartDateKeys, InputDateKeys);

  // It needs concatenations because if in the check boxes we select only one option
  // nunjucks returns just a string and with concat we will return an array.
  data[BeneficialOwnerNoc] = (data[BeneficialOwnerNoc]) ? [].concat(data[BeneficialOwnerNoc]) : [];
  data[NonLegalFirmNoc] = (data[NonLegalFirmNoc]) ? [].concat(data[NonLegalFirmNoc]) : [];

  data[IsOnSanctionsListKey] = (data[IsOnSanctionsListKey]) ? +data[IsOnSanctionsListKey] : '';

  data[ID] = id;

  return data;
};