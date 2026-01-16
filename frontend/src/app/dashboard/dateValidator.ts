import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const from = group.get('from')?.value;
  const to = group.get('to')?.value;

  if (!from || !to) return null;

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const today = new Date();

  if (fromDate > toDate) {
    return { dateRangeInvalid: true };
  }

  if (toDate > today) {
    return { futureDateInvalid: true };
  }

  return null;
};
