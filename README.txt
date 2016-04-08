Brandon Lim, k4v8
Alex Tsang, h9e9

source code: https://github.com/atsang17/cs314Project

what:

  A game where your goal is to smash the earth into the sun, allowing earth to
  be consumed. We attempted procedural level generation, but ran into problems
  actually rendering the level.

how:

  Stored array of planets that need to be vaporized, we check against them for picking
  to determine what planet to remove from the scene.

howto:

  Move the earth forwards and backwards with the "w" and "s" key, and spin counterclockwise
  and clockwise with "a" and "d". Click on planets to vaporize them.

sources:

  Planet textures by James Hastings-Trew from JHT's Planet Pixel Emporium
  http://planetpixelemporium.com/planets.html

  Much of core.js was based on the skeleton code for P2

  Raycasting heavily inspired by the three.js Raycaster API docs
  http://threejs.org/docs/api/core/Raycaster.html
