
## Display Atomic Structures

Often it is quite helpful to visualize an atomic structure
like a slab or a bulk structure right on screen. The user can
rotate and zoom to inspect it further. Here we adopt the ChemDoodle
component that is developed and maintained by [iChem Labs](https://www.ichemlabs.com/)
that is written in JavaScript (runs entirely in the browser)
and leverages webgl, which makes it performant even for larger
structures. It is generously distributed as free software which is
great. In order to use it, we need to load the script. In the import
section of our component we import the script loading component with:

      import Script from 'react-load-script';

And while we are at it we also load the display React component with:

      import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';

Next, somewhere at the beginning of our `render` method we load the script
with:

      <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
      <Script url="/static/ChemDoodleWeb.js" />


The structure display component processes a `cif` string for
representing the atomic structure with a unit cell. The display
function automatically centers the structure inside the unit cell
and we have no control over this. However since most surface calculations
are executed with periodic boundary conditions we can live with this.
Let say we have a `cif` representation stored, as

      const cifData = `data_image0\n_cell_length_a       4.04635
      _cell_length_b       4.04635
      _cell_length_c       4.04635
      _cell_angle_alpha    90
      _cell_angle_beta     90
      _cell_angle_gamma    90

      _symmetry_space_group_name_H-M    \"P 1\"
      _symmetry_int_tables_number       1

      loop_
        _symmetry_equiv_pos_as_xyz
        'x, y, z'

      loop_
        _atom_site_label
        _atom_site_occupancy
        _atom_site_fract_x
        _atom_site_fract_y
        _atom_site_fract_z
        _atom_site_thermal_displace_type
        _atom_site_B_iso_or_equiv
        _atom_site_type_symbol
        Re1      1.0000 0.00000  0.00000  0.00000  Biso   1.000  Re
        Re2      1.0000 0.00000  0.50000  0.50000  Biso   1.000  Re
        Re3      1.0000 0.50000  0.00000  0.50000  Biso   1.000  Re
        Tl1      1.0000 0.50000  0.50000  0.00000  Biso   1.000  Tl
      `

Then all we have to do inside in our render function is to insert a
     
      <GeometryCanvasWithOptions
        cifdata={cifData}
        uniqueId={`slab_preview`}
        key={`slab_preview`}
        id={`slab_preview`}
      />

If we have done everything correctly, it might look at follows.
