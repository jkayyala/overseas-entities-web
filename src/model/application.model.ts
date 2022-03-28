import { entityType, presenterType, dataType, otherOwnerType } from "./index";

export const APPLICATION_DATA_KEY = 'roe';

export interface ApplicationData {
    presenter?: presenterType.Presenter;
    entity?: entityType.Entity;
    otherBeneficialOwner?: otherOwnerType.OtherBeneficialOwner;
}

export type ApplicationDataType = presenterType.Presenter | entityType.Entity | dataType.Address;
