

APP="flask-coolname"


default:	help


help:	## Display this help  (default)
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


##@ Requirements

requirements.txt: requirements.in
	@pip-compile


upgrade:	## Upgrade the components in requirements.txt
	@pip-compile --upgrade


##@ Container

container: requirements.txt flake8	## Build and tag flask-coolname:latest
	@podman build . -f Containerfile --tag "$(APP):latest"


launch: container	## Build, tag, and run flask-coolname:latest
	@podman run --rm -it \
          -p 8080:8080 --network bridge \
          "$(APP):latest"


##@ Local

preview: requirements.txt flake8	## Launch the app locally with flask
	@tox -qe preview


flake8:	## Flake8 validation
	@tox -qe flake8


.PHONY: container flake8 help launch preview upgrade


# The end.
