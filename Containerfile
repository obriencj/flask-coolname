# Multi-stage container image to build flaskcoolname and get it
# installed and running under gunicorn on alpine.
# Author: Christopher O'Brien  <obriencj@gmail.com>


FROM python:3.11-slim AS BUILD

ENV \
  PIP_DISABLE_PIP_VERSION_CHECK=1 \
  PIP_NO_CACHE_DIR=1 \
  PIP_ROOT_USER_ACTION=ignore


WORKDIR /build

COPY setup.cfg setup.py .
COPY flaskcoolname/ ./flaskcoolname

RUN \
  pip3 install build && \
  python3 -m build .


FROM python:3.11-alpine

ENV \
  GUNICORN_CMD_ARGS="--config=gunicorn_conf.py" \
  PIP_DISABLE_PIP_VERSION_CHECK=1 \
  PIP_NO_CACHE_DIR=1 \
  PIP_ROOT_USER_ACTION=ignore


WORKDIR /app

COPY gunicorn_conf.py requirements.txt .
COPY --from=BUILD /build/dist/flaskcoolname*.whl .

RUN \
  adduser -DS -s /sbin/nologin flask flask && \
  pip3 install -r requirements.txt --no-deps flaskcoolname*.whl && \
  rm requirements.txt *.whl


USER flask
ENTRYPOINT ["gunicorn"]


# The end.
