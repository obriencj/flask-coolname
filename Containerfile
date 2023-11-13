FROM python:3.11 AS BUILD


WORKDIR /build

COPY setup.cfg setup.py .
COPY flaskcoolname/ ./flaskcoolname/

ENV PIP_ROOT_USER_ACTION=ignore
RUN pip3 install --upgrade pip build wheel
RUN python3 -B -m build . -o /build/wheel


# Launches flaskcoolname via gunicorn
FROM python:3.11


WORKDIR /setup

ENV PIP_ROOT_USER_ACTION=ignore
COPY requirements.txt .
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

COPY --from=BUILD /build/wheel/*.whl .
RUN pip3 install *.whl


WORKDIR /app
COPY gunicorn_conf.py .


EXPOSE 8080

ENTRYPOINT [ "gunicorn" ]
CMD [ "--conf", "gunicorn_conf.py", \
      "--bind", "0.0.0.0:8080", "flaskcoolname:app" ]


# The end.
