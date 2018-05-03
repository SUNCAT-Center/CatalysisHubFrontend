import React from 'react';

import { withStyles } from 'material-ui/styles';
import { styles } from './styles';

export class SearchInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h2>About Prototype Search</h2>
        <div><strong>Prototype Search</strong> is a basic research project with the aim of supporting screening studies of chemical reaction on surfaces. To this end we index bulk structures from open repositories. We acknowledge the following the repositories and the literature referenced therein</div>
        <h3>Aflowlib</h3>
        <div>URL: <a href="http://aflowlib.org/">http://aflowlib.org/</a></div>
        <div>{'A RESTful API for exchanging materials data in the AFLOWLIB.org consortium. Computational Materials Science, Volume 93, October 2014, Pages 178-192. Richard H. Taylor, Frisco Rose, Cormac Toher, Ohad Levy, Kesong Yang, Marco Buongiorno Nardelli, Stefano Curtarolo.'}</div>

        <h3>AMCSD</h3>
        <div>URL: <a href="http://rruff.geo.arizona.edu/AMS/amcsd.php">http://rruff.geo.arizona.edu/AMS/amcsd.php</a></div>
        <div>{'Downs, R.T. and Hall-Wallace, M. (2003) The American Mineralogist Crystal Structure Database. American Mineralogist 88, 247-250.'}</div>


        <h3>Crystallography Open Database</h3>
        <div>URL: <a href="http://www.crystallography.net/cod/">http://www.crystallography.net/cod/</a></div>
        <ul>
          <li><div>{`Merkys, A., Vaitkus, A., Butkus, J., Okulič-Kazarinas, M., Kairys, V. & Gražulis, S. (2016)
              "COD::CIF::Parser: an error-correcting CIF parser for the Perl language".`}
            <em>Journal of Applied Crystallography</em> <strong>49</strong>.
              (<a href="http://www.crystallography.net/cod/bibliography/Merkys2016.bib">BibTeX</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Merkys2016.refer">EndNote/Refer</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Merkys2016.txt">plain text</a>)</div></li>
          <li><div>{`Gražulis, S., Merkys, A., Vaitkus, A. & Okulič-Kazarinas, M. (2015)
              "Computing stoichiometric molecular composition from crystal structures".`}
            <em>Journal of Applied Crystallography</em> <strong>48</strong>, 85-91.
              (<a href="http://www.crystallography.net/cod/bibliography/Grazulis2015.bib">BibTeX</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Grazulis2015.refer">EndNote/Refer</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Grazulis2015.txt">plain text</a>)</div></li>
          <li><div>{`Gražulis, S., Daškevič, A., Merkys, A., Chateigner, D., Lutterotti,
              L., Quirós, M., Serebryanaya, N. R., Moeck, P., Downs, R. T. & LeBail, A. (2012)
              "Crystallography Open Database (COD): an open-access collection of
              crystal structures and platform for world-wide collaboration". `}
            <em>Nucleic Acids Research</em> <strong>40</strong>, D420-D427.
              (<a href="http://www.crystallography.net/cod/bibliography/Grazulis2012.bib">BibTeX</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Grazulis2012.refer">EndNote/Refer</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Grazulis2012.txt">plain text</a>)</div></li>
          <li><div>{`Grazulis, S., Chateigner, D., Downs, R. T., Yokochi, A.  T., Quiros, M., Lutterotti, L., Manakova, E., Butkus, J., Moeck, P. & Le Bail, A.
              (2009) "Crystallography Open Database – an open-access collection of crystal structures".`} <em>J. Appl. Cryst.</em> <strong>42</strong>, 726-729.
              (<a href="http://www.crystallography.net/cod/bibliography/Grazulis2009.bib">BibTeX</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Grazulis2009.refer">EndNote/Refer</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Grazulis2009.txt">plain text</a>)</div></li>
          <li><div>{`Downs, R. T. & Hall-Wallace, M. (2003) "The American Mineralogist
              Crystal Structure Database".`} <em>American Mineralogist</em> <strong>88</strong>, 247-250.
              (<a href="http://www.crystallography.net/cod/bibliography/Downs2003.bib">BibTeX</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Downs2003.refer">EndNote/Refer</a>,
              <a href="http://www.crystallography.net/cod/bibliography/Downs2003.txt">plain text</a>)</div></li>
        </ul>

        <h3>Materials Project</h3>
        <div><a href="https://materialsproject.org/">https://materialsproject.org/</a></div>
        <ul>
          <li>A. Jain*, S.P. Ong*, G. Hautier, W. Chen, W.D. Richards, S. Dacek, S. Cholia, D. Gunter, D. Skinner, G. Ceder, K.A. Persson (*=equal contributions) The Materials Project: A materials genome approach to accelerating materials innovation
            APL Materials, 2013, 1(1), 011002.</li>
          <li>S. P. Ong, S. Cholia, A. Jain, M. Brafman, D. Gunter, G. Ceder, and K. A. Persson
            The Materials Application Programming Interface (API): A simple, flexible and efficient API for materials data based on REpresentational State Transfer (REST) principles.  Computational Materials Science, 2015, 97, 209–215.</li>
        </ul>

        <h3>Open Quantum Materials Database</h3>
        <div>URL: <a href="http://oqmd.org/">http://oqmd.org/</a></div>
        <ul>
          <li>{'Saal, J. E., Kirklin, S., Aykol, M., Meredig, B., and Wolverton, C. "Materials Design and Discovery with High-Throughput Density Functional Theory: The Open Quantum Materials Database (OQMD)", JOM 65, 1501-1509 (2013). doi:10.1007/s11837-013-0755-4'}</li>
          <li>{'Kirklin, S., Saal, J.E., Meredig, B., Thompson, A., Doak, J.W., Aykol, M., Rühl, S. and Wolverton, C. "The Open Quantum Materials Database (OQMD): assessing the accuracy of DFT formation energies", npj Computational Materials 1, 15010 (2015). doi:10.1038/npjcompumats.2015.10'}</li>
        </ul>
        <h2> Usage</h2>
        <div>{'The search can be used like a free text search. Search terms can be stoichiometries (e.g. \'AB2\'), spacegroups (e.g. \'151\'), conventional names of structures (e.g. \'hollandite\'), a repository name (e.g. \'AMCSD\'). The search will return faster and more accurately when naming the column in the form column:term (e.g. \'stoichiometry:AB2,AB3\'). Multiple possibilities can be separated with a comma (\',\'), no spaces. Multiple search terms will be applied with an AND filter, that is more terms lead to narrower results. The column names are:'}</div>
        <ul>
          <li>handle</li>
          <li>crystal_system</li>
          <li>spacegroup</li>
          <li>species</li>
          <li>tag</li>
          <li>prototype</li>
          <li>repository</li>
          <li>stoichiometry</li>
          <li>n_species</li>
          <li>n_atoms</li>

        </ul>
        <div>{'The column \'species\' has an additional feature: The term \'species:Ag,Pd\' (with comma) will filter for structures containing Ag OR Pd, while \'species:AgPd\' (without comma) will filter for structures containing Ag AND Pd. Any numeric field may contain ranges up to size 230, e.g. \'n_atoms:50-70\' will filter for structures containing from 50 and up to 70 atoms per unit cell. The \'crystal_system\' column is a short hand for space-groups and can take any of the 7 values: \'triclinic\', \'monoclinic\', \'orthorhombic\', \'tetragonal\', \'trigonal\', \'hexagonal\', or \'cubic\'.'}</div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  SearchInfo
);
