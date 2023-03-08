// Custom validation utils - For now checking is not empty

import { VALID_CHARACTERS, VALID_EMAIL_FORMAT } from "./regex/regex.validation";
import { DateTime } from "luxon";
import { ErrorMessages } from "./error.messages";
import { ApplicationData, trustType } from "../model";
import { BeneficialOwnersStatementType } from "../model/beneficial.owner.statement.model";
import { CONCATENATED_VALUES_SEPARATOR } from "../config";
import { getApplicationData } from "../utils/application.data";

export const checkFieldIfRadioButtonSelected = (selected: boolean, errMsg: string, value: string = "") => {
  if ( selected && !value.trim() ) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkMaxFieldIfRadioButtonSelected = (selected: boolean, errMsg: string, maxValue: number, value: string = "") => {
  if ( selected && value.length > maxValue) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkInvalidCharactersIfRadioButtonSelected = (selected: boolean, errMsg: string, value: string) => {
  if (selected && !value.match(VALID_CHARACTERS)) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkDateIsNotCompletelyEmpty = (day: string = "", month: string = "", year: string = "") => {
  if ( !day.trim() && !month.trim() && !year.trim() ) {
    return false;
  }
  return true;
};

export const checkDateIsInPast = (errMsg: string, day: string = "", month: string = "", year: string = "") => {
  const inputDate = DateTime.utc(Number(year), Number(month), Number(day));
  const now = DateTime.now();
  const currentDate = DateTime.utc(now.year, now.month, now.day); // exclude time of day
  if (inputDate >= currentDate) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkDateIsInPastOrToday = (errMsg: string, day: string = "", month: string = "", year: string = "") => {
  const inputDate = DateTime.utc(Number(year), Number(month), Number(day));
  const now = DateTime.now();
  const currentDate = DateTime.utc(now.year, now.month, now.day); // exclude time of day
  if (inputDate > currentDate) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkDateIsWithinLast3Months = (errMsg: string, day: string = "", month: string = "", year: string = "") => {
  const inputDate = DateTime.utc(Number(year), Number(month), Number(day));
  const now = DateTime.now();
  const threeMonthOldDate = DateTime.utc(now.year, now.month, now.day).minus({ months: 3 });
  if (inputDate <= threeMonthOldDate) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkDateValueIsValid = (invalidDateErrMsg: string, dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  const day = parseInt(dayStr), month = parseInt(monthStr), year = parseInt(yearStr);
  if (isNaN(day) || isNaN(month) || isNaN(year) || !DateTime.utc(year, month, day).isValid) {
    throw new Error(invalidDateErrMsg);
  }

  return true;
};

const isYearEitherMissingOrCorrectLength = (yearStr: string = ""): boolean => {
  return (yearStr.length === 0 || yearStr.length === 4);
};

export const checkOptionalDate = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  // to prevent more than 1 error reported on the date fields we first check for multiple empty fields and then check if the year is correct length or missing before doing the date check as a whole.
  if (checkMoreThanOneDateFieldIsNotMissing(dayStr, monthStr, yearStr) && isYearEitherMissingOrCorrectLength(yearStr)) {
    if ((dayStr !== "" || monthStr !== "" || yearStr !== "") && isYearEitherMissingOrCorrectLength(yearStr)) {
      checkOptionalDateDetails(dayStr, monthStr, yearStr);
    }
  }
  return true;
};

const checkOptionalDateDetails = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  const areDateFieldsPresent = checkAllDateFieldsArePresent(dayStr, monthStr, yearStr);
  if (areDateFieldsPresent) {
    const isOptionalDateValid = checkDateValueIsValid(ErrorMessages.INVALID_DATE, dayStr, monthStr, yearStr);
    if (isOptionalDateValid) {
      const isDateInThePast = checkDateIsInPastOrToday(ErrorMessages.DATE_NOT_IN_PAST_OR_TODAY, dayStr, monthStr, yearStr);
      if (isDateInThePast) {
        checkDateIsWithinLast3Months(ErrorMessages.IDENTITY_CHECK_DATE_NOT_WITHIN_PAST_3_MONTHS, dayStr, monthStr, yearStr);
      }
    }
  }
};

export const checkIdentityDate = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  // to prevent more than 1 error reported on the date fields we first check for multiple empty fields and then check if the year is correct length or missing before doing the date check as a whole.
  if (checkMoreThanOneDateFieldIsNotMissing(dayStr, monthStr, yearStr)
  && isYearEitherMissingOrCorrectLength(yearStr)
  && checkDateIsNotCompletelyEmpty(dayStr, monthStr, yearStr)) {
    checkIdentityDateFields(dayStr, monthStr, yearStr);
  }
  return true;
};

const checkIdentityDateFields = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  const areAllDateFieldsPresent = checkAllDateFieldsArePresent(dayStr, monthStr, yearStr);
  if (areAllDateFieldsPresent) {
    const isDateValid = checkDateValueIsValid(ErrorMessages.INVALID_DATE, dayStr, monthStr, yearStr);
    if (isDateValid) {
      const isDatePastOrToday = checkDateIsInPastOrToday(ErrorMessages.DATE_NOT_IN_PAST_OR_TODAY, dayStr, monthStr, yearStr);
      if (isDatePastOrToday) {
        checkDateIsWithinLast3Months(ErrorMessages.IDENTITY_CHECK_DATE_NOT_WITHIN_PAST_3_MONTHS, dayStr, monthStr, yearStr);
      }
    }
  }
};

export const checkStartDate = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  // to prevent more than 1 error reported on the date fields we first check for multiple empty fields and then check if the year is correct length or missing before doing the date check as a whole.
  if (checkMoreThanOneDateFieldIsNotMissing(dayStr, monthStr, yearStr)
  && isYearEitherMissingOrCorrectLength(yearStr)
  && checkDateIsNotCompletelyEmpty(dayStr, monthStr, yearStr)) {
    checkStartDateFields(dayStr, monthStr, yearStr);
  }
  return true;
};

const checkStartDateFields = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  const areAllDateFieldsPresent = checkAllDateFieldsArePresent(dayStr, monthStr, yearStr);
  if (areAllDateFieldsPresent) {
    const isDateValid = checkDateValueIsValid(ErrorMessages.INVALID_DATE, dayStr, monthStr, yearStr);
    if (isDateValid) {
      checkDateIsInPastOrToday(ErrorMessages.DATE_NOT_IN_PAST_OR_TODAY, dayStr, monthStr, yearStr);
    }
  }
};

export const checkDateFieldDay = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (isYearEitherMissingOrCorrectLength(yearStr)) {
    if (dayStr === "" && monthStr !== "" && yearStr !== "") {
      throw new Error(ErrorMessages.DAY);
    } else if (dayStr === "" && monthStr === "" && yearStr !== "") {
      throw new Error(ErrorMessages.DAY_AND_MONTH);
    } else if (dayStr === "" && monthStr !== "" && yearStr === "") {
      throw new Error(ErrorMessages.DAY_AND_YEAR);
    } else {
      if (!checkDateIsNotCompletelyEmpty(dayStr, monthStr, yearStr)) {
        throw new Error(ErrorMessages.ENTER_DATE);
      }
    }
  }
  return true;
};

export const checkDateFieldDayOfBirth = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (isYearEitherMissingOrCorrectLength(yearStr)) {
    if (dayStr === "" && monthStr !== "" && yearStr !== "") {
      throw new Error(ErrorMessages.DAY_OF_BIRTH);
    } else if (dayStr === "" && monthStr === "" && yearStr !== "") {
      throw new Error(ErrorMessages.DAY_AND_MONTH_OF_BIRTH);
    } else if (dayStr === "" && monthStr !== "" && yearStr === "") {
      throw new Error(ErrorMessages.DAY_AND_YEAR_OF_BIRTH);
    } else {
      if (!checkDateIsNotCompletelyEmpty(dayStr, monthStr, yearStr)) {
        throw new Error(ErrorMessages.ENTER_DATE_OF_BIRTH);
      }
    }
  }
  return true;
};

export const checkDateFieldDayForOptionalDates = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (isYearEitherMissingOrCorrectLength(yearStr)) {
    if (dayStr === "" && monthStr !== "" && yearStr !== "") {
      throw new Error(ErrorMessages.DAY);
    } else if (dayStr === "" && monthStr === "" && yearStr !== "") {
      throw new Error(ErrorMessages.DAY_AND_MONTH);
    } else if (dayStr === "" && monthStr !== "" && yearStr === "") {
      throw new Error(ErrorMessages.DAY_AND_YEAR);
    }
  }
  return true;
};

export const checkDateFieldMonth = (monthMissingMessage: string, monthYearMissingMessage: string, dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (isYearEitherMissingOrCorrectLength(yearStr)) {
    if (monthStr === "" && dayStr !== "" && yearStr !== "") {
      throw new Error(monthMissingMessage);
    } else if (dayStr !== "" && monthStr === "" && yearStr === "") {
      throw new Error(monthYearMissingMessage);
    }
  }
  return true;
};

export const checkDateFieldYear = (yearMissingMessage: string, yearLengthMessage: string, dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (!isYearEitherMissingOrCorrectLength(yearStr)) {
    throw new Error(yearLengthMessage);
  } else if (checkMoreThanOneDateFieldIsNotMissing(dayStr, monthStr, yearStr)) {
    if (yearStr === "" && dayStr !== "" && monthStr !== "") {
      throw new Error(yearMissingMessage);
    }
  }
  return true;
};

export const checkAllDateFieldsArePresent = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (dayStr === "" || monthStr === "" || yearStr === "") {
    return false;
  }
  return true;
};

export const checkMoreThanOneDateFieldIsNotMissing = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if ((dayStr === "" && monthStr === "" && yearStr !== "") ||
     (dayStr !== "" && monthStr === "" && yearStr === "") ||
     (dayStr === "" && monthStr !== "" && yearStr === "")) {
    return false;
  }
  return true;
};

export const checkDateOfBirth = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  // to prevent more than 1 error reported on the date fields we check if the year is correct length or missing before doing the date check as a whole.
  if (checkMoreThanOneDateFieldIsNotMissing(dayStr, monthStr, yearStr)
  && isYearEitherMissingOrCorrectLength(yearStr)
  && checkDateIsNotCompletelyEmpty(dayStr, monthStr, yearStr)) {
    const areDateOfBirthFieldsPresent = checkDateOfBirthFieldsArePresent(dayStr, monthStr, yearStr);
    if (areDateOfBirthFieldsPresent) {
      const isDateValid = checkDateValueIsValid(ErrorMessages.INVALID_DATE_OF_BIRTH, dayStr, monthStr, yearStr);
      if (isDateValid) {
        checkDateIsInPast(ErrorMessages.DATE_OF_BIRTH_NOT_IN_PAST, dayStr, monthStr, yearStr);
      }
    }
  }
  return true;
};

export const checkDate = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  checkDateFieldsForErrors(dayStr, monthStr, yearStr);
  checkDateValueIsValid(ErrorMessages.INVALID_DATE, dayStr, monthStr, yearStr);
  checkDateIsInPast(ErrorMessages.DATE_NOT_IN_PAST_OR_TODAY, dayStr, monthStr, yearStr);
  return true;
};

export const checkBirthDate = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  checkAllBirthDateFieldsForErrors(dayStr, monthStr, yearStr);
  checkDateValueIsValid(ErrorMessages.INVALID_DATE_OF_BIRTH, dayStr, monthStr, yearStr);
  checkDateIsInPast(ErrorMessages.DATE_OF_BIRTH_NOT_IN_PAST, dayStr, monthStr, yearStr);
  return true;
};

export const checkTrustDate = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  checkTrustDateFieldsForErrors(dayStr, monthStr, yearStr);
  checkDateValueIsValid(ErrorMessages.INVALID_DATE_OF_TRUST, dayStr, monthStr, yearStr);
  checkDateIsInPastOrToday(ErrorMessages.DATE_NOT_IN_PAST_OR_TODAY_OF_TRUST, dayStr, monthStr, yearStr);
  return true;
};

export const checkDateOfBirthFieldsArePresent = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (!checkAllDateFieldsArePresent(dayStr, monthStr, yearStr)) {
    return false;
  } else {
    checkMoreThanOneDateOfBirthFieldIsNotMissing(dayStr, monthStr, yearStr);
  }
  return true;
};

const checkDateFieldLengthForErrors = (day: string, month: string, year: string, errors: ErrorMessages[]) => {
  if (day.length > 2) {
    throw new Error(errors[0]);
  }
  if (month.length > 2) {
    throw new Error(errors[1]);
  }
  if (year.length !== 4) {
    throw new Error(errors[2]);
  }
};

export const checkDateFieldsForErrors = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (dayStr === "" && monthStr === "" && yearStr === "") {
    throw new Error(ErrorMessages.ENTER_DATE);
  } else if (dayStr === "" && monthStr === "" && yearStr !== "") {
    throw new Error(ErrorMessages.DAY_AND_MONTH);
  } else if (dayStr !== "" && monthStr === "" && yearStr === "") {
    throw new Error(ErrorMessages.MONTH_AND_YEAR);
  } else if (dayStr === "" && monthStr !== "" && yearStr === "") {
    throw new Error(ErrorMessages.DAY_AND_YEAR);
  } else if (dayStr === "") {
    throw new Error(ErrorMessages.DAY);
  } else if (monthStr === "") {
    throw new Error(ErrorMessages.MONTH);
  } else if (yearStr === "") {
    throw new Error(ErrorMessages.YEAR);
  } else {
    checkDateFieldLengthForErrors(dayStr, monthStr, yearStr, [ErrorMessages.DAY_LENGTH, ErrorMessages.MONTH_LENGTH, ErrorMessages.YEAR_LENGTH]);
  }
};

export const checkTrustDateFieldsForErrors = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (dayStr === "" && monthStr === "" && yearStr === "") {
    throw new Error(ErrorMessages.ENTER_DATE_OF_TRUST);
  } else if (dayStr === "" && monthStr === "" && yearStr !== "") {
    throw new Error(ErrorMessages.DAY_AND_MONTH_OF_TRUST);
  } else if (dayStr !== "" && monthStr === "" && yearStr === "") {
    throw new Error(ErrorMessages.MONTH_AND_YEAR_OF_TRUST);
  } else if (dayStr === "" && monthStr !== "" && yearStr === "") {
    throw new Error(ErrorMessages.DAY_AND_YEAR_OF_TRUST);
  } else if (dayStr === "") {
    throw new Error(ErrorMessages.DAY_OF_TRUST);
  } else if (monthStr === "") {
    throw new Error(ErrorMessages.MONTH_OF_TRUST);
  } else if (yearStr === "") {
    throw new Error(ErrorMessages.YEAR_OF_TRUST);
  } else {
    checkDateFieldLengthForErrors(dayStr, monthStr, yearStr, [ErrorMessages.DAY_LENGTH_OF_TRUST, ErrorMessages.MONTH_LENGTH_OF_TRUST, ErrorMessages.YEAR_LENGTH_OF_TRUST]);
  }
};

export const checkAllBirthDateFieldsForErrors = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (dayStr === "" && monthStr === "" && yearStr === "") {
    throw new Error(ErrorMessages.ENTER_DATE_OF_BIRTH);
  } else if (dayStr === "" && monthStr === "" && yearStr !== "") {
    throw new Error(ErrorMessages.DAY_AND_MONTH_OF_BIRTH);
  } else if (dayStr !== "" && monthStr === "" && yearStr === "") {
    throw new Error(ErrorMessages.MONTH_AND_YEAR_OF_BIRTH);
  } else if (dayStr === "" && monthStr !== "" && yearStr === "") {
    throw new Error(ErrorMessages.DAY_AND_YEAR_OF_BIRTH);
  } else if (dayStr === "") {
    throw new Error(ErrorMessages.DAY_OF_BIRTH);
  } else if (monthStr === "") {
    throw new Error(ErrorMessages.MONTH_OF_BIRTH);
  } else if (yearStr === "") {
    throw new Error(ErrorMessages.YEAR_OF_BIRTH);
  } else {
    checkDateFieldLengthForErrors(dayStr, monthStr, yearStr, [ErrorMessages.DATE_OF_BIRTH_DAY_LENGTH, ErrorMessages.DATE_OF_BIRTH_MONTH_LENGTH, ErrorMessages.DATE_OF_BIRTH_YEAR_LENGTH]);
  }
};

export const checkMoreThanOneDateOfBirthFieldIsNotMissing = (dayStr: string = "", monthStr: string = "", yearStr: string = "") => {
  if (dayStr === "" && monthStr === "" && yearStr !== "") {
    throw new Error(ErrorMessages.DAY_AND_MONTH_OF_BIRTH);
  } else if (dayStr !== "" && monthStr === "" && yearStr === "") {
    throw new Error(ErrorMessages.MONTH_AND_YEAR_OF_BIRTH);
  } else if (dayStr === "" && monthStr !== "" && yearStr === "") {
    throw new Error(ErrorMessages.DAY_AND_YEAR_OF_BIRTH);
  }
};

export const checkOverseasName = (value: string = "") => {
  if ( !value.trim() ) {
    throw new Error(ErrorMessages.ENTITY_NAME);
  } else if ( value.length > 160) {
    throw new Error(ErrorMessages.MAX_NAME_LENGTH);
  } else if ( !VALID_CHARACTERS.test(value) ) {
    throw new Error(ErrorMessages.ENTITY_NAME_INVALID_CHARACTERS);
  }

  return true;
};

export const checkSecondNationality = (nationality: string = "", secondNationality: string = "") => {

  if ( nationality && nationality === secondNationality ) {
    throw new Error(ErrorMessages.SECOND_NATIONALITY_IS_SAME);
  } else if ( nationality && secondNationality && `${nationality}${CONCATENATED_VALUES_SEPARATOR}${secondNationality}`.length > 50) {
    throw new Error(ErrorMessages.NATIONALITIES_TOO_LONG);
  }

  return true;
};

export const checkPublicRegisterJurisdictionLength = (public_register_name: string = "", public_register_jurisdiction: string = "") => {

  if (public_register_name && public_register_jurisdiction && `${public_register_name}${CONCATENATED_VALUES_SEPARATOR}${public_register_jurisdiction}`.length > 160) {
    throw new Error(ErrorMessages.MAX_ENTITY_PUBLIC_REGISTER_NAME_AND_JURISDICTION_LENGTH);
  }
  return true;
};

export const checkAtLeastOneFieldHasValue = (errMsg: string, ...fields: any[]) => {
  for (const field of fields) {
    if (field) {
      return true;
    }
  }
  throw new Error(errMsg);
};

export const checkTrustFields = (trustsJson: string) => {
  const trusts: trustType.Trust[] = JSON.parse(trustsJson);
  const addressMaxLength = 50;

  for (const trust of trusts) {
    checkTrustCreationDate(trust);

    checkTrustName(trust);

    checkIndividualsAddress(trust, addressMaxLength);

    checkCorporatesAddress(trust, addressMaxLength);
  }
  return true;
};

export const checkBeneficialOwnerType = (beneficialOwnersStatement: string, value) => {
  if (!value) {
    let errMsg = ErrorMessages.SELECT_THE_TYPE_OF_BENEFICIAL_OWNER_OR_MANAGING_OFFICER_YOU_WANT_TO_ADD;
    if (beneficialOwnersStatement === BeneficialOwnersStatementType.ALL_IDENTIFIED_ALL_DETAILS) {
      errMsg = ErrorMessages.SELECT_THE_TYPE_OF_BENEFICIAL_OWNER_YOU_WANT_TO_ADD;
    } else if (beneficialOwnersStatement === BeneficialOwnersStatementType.NONE_IDENTIFIED) {
      errMsg = ErrorMessages.SELECT_THE_TYPE_OF_MANAGING_OFFICER_YOU_WANT_TO_ADD;
    }
    throw new Error(errMsg);
  }
  return true;
};

export const checkBeneficialOwnersSubmission = (req) => {
  const appData: ApplicationData = getApplicationData(req.session);
  if (appData.beneficial_owners_statement === BeneficialOwnersStatementType.SOME_IDENTIFIED_ALL_DETAILS) {
    if (!hasBeneficialOwners(appData)) {
      throw new Error(ErrorMessages.MUST_ADD_BENEFICIAL_OWNER);
    }
    if (!hasManagingOfficers(appData)) {
      throw new Error(ErrorMessages.MUST_ADD_MANAGING_OFFICER);
    }
  }
  return true;
};

const hasBeneficialOwners = (appData: ApplicationData) => {
  return (appData.beneficial_owners_individual && appData.beneficial_owners_individual.length > 0) ||
    (appData.beneficial_owners_corporate && appData.beneficial_owners_corporate.length > 0) ||
    (appData.beneficial_owners_government_or_public_authority &&
      appData.beneficial_owners_government_or_public_authority.length > 0);
};

const hasManagingOfficers = (appData: ApplicationData) => {
  return (appData.managing_officers_individual && appData.managing_officers_individual.length > 0) ||
    (appData.managing_officers_corporate && appData.managing_officers_corporate.length > 0);
};

const checkTrustCreationDate = (trust: trustType.Trust) => {
  if (trust.creation_date_day === undefined ||
    trust.creation_date_day === "" ||
    trust.creation_date_month === undefined ||
    trust.creation_date_month === "" ||
    trust.creation_date_year === undefined ||
    trust.creation_date_year === "") {
    throw new Error(ErrorMessages.TRUST_CREATION_DATE);
  }
};

const checkTrustName = (trust: trustType.Trust) => {
  if (trust.trust_name === undefined || trust.trust_name === "") {
    throw new Error(ErrorMessages.TRUST_NAME);
  }
};

const checkIndividualsAddress = (trust: trustType.Trust, addressMaxLength: number) => {
  if (trust.INDIVIDUALS) {
    for (const individual of trust.INDIVIDUALS) {
      if (individual.ura_address_premises && individual.ura_address_premises.length > addressMaxLength) {
        throw new Error(ErrorMessages.TRUST_INDIVIDUAL_HOME_ADDRESS_LENGTH);
      }
      if (individual.sa_address_premises && individual.sa_address_premises.length > addressMaxLength) {
        throw new Error(ErrorMessages.TRUST_INDIVIDUAL_CORRESPONDENCE_ADDRESS_LENGTH);
      }
    }
  }
};

const checkCorporatesAddress = (trust: trustType.Trust, addressMaxLength: number) => {
  if (trust.CORPORATES) {
    for (const corporate of trust.CORPORATES) {
      if (corporate.ro_address_premises && corporate.ro_address_premises.length > addressMaxLength) {
        throw new Error(ErrorMessages.TRUST_CORPORATE_REGISTERED_OFFICE_ADDRESS_LENGTH);
      }
      if (corporate.sa_address_premises && corporate.sa_address_premises.length > addressMaxLength) {
        throw new Error(ErrorMessages.TRUST_CORPORATE_CORRESPONDENCE_ADDRESS_LENGTH);
      }
    }
  }
};

export const validateEmail = (email: string, maxLength: number) => {
  const emailString = email.trim();
  checkEmailIsPresent(emailString);
  checkIsWithinLengthLimit(emailString, maxLength);
  checkCorrectIsFormat(emailString);
  return true;
};

const checkEmailIsPresent = (email: string) => {
  if (email === undefined || email === "") {
    throw new Error(ErrorMessages.EMAIL);
  }
};

const checkIsWithinLengthLimit = (email: string, maxLength: number) => {
  if (email.length > maxLength) {
    throw new Error(ErrorMessages.MAX_EMAIL_LENGTH);
  }
};

const checkCorrectIsFormat = (email: string) => {
  if (!email.match(VALID_EMAIL_FORMAT)) {
    throw new Error(ErrorMessages.EMAIL_INVALID_FORMAT);
  }
};
