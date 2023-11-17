# Put gunicorn setting overrides here
#

bind = "0.0.0.0:8080"

# puts the coolname words into memory for workers before fork
preload_app = True

# afaict this is used for fast sending of the static content
sendfile = True

# set to (cores * 2) + 1
workers = 5

worker_class = "sync"


# The end.
