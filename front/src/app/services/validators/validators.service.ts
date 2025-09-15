import { Injectable } from '@angular/core';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

}
  export const firstNameAndLastnamePattern = '([a-zA-ZZáéíóúÁÉÍÓÚ]+) ([a-zA-ZáéíóúÁÉÍÓÚ]+)';
  export const nombrePattern = '^[a-zA-ZáéíóúÁÉÍÓÚ]+( [a-zA-ZáéíóúÁÉÍÓÚ]+)?$';
  export const emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$";
  export const decimalPattern: RegExp = /^\d+(\.\d{1,2})?$/;
  export const regex = /^(https?:\/\/)(www\.)([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,6}(\.[a-z]{2,6})?(\/[-a-zA-Z0-9@:%._\+~#=]*)?$/;
  export const TextareaPattern = /^[a-zA-Z0-9\s\-.,'()!&$%*@#!?¿¡ñáéíóúÁÉÍÓÚüÜ]{1,500}$/;
  export const yearPattern = /^(1000|[1-9][0-9]{3})$/;

  
  export const decimalValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) {
      return null; // Manejar el caso cuando el valor sea nulo o vacío
    }
    // Verificar si el valor coincide con el patrón decimal
    const isValid = decimalPattern.test(value);
    return isValid ? null : { decimalPattern: true };
  };


export function cantBeStrider(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value.trim().toLowerCase();
  if (value === 'strider') {
    return { noStrider: true };
  }
  return null;
}

export function noQueryValidator(control: AbstractControl): ValidationErrors | null {
  if (!control || control.value === null || control.value === undefined) {
    return null; // Manejar el caso cuando el control sea nulo o indefinido
  }
  const value: string = control.value;
  const queryKeywords: string[] = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "TRUNCATE", "http", "https", "www",];

  for (const keyword of queryKeywords) {
    if (value.toUpperCase().includes(keyword)) {
      return { noQuery: true };
    }
  }

  return null;
}

export function validaSoloNumeros(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;
  if (!value) {
    return null; // Manejar el caso cuando el valor sea nulo o vacío
  }
  // Verificar si el valor contiene caracteres que no sean números
  const containsNonNumeric = /\D+\./g.test(value);
  return containsNonNumeric ? { containsNonNumeric: true } : null;
}

export function validarLink(control: FormControl): { [key: string]: any } | null {
  const link = control.value;
  
  if (regex.test(link)) {
    return null; // El link es válido
  } else {
    return { 'linkInvalido': true }; // El link es inválido
  }
}
export function TextareaPatternValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    
    const descriptionMatch = TextareaPattern.test(control.value);
    return descriptionMatch ? null : { description: { value: control.value } };
  };
}
export function yearValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // Expresión regular para validar un año entre 1000 y el año actual
    const currentYear = new Date().getFullYear();
 

    // Comprueba si el valor del control coincide con la expresión regular
    const yearMatch = yearPattern.test(control.value);

    // Si hay coincidencia, retorna null (sin errores), de lo contrario, retorna un objeto con un error
    return yearMatch ? null : { year: { value: control.value } };
  };
}