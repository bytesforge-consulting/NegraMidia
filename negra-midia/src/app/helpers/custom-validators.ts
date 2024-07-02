import { AbstractControl, FormControl, FormGroup, ValidationErrors,  ValidatorFn } from "@angular/forms";

export class CustomValidators {

  static PatternIfNotNull(pattern: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value == null || control.value == undefined)
        return null;

      const reg = new RegExp(pattern);
      const matches = reg.test(control.value);
      return matches ? { match: {value: control.value}} : null;
    }
  }
}
