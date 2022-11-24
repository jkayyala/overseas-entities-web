import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import * as config from "../config";

import { ApplicationData } from "../model";
import { createAndLogErrorRequest, logger } from "../utils/logger";
import { setExtraData } from "../utils/application.data";
import { isActiveFeature } from "../utils/feature.flag";
import { getOverseasEntity } from "../service/overseas.entities.service";
import { HasSoldLandKey, ID, IsSecureRegisterKey, OverseasEntityKey, Transactionkey } from "../model/data.types.model";
import { WhoIsRegisteringKey, WhoIsRegisteringType } from "../model/who.is.making.filing.model";
import { OverseasEntityDueDiligence, OverseasEntityDueDiligenceKey } from "../model/overseas.entity.due.diligence.model";
import { DueDiligence, DueDiligenceKey } from "../model/due.diligence.model";
import { BeneficialOwnerGov, BeneficialOwnerGovKey } from "../model/beneficial.owner.gov.model";
import { BeneficialOwnerIndividual, BeneficialOwnerIndividualKey } from "../model/beneficial.owner.individual.model";
import { BeneficialOwnerOther, BeneficialOwnerOtherKey } from "../model/beneficial.owner.other.model";
import { ManagingOfficerCorporate, ManagingOfficerCorporateKey } from "../model/managing.officer.corporate.model";
import { ManagingOfficerIndividual, ManagingOfficerKey } from "../model/managing.officer.model";
import { Session } from "@companieshouse/node-session-handler";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debugRequest(req, `GET a saved OE submission`);

    const { transactionId, overseaEntityId } = req.params;
    const infoMsg = `Transaction ID: ${transactionId}, OverseasEntity ID: ${overseaEntityId}`;

    logger.infoRequest(req, `Resuming OE - ${infoMsg}`);

    if (isActiveFeature(config.FEATURE_FLAG_ENABLE_SAVE_AND_RESUME_17102022)) {
      const appData: ApplicationData = await getOverseasEntity(req, transactionId, overseaEntityId);

      if (!appData || !Object.keys(appData).length) {
        throw createAndLogErrorRequest(req, `Error on resuming OE - ${infoMsg}`);
      }

      setWebApplicationData(req.session as Session, appData, transactionId, overseaEntityId);
    }

    return res.redirect(config.SOLD_LAND_FILTER_URL);
  } catch (error) {
    logger.errorRequest(req, error);
    next(error);
  }
};

/**
 * Set default values needed for the web journey that are not part of OE API data model
 * nor part of the SDK mapper object.
 * Add IDs needed for the web to select single BOs or MOs on beneficial-owner-type screen and
 * related checkboxes for different pages
 * @param session
 * @param appData
 * @param transactionId
 * @param overseaEntityId
 */
const setWebApplicationData = (session: Session, appData: ApplicationData, transactionId: string, overseaEntityId: string) => {

  appData[BeneficialOwnerIndividualKey] = (appData[BeneficialOwnerIndividualKey] as BeneficialOwnerIndividual[])
    .map( boi => { return { ...boi, [ID]: uuidv4() }; } );
  appData[BeneficialOwnerOtherKey] = (appData[BeneficialOwnerOtherKey] as BeneficialOwnerOther[] )
    .map( boo => { return { ...boo, [ID]: uuidv4() }; } );
  appData[BeneficialOwnerGovKey] = (appData[BeneficialOwnerGovKey] as BeneficialOwnerGov[])
    .map( bog => { return { ...bog, [ID]: uuidv4() }; } );
  appData[ManagingOfficerKey] = (appData[ManagingOfficerKey] as ManagingOfficerIndividual[])
    .map( moi => { return { ...moi, [ID]: uuidv4() }; } );
  appData[ManagingOfficerCorporateKey] = (appData[ManagingOfficerCorporateKey] as ManagingOfficerCorporate[])
    .map( moc => { return { ...moc, [ID]: uuidv4() }; } );

  appData[HasSoldLandKey] = '0';
  appData[IsSecureRegisterKey] = '0';
  appData[Transactionkey] = transactionId;
  appData[OverseasEntityKey] = overseaEntityId;

  if (Object.keys(appData[OverseasEntityDueDiligenceKey] as OverseasEntityDueDiligence).length) {
    appData[WhoIsRegisteringKey] =  WhoIsRegisteringType.SOMEONE_ELSE;
  } else if (Object.keys(appData[DueDiligenceKey] as DueDiligence).length){
    appData[WhoIsRegisteringKey] = WhoIsRegisteringType.AGENT;
  }

  setExtraData(session, appData);
};