FROM node:0.12.4-onbuild

# note: working directory is /usr/src/app by defualt

# install the bower binary
RUN npm -g install bower

# set GIT_DIR so bower doesn't blow up; needed because we're using a
# git submodule in combination with docker and bower
ENV GIT_DIR /usr/src/app

# use HTTPS instead of GIT protocol (avoid firewall issues)
RUN git config --global url."https://".insteadOf git://

# use bower to install the webapp dependencies
RUN bower install --allow-root
