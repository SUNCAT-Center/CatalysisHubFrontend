
import React from 'react';

export const withCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// Restores various special characters
// when mangled through encoding
export const restoreSC = (str) => {
  let res = str;
  if (str === null || typeof str === 'undefined') {
    return '';
  }
  if (typeof str === 'object') {
    res = str.join(' ');
  }
  return res
    .replace('{\\o}', 'ø')
    .replace('\\o', 'ø')
    .replace('{"A}', 'Ä')
    .replace('{"U}', 'Ü')
    .replace('{"O}', 'Ö')
    .replace('{"a}', 'ä')
    .replace('{"u}', 'ü')
    .replace('{"o}', 'ö')
    .replace('{\\ss}', 'ß')
    .replace('--', '–')
    .replace('Norskov', 'Nørskov')

    .replace('{', '')
    .replace('}', '');
};

export function toTitleCase(str) {
  return str.replace(
        /\w\S*/g,
        (txt) => {
          if (txt.match(/^[A-Z0-9]+$/g) !== null) {
            return txt;
          }
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

// Print a publication reference from JSON object.
export const prettyPrintReference = (ref) =>
  // TODO Integrate with crossref.org api
  // if (false && typeof ref.doi === 'undefined' || ref.doi === '') {
   (<span>
     {(ref.title !== '' && ref.title !== null && typeof ref.title !== 'undefined') ? <strong>{`"${toTitleCase(restoreSC(ref.title))}"`}. </strong> : null }
     {(typeof ref.authors !== 'undefined' && ref.authors !== '' && ref.authors !== null) ? <span> {restoreSC(typeof ref.authors === 'string' ? JSON.parse(ref.authors).join('; ').replace(/[,;](?! )/g, ', ') : ref.authors.join('; ').replace(/[,;](?! )/g, ', '))}. </span> : null }
     {(ref.journal !== '' && typeof ref.journal !== 'undefined' && ref.journal !== null) ? <i>{ref.journal}, </i> : null }
     {(ref.volume !== '' && typeof ref.volume !== 'undefined' && ref.volume !== null) ? <span>{ref.volume} </span> : null}
     {(ref.year !== '' && typeof ref.year !== 'undefined' && ref.year !== null) ? <span>({ref.year}). </span> : null}
     {(ref.pages !== '' && typeof ref.pages !== 'undefined' && ref.pages !== null) ? <span>{ref.pages}. </span> : null}
   </span>);
