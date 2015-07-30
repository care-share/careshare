FROM node:0.12.4-onbuild

<<<<<<< HEAD
# note: working directory is /usr/src/app by defualt
=======
# install build essentials (allows for native node modules)
RUN apt-get update && apt-get install -y build-essential

# use HTTPS instead of GIT protocol (avoid firewall issues)
RUN git config --global url."https://".insteadOf git://

# create application directory and use it as the working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
>>>>>>> 6cf2d27... Docker updates

# install the bower binary
RUN npm -g install bower

# set GIT_DIR so bower doesn't blow up; needed because we're using a
# git submodule in combination with docker and bower
ENV GIT_DIR /usr/src/app

# use HTTPS instead of GIT protocol (avoid firewall issues)
RUN git config --global url."https://".insteadOf git://

# use bower to install the webapp dependencies
RUN bower install --allow-root
