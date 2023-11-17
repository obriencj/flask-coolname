/*
  Ms. Sluggy Slugwoth Slugworm (huaghhh)
*/


var vprt = null;   // the element #viewport
var stmt = null;   // the element #statement (created in init)

var resp = null;   // the promise to fetch more slugs
var ready = true;  // click action semaphore
var killer = 0;    // how many slugs we're currently removing

// params are set at init, and used when fetching more slugs
var params = {
    "width": 3,
    "separator": '-',
    "count": 10,
};


function injectSlugs(slugs) {
    for (var i=0; i < slugs.length; i++) {
        var slug = slugs[i];

        var li = document.createElement('li');

        var check = document.createElement('input');
        check.setAttribute('type', 'checkbox');
        check.setAttribute('id', slug);
        check.innerText = " ";

        li.appendChild(check);
        li.appendChild(document.createTextNode(" "));
        li.appendChild(document.createTextNode(slug));

        stmt.appendChild(li);
    }
}


function destroySlug(e) {
    if (e.propertyName == "opacity") {
        return;
    }

    e.target.remove();
    killer -= 1;

    if (killer > 0)
        return;

    if (! resp) {
        ready = true;
        return;
    }

    resp.then(async (r) => {
        var data = await r.json();
        var slugs = data.results;

        injectSlugs(slugs);

        resp = null;
        ready = true;
    });
}


function rollSlugs(e) {
    if (resp || ! ready)
        return;

    ready = false;
    killer = 0;

    var slugs = stmt.children;
    for (var i = 0; i < slugs.length; i++) {
        var slug = slugs[i];
        var check = slug.children[0];

        if (! check.checked) {
            slug.addEventListener('transitionend', destroySlug);
            slug.className = "unwanted";
            killer += 1;
        }
    }

    if (killer > 0) {
        params['count'] = killer;
        resp = fetch('api/v1/slug?' + new URLSearchParams(params));

    } else {
        ready = true;
    }
}


function toggleSlug(e) {
    var tag = e.target;
    if (tag.tagName == "LI") {
        var check = tag.children[0]
        check.checked = ! check.checked;
    }
    e.cancelBubble = true;
}


function init(width, separator, slugs) {
    stmt = document.createElement("ul");
    stmt.setAttribute("id", "statement");
    stmt.addEventListener('click', toggleSlug);

    vprt = document.getElementById("viewport");
    vprt.appendChild(stmt);
    vprt.addEventListener('click', rollSlugs);

    params.width = width;
    params.separator = separator;

    injectSlugs(slugs);
}


// The end.
