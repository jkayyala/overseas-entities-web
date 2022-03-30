import { Address, InputDate, natureOfControl, yesNoResponse } from "./data.types.model";

export const BeneficialOwnerIndividualKey = "beneficialOwnerIndividual";
/*
  The Beneficial Owner Individual fields will have to match the name field on the HTML file to
  be able to do the mapping correctly
*/
export const BeneficialOwnerIndividualKeys: string[] = ["fullName", "dateOfBirth", "ownerNationality", "usualResidentialAddress", "isAddressSameAsUsusalResidentialAddress",
  "serviceAddress", "startDate", "natureOfControl", "trustee", "onSanctionsList"];

/*
  The Entity sub-fields for Date Objects
*/
export const DateOfBirthKey: string = "dateOfBirth";
export const DateOfBirthKeys: string[] = ["dateOfBirth-day", "dateOfBirth-month", "dateOfBirth-year"];

export const StartDateKey: string = "startDate";
export const StartDateKeys: string[] = ["startDate-day", "startDate-month", "startDate-year"];

/*
  The Entity sub-fields for Address Objects
*/
export const UsualResidentialAddressKey = "usualResidentialAddress";
export const UsualResidentialAddressKeys: string[] = ["usualResidentialAddressLine1", "usualResidentialAddressLine2", "usualResidentialAddressTown", "usualResidentialAddressCounty", "usualResidentialAddressPostcode"];
export const ServiceAddressKey = "serviceAddress";
export const ServiceAddressKeys: string[] = ["serviceAddressLine1", "serviceAddressLine2", "serviceAddressTown", "serviceAddressCounty", "serviceAddressPostcode"];

export interface BeneficialOwnerIndividual {
    fullName?: string
    dateOfBirth?: InputDate
    ownerNationality?: string
    usualResidentialAddress?: Address
    isAddressSameAsUsusalResidentialAddress?: yesNoResponse
    serviceAddress?: Address
    startDate?: InputDate
    natureOfControl?: natureOfControl
    trustee?: yesNoResponse
    onSanctionsList?: yesNoResponse
}
