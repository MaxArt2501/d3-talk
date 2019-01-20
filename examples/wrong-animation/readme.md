How to animate a pie chart
==========================

D3's transition algorithm is pretty smart but we need to know its limitations.
Specifically, when applied to an attribute it performs a string interpolation,
meaning it's a simple one-to-one numeric interpolation.

But a pie chart is made of arcs, so we need to interpolate the length of the
arcs, not their vertexes. This demo shows how.

## What to do

Install the packages with `npm install` (or you Node package manager of choice).
Serve the folder with `npm start` (or use yout http server of choice) and visit
localhost on port 8080.
