About
=====

This fake album generator was created for the Interview Street Campus Collaborative Challenge on behalf of Duke University's team. Unfortunately the version that was submitted for judging was 5 hours old. There was a broken dependency on this particular platform (libjpegv8) that prevented one of our node-canvas module from behaving correctly. The version you see here, however, is updated to what was meant to be submitted to the contest.

Dependencies
============

* ImageMagick
* GraphicsMagick
* `node`
	* npm
	* express
	* jade
	* easyimage
	* gm
	* canvas
	* supervisor (optional)

Deploying
=========

First make sure that the dependencies are installed prior to deployment.

Run the following commands to deploy after cloning the repository and setting it to the working directory:
	mkdir albumcovers
	npm install -d
	sudo supervisor app.js

Main Collaborators
==================

* Kevin Gao (sudowork)
* Yang Su (yangsu)
* Kelvin Gu

Future
======

We may refactor or update the codebase for this project. As of now, its only purpose is for archival uses. This was more of a hack-job than a formal project, hence the messiness. 
