/*
  Ms. Sluggy Slugwoth Slugworm (huaghhh)
*/


var sluglist = null;   // the element #sluglist

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

        sluglist.appendChild(li);
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


async function copySlugs(e) {
    var text = [];

    var slugs = sluglist.children;
    for (var i = 0; i < slugs.length; i++) {
        var slug = slugs[i];
        var check = slug.children[0];

        if (check.checked) {
            text.push(slug.innerText);
            console.log(slug.innerText);
        }
    }

    if (text.length == 0)
        return;

    await navigator.clipboard.writeText(text.join("\n"));
}


function rollSlugs(e) {
    if (resp || ! ready)
        return;

    ready = false;
    killer = 0;

    var slugs = sluglist.children;
    for (var i = 0; i < slugs.length; i++) {
        var slug = slugs[i];
        var check = slug.children[0];

        if (! check.checked) {
            slug.ontransitionend = destroySlug;
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


function addButtons() {
    var btndiv = document.getElementById("buttons");
    var btn = null;
    var div = null;

    while (btndiv.firstChild) {
        btndiv.removeChild(btndiv.firstChild);
    }

    btn = document.createElement("button");
    btn.onclick = copySlugs;
    div = document.createElement("div");
    div.setAttribute("class", "copy");
    div.appendChild(btn);
    btndiv.appendChild(div);

    btn = document.createElement("button");
    btn.onclick = rollSlugs;
    div = document.createElement("div");
    div.setAttribute("class", "refresh");
    div.appendChild(btn);
    btndiv.appendChild(div);
}


function init(width, separator, slugs) {
    sluglist = document.createElement("ul");
    sluglist.setAttribute("id", "sluglist");
    sluglist.setAttribute("class", "sluglist");
    sluglist.onclick = toggleSlug;

    var stmt = document.getElementById("statement");
    stmt.appendChild(sluglist);

    params.width = width;
    params.separator = separator;

    injectSlugs(slugs);
    addButtons();
}


// The end.
