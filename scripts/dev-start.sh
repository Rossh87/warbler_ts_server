#!/bin/bash

rm -rf build 

tsc

NODE_ENV='development' node -r dotenv/config build/index.js