
import React from 'react';
import { Link } from 'react-router';
import {
  FaMapO,
  FaTerminal,
  FaNewspaperO,
  FaDatabase,
} from 'react-icons/lib/fa';

import {
  IoCube,
  IoSocialBuffer,
  IoIosBook,
} from 'react-icons/lib/io';
import {
  MdSearch,
  MdFace,
  MdBubbleChart,
  MdFormatShapes,
  MdShowChart,
  MdCloudUpload,
} from 'react-icons/lib/md';



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
    {(typeof ref.authors !== 'undefined' && ref.authors !== '' && ref.authors !== null) ? <span> {(typeof ref.authors === 'string' ? JSON.parse(ref.authors).map((author, i) => (
      <Link
        key={`a${i}`}
        to={`/profile/${restoreSC(toSlugFormat(author))}`}
      >
        {restoreSC(author)}
      </Link>
    )).reduce((prev, curr) => [prev, '; ', curr]) : ref.authors.map((author, i) => (
      <Link
        key={`a${i}`}
        to={`/profile/${restoreSC(toSlugFormat(author))}`}
      >
        {restoreSC(author)}
      </Link>
    )).reduce((prev, curr) => [prev, '; ', curr]))}. </span> : null }
    {(ref.journal !== '' && typeof ref.journal !== 'undefined' && ref.journal !== null) ? <i>{ref.journal}. </i> : null }
    {(ref.volume !== '' && typeof ref.volume !== 'undefined' && ref.volume !== null) ? <b>{ref.volume}</b> : null}
    {(ref.number !== '' && typeof ref.number !== 'undefined' && ref.number !== null) ? <span>{ref.number}</span> : null}
    {(ref.pages !== '' && typeof ref.pages !== 'undefined' && ref.pages !== null) ? <span>{', '}{ref.pages} </span> : null}
    {(ref.year !== '' && typeof ref.year !== 'undefined' && ref.year !== null) ? <span>({ref.year})</span> : null}
  </span>);


// Print a publication reference from JSON object.
// TODO Integrate with crossref.org api
// if (false && typeof ref.doi === 'undefined' || ref.doi === '') {
export const plainPrintReference = (ref) => {
  let res = '';
  if (ref.title !== '' && ref.title !== null && typeof ref.title !== 'undefined') {
    res = `${res + toTitleCase(restoreSC(ref.title))}. `;
  }
  if (ref.doi !== '' && typeof ref.doi !== 'undefined' && ref.doi !== null) {
    res = `${res}DOI:${ref.doi}. `;
  }
  if (typeof ref.authors !== 'undefined' && ref.authors !== '' && ref.authors !== null) {
    res = `${res + restoreSC(typeof ref.authors === 'string' ? JSON.parse(ref.authors).join('; ').replace(/[,;](?! )/g, ', ') : ref.authors.join('; ').replace(/[,;](?! )/g, ', '))}. `;
  }

  if (ref.journal !== '' && typeof ref.journal !== 'undefined' && ref.journal !== null) {
    res = `${res + ref.journal}. `;
  }
  if (ref.volume !== '' && typeof ref.volume !== 'undefined' && ref.volume !== null) {
    res += ref.volume;
  }
  if (ref.year !== '' && typeof ref.year !== 'undefined' && ref.year !== null) {
    res = `${res}(${ref.year})`;
  }
  if (ref.pages !== '' && typeof ref.pages !== 'undefined' && ref.pages !== null) {
    res = `${res + ref.pages}.`;
  }
  return res;
};


export const getAppIcon = (title) => {
  if (title === 'Activity Maps') {
    return <FaMapO />;
  } else if (title === 'Pourbaix Diagrams') {
    return <MdShowChart />;
  } else if (title === 'Upload Datasets') {
    return <MdCloudUpload />;
  } else if (title === 'CatLearn') {
    return <IoIosBook />;
  } else if (title === 'Prototype Search') {
    return <IoCube />;
  } else if (title === 'CatKit Slab Generator') {
    return <IoSocialBuffer />;
  } else if (title === 'Surface Reactions') {
    return <MdSearch />;
  } else if (title === 'Profiles') {
    return <MdFace />;
  } else if (title === 'Publications') {
    return <FaNewspaperO />;
  } else if (title === 'Your Next App ...') {
    return <FaTerminal />;
  } else if (title === 'GraphQL API') {
    return <FaDatabase />;
  } else if (title === 'Wyckoff Bulk Generator') {
    return <MdFormatShapes />;
  } else if (title === 'Scaling Relations') {
    return <MdBubbleChart />;
  }
  return null;
};

/* Turn the author name provided as slug in URL*/
/* into form typically used in citation reference*/
export function toAuthorFormat(s) {
  let res;
  res = s.split('-');
  res = res.map(toTitleCase);
  res = [res[res.length - 1]].concat(res.slice(0, 1)).join('@ ').replace('@', ',').replace(/@/g, ' ');
  return res;
}


/* Turn the authorname provided as slug in URL*/
/* into form presentable as title at top of page*/
export function toTitleFormat(s) {
  let res;
  res = s.split('-');
  res = res.map(toTitleCase);
  return res.join(' ');
}

export function toSlugFormat(s) {
  return s.split(',')
    .reverse()
    .map((x) => x.trim())
    .join(' ')
    .replace('.', '')
    .replace(/\s/g, '-')
    .toLowerCase();
}

