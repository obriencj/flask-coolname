

from coolname import generate
from flask import Flask, render_template, request, jsonify
from functools import wraps
from os.path import join
from pkg_resources import resource_filename


site = resource_filename(__name__, 'site')
app = Flask('coolname',
            static_url_path='',
            static_folder=join(site, 'static'),
            template_folder=join(site, 'templates'))


def json_route(fn):
    @wraps(fn)
    def wrapped(*args, **kwds):
        return jsonify(fn(*args, **kwds))
    return wrapped


def data_from_args():
    count = request.args.get('count', 10, type=int)
    count = min(max(count, 1), 50)

    width = request.args.get('width', 3, type=int)
    width = min(max(width, 2), 4)

    data = (generate(width) for _ in range(0, count))
    return count, width, data


def slugs_from_args():
    count, width, data = data_from_args()

    separator = request.args.get('separator', '-', type=str)
    separator = separator[:5]

    slugs = map(separator.join, data)
    return count, width, separator, slugs


@app.route('/')
def _root():
    _count, width, sep, data = slugs_from_args()
    return render_template('index.html', data=list(data),
                           width=width, separator=sep)


@app.route('/api/v1/slug')
@json_route
def _api_slug():
    count, width, sep, data = slugs_from_args()

    return {
        "count": count,
        "width": width,
        "separator": sep,
        "results": list(data),
    }


@app.route('/api/v1/list')
@json_route
def _api_list():
    count, width, data = data_from_args()

    return {
        "count": count,
        "width": width,
        "results": list(data),
    }


if __name__ == '__main__':
    app.run(port=8080)


# The end.
