# Thanks for visiting my Makefile. Enjoy your stay.


default:	help


help:	## Display this help  (default)
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


##@ Requirements

requirements.txt: setup.cfg
	@pip-compile setup.cfg


upgrade:	## Upgrade the components in requirements.txt
	@pip-compile --upgrade setup.cfg


##@ Container

container: requirements.txt flake8	## Build and tag flask-coolname:local
	@podman build . -f Containerfile --tag "flask-coolname:local"


launch: container	## Build, tag, and run flask-coolname:local
	@podman run --rm -it -p 8080:8080 --network bridge \
	  "flask-coolname:local"


##@ Local

clean:   ## Removes stray eggs and .pyc files
	@rm -rf *.egg-info
	@find -H . \
	  \( -iname '.tox' -o -iname '.eggs' -prune \) -o \
	  \( -type f -iname '*~' -exec rm -f {} + \) -o \
	  \( -type d -iname '__pycache__' -exec rm -rf {} + \) -o \
	  \( -type f -iname '*.pyc' -exec rm -f {} + \)
	@rm -f bandit.sarif


preview: requirements.txt flake8	## Launch the app locally with flask
	@tox -qe preview


##@ Testing

bandit: ## Bandit validation
	@tox -qe bandit


flake8:	## Flake8 validation
	@tox -qe flake8


.PHONY: container flake8 help launch preview upgrade


# The end.
