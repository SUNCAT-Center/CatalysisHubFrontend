## Making Plots

So let's say we collected some data either from the GraphQL database or our own Flask endpoint and we
want to somehow display it in the browser. We want to it to resize automatically to look at least acceptable
on every screen size and we might want to add some interactive features. For the purpose of displaying digrams we will use [Plotly.js](https://plot.ly/javascript/react/). There are many great plotting libraries that can display diagrams in a browser with interactive features. An impressive number of them are based on [d3.js](https://d3js.org/), so it Plotly.js All of them of them have advantages and disadvantages. After a thorough comparison of several popular toolkits the decision was made on the fact that Plotly.js has an [open source license](https://plot.ly/javascript/open-source-announcement/), features [contour plots](https://plot.ly/python/contour-plots/), offers a [React component](https://plot.ly/javascript/react/), is well-documented and performant to use even with thousands of data points. Huge shoutout to the [Plotly team](https://plot.ly/javascript/open-source-announcement/#humans-behind-the-project)!

To start using it in an app, you should first import the its React module

      import Plot from 'react-plotly.js';

Then somewhere in our app, we will e.g. define some contour data to plot


      const zPlot = [[10, 10.625, 12.5, 15.625, 20],
             [5.625, 6.25, 8.125, 11.25, 15.625],
             [2.5, 3.125, 5., 8.125, 12.5],
             [0.625, 1.25, 3.125, 6.25, 10.625],
             [0, 0.625, 2.5, 5.625, 10]];


Typically this is not hard-coded but fetched via some http request from the backend.

Then at the corresponding place in our UI, we insert a Plot tag, like so

              <Plot
                data={[{
                  type: "contour",
                  z: zPlot,
                  showscale: true,
                  colorbar: {"titleside": "right", "title": "Target Function [eV]"},
                  colorscale: [["0.0", "rgb(165,0,38)"], ["0.111111111111", "rgb(215,48,39)"], ["0.222222222222", "rgb(244,109,67)"], ["0.333333333333", "rgb(253,174,97)"], ["0.444444444444", "rgb(254,224,144)"], ["0.555555555556", "rgb(224,243,248)"], ["0.666666666667", "rgb(171,217,233)"], ["0.777777777778", "rgb(116,173,209)"], ["0.888888888889", "rgb(69,117,180)"], ["1.0", "rgb(49,54,149)"]],
                },
                  {
                    type: 'scatter',
                    mode: 'markers',
                    x: [1, 2, 3, 4, 3],
                    y: [1, 4, 2, 1.5, 3]
                  },
                  {
                    type: 'scatter',
                    mode: 'markers',
                    x: [3.5, 1.2, 2.8, 3.1, 0.5],
                    y: [1, 4, 2, 1.5, 3]
                  },
                ]}
                config={{
                  scrollZoom: false,
                  legendPosition: true,
                  displayModeBar: false,
                }}
                layout={{
                  hovermode: 'closest',
                  xaxis: {
                    title: 'Descriptor 1',
                  },
                  yaxis: {
                    title: 'Descriptor 2',
                  },
                }}
                onClick={(event) => {
                  console.log(event);
                  // Uncomment line above, open console and on diagram to inspect
                }}

              />

If everything is wired up and configured correctly this could look as follows. Please consult with the [extensive reference](https://plot.ly/javascript/) for further configuration and plot types (including Ternary plots)
