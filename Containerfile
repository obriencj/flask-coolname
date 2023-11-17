FROM python:3.11


WORKDIR /app

ENV PYTHON_PATH=/app
ENV PIP_ROOT_USER_ACTION=ignore

COPY requirements.txt .
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

COPY flaskcoolname/ ./flaskcoolname/
COPY gunicorn_conf.py .


EXPOSE 8080

ENTRYPOINT [ "gunicorn" ]
CMD [ "--conf", "gunicorn_conf.py", \
      "--bind", "0.0.0.0:8080", "flaskcoolname:app" ]


# The end.
