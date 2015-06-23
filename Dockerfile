FROM node:0.12.4-onbuild

RUN npm -g install bower
RUN bower install --allow-root