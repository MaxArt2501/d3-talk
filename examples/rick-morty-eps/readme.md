Rick and Morty Episodes
=======================

A simple proof-of-concept about the usage of D3.js showing data fetching and
element reuse.

It's a simple bar chart that shows the number of unique characters in every
episode in a season of Rick and Morty (the Adult Swim show).

Data is fetched from [The Rick And Morty API](https://rickandmortyapi.com/)
and cached in memory to prevent request flooding.

The chart is redrawn on season selection and window resize.

This demo has been recreated in the live coding session during the talk.

## What to do

Install the packages with `npm install` (or you Node package manager of choice).
Serve the folder with `npm start` (or use yout http server of choice) and visit
localhost on port 8080.
