import { Request, Response, NextFunction } from 'express';

import { logger } from '../../utils/logger';
import { SOLD_LAND_FILTER_URL } from '../../config';
import { getApplicationData } from "../../utils/application.data";
import { ApplicationData } from '../../model/application.model';
import { TrustKey } from '../../model/trust.model';
import { NavigationErrorMessage } from './check.condition';

export const hasTrust = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const trustId = req.params['id'];
    const appData: ApplicationData = getApplicationData(req.session);
    const hasTrust =  appData[TrustKey]?.some(trust => trust.trust_id === trustId);
    if ( ! hasTrust) {
      logger.infoRequest(req, NavigationErrorMessage);

      return res.redirect(SOLD_LAND_FILTER_URL);
    }
    next();
  } catch (err) {
    next(err);
  }
};
