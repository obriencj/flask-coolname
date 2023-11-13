

from coolname import generate
from flask import Flask, render_template, request, jsonify
from os.path import join
from pkg_resources import resource_filename


site = resource_filename(__name__, 'site')
app = Flask('coolname',
            static_url_path='',
            static_folder=join(site, 'static'),
            template_folder=join(site, 'templates'))


@app.route('/')
@app.route('/<int:width>')
@app.route('/<int:width>/<separator>')
def _root(width=3, separator='-'):

    width = min(max(width, 3), 4)

    separator = separator[:5]

    count = request.args.get('count', 10, type=int)
    count = min(max(count, 1), 50)

    data = map(separator.join, (generate(width) for _ in range(0, count)))

    return render_template('index.html', data=data)


@app.route('/api/v1/slug')
@app.route('/api/v1/slug/<int:width>')
@app.route('/api/v1/slug/<int:width>/<separator>')
def _api_slug(width=3, separator='-'):

    width = min(max(width, 3), 4)

    separator = separator[:5]

    count = request.args.get('count', 10, type=int)
    count = min(max(count, 1), 50)

    data = map(separator.join, (generate(width) for _ in range(0, count)))
    data = list(data)

    return jsonify({
        "count": count,
        "width": width,
        "separator": separator,
        "results": data,
    })


@app.route('/api/v1/list')
@app.route('/api/v1/list/<int:width>')
def _api_list(width=3):

    width = min(max(width, 3), 4)

    count = request.args.get('count', 10, type=int)
    count = min(max(count, 1), 50)

    data = [generate(width) for _ in range(0, count)]

    return jsonify({
        "count": count,
        "width": width,
        "results": data,
    })


if __name__ == '__main__':
    app.run(port=8080)


# The end.
