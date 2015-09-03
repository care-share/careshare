FROM node:0.12.7

# install build essentials (allows for native node modules)
RUN apt-get update && apt-get install -y build-essential

# use HTTPS instead of GIT protocol (avoid firewall issues)
RUN git config --global url."https://".insteadOf git://

# create application directory and use it as the working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install the bower binary
RUN npm -g install bower

# install the ember-cli binary
RUN npm -g install ember-cli@1.13.1 --unsafe-perm

# install the phantomjs binary manually, since the npm method fails on too many edge cases
RUN \
    mkdir -p /tmp/ &&\
    wget --no-check-certificate -P /tmp/ https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2
RUN \
    tar -xjf /tmp/phantomjs-1.9.8-linux-x86_64.tar.bz2 -C /tmp/ &&\
    mv /tmp/phantomjs-1.9.8-linux-x86_64/bin/phantomjs /usr/local/bin/ &&\
    rm -rf /tmp/phantomjs-1.9.8-linux-x86_64*
#RUN npm -g install phantomjs --phantomjs_cdnurl=http://cnpmjs.org/downloads

# install watchman
RUN \
    git clone https://github.com/facebook/watchman.git &&\
    cd watchman &&\
    git checkout v3.1 &&\
    ./autogen.sh &&\
    ./configure &&\
    make &&\
    make install

# install node (server-side) dependencies
COPY package.json /usr/src/app/
RUN npm install

# install bower (client-side) dependencies
COPY bower.json /usr/src/app/
RUN bower install --allow-root

# copy the rest of the application over
COPY . /usr/src/app

# build the server
RUN ember build

# binary to execute
ENTRYPOINT ["/usr/local/bin/ember"]

# default command: start the server
CMD ["serve", "--proxy", "http://fhir.vacareshare.org"]

