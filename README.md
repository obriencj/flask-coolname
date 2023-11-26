# Flask Coolname

A simple [flask] app that provides a friendly web-ui and REST
interface to the [coolname] library.

[flask]: https://github.com/pallets/flask/
[coolname]: https://github.com/alexanderlukanin13/coolname

Did the world need it? Nope.

Simply put, I wanted to make something basic in flask to brush
up on my javascript and css skills, which were around twenty years
out-of-date. I have designs to significantly over-complicate this
little web service. Stay tuned to see how that plays out.


# Container

There is a pre-built containerized version of [flask-coolname] using
Python 3.11 and [Gunicorn].

[flask-coolname]: https://ghcr.io/obriencj/flask-coolname
[gunicorn]: https://github.com/benoitc/gunicorn

By default it can be used with a port mapping to 8080. However, one
can also map in an alternative configuration file to override any
settings one might desire, or specify overriding gunicorn options as
arguments to the container itself.

```bash
podman run --rm -p 8080:8080 -V ./my_config.py:/config.py \
  ghcr.io/obriencj/flask-coolname:master --config /config.py
```


# Contact

Author: Christopher O'Brien  <obriencj@gmail.com>

Repository: <https://github.com/obriencj/flask-coolname>

Container: <https://ghcr.io/obriencj/flask-coolname>


# License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


# Icons License

The icons are from [Google's material icons][icons], and are licensed
under the [Apache License Version 2.0][apl2].

[icons]: https://fonts.google.com/icons
[apl2]: https://www.apache.org/licenses/LICENSE-2.0.html
