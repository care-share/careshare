#!/bin/bash
export port=443
export use_tls=true
export domain=vacareshare.org
ember server --proxy https://fhir.vacareshare.org