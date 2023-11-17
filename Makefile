

requirements.txt: requirements.in
	@pip-compile


upgrade-requirements:
	@pip-compile --upgrade


preview:
	@podman run --rm -it \
          -p 8080:8080 --network bridge \
          'flask-coolname:latest'


container:
	@podman build . -f Containerfile --tag 'flask-coolname:latest'


launch:
	@python3 -B -m flask --app 'flaskcoolname:app' run -p 8080


# The end.
