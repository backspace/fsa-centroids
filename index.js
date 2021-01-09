import centroidPackage from '@turf/centroid';
import helpers from '@turf/helpers';
import fs from 'fs';

const centroid = centroidPackage.default;
const featureCollection = helpers.featureCollection;

const fsas = JSON.parse(fs.readFileSync('FSA_Data/Canadian_FSA.geojson'));

const centroids = fsas.features.map(fsa => {
  const c = centroid(fsa);
  c.properties = fsa.properties;
  return c;
});

fs.writeFileSync('data/fsa-centroids.geojson', JSON.stringify(centroids, null, 2));

const fsaToCentroid = centroids.reduce((fsaToCentroid, centroid) => {
  const fsa = centroid.properties.CFSAUID;
  const point = centroid.geometry.coordinates;

  fsaToCentroid[fsa] = point;

  return fsaToCentroid;
}, {});

fs.writeFileSync('data/fsa-centroids.json', JSON.stringify(fsaToCentroid, null, 2));
