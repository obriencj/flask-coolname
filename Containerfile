FROM python:3.11


ENV \
  GUNICORN_CMD_ARGS="--config=gunicorn_conf.py" \
  PIP_ROOT_USER_ACTION=ignore \
  PYTHON_PATH=/app


WORKDIR /app

COPY requirements.txt .
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

COPY flaskcoolname/ ./flaskcoolname/
COPY gunicorn_conf.py .


ENTRYPOINT [ "gunicorn" ]


# The end.
