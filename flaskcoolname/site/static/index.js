/*
  Ms. Sluggy Slugwoth Slugworm (huaghhh)
*/


var sluglist = null;   // the element #sluglist

var resp = null;    // the promise to fetch more slugs
var ready = true;   // click action semaphore
var killer = 0;     // how many slugs we're currently removing
var wanted = 0;     // how many slugs we're expecting to get


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

        li.appendChild(check);
        li.appendChild(document.createTextNode(slug));

        sluglist.appendChild(li);
    }
}

async function rebuildSlugs() {
    // triggered when the last destroySlug handler happens, or when
    // we've had a refresh and there's a leftover wanted call
    // (indicating that we never were able to resolve the last fetch)

    resp.then(async (r) => {
        return r.json();

    }).then(async (d) => {
        var slugs = d.results;
        injectSlugs(slugs);

        resp = null;
        ready = true;
        wanted = 0;

    }).catch((err) => {

        showStatus(err.message);
        resp = null;
        ready = true;
    });
}


async function destroySlug(e) {
    if (e.propertyName == "opacity") {
        return;
    }

    // we're killing off the unwanted slugs. Once all are gone, we'll
    // start the rebuilding process with the data from the fetch
    // promise which was started in the background

    e.target.remove();
    killer -= 1;

    if (killer > 0)
        return;

    if (! resp) {
        ready = true;
        return;
    }

    await rebuildSlugs();
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

    if (text.length == 0) {
        showStatus("nothing to copy");

    } else {
        await navigator.clipboard.writeText(text.join("\n"));
        showStatus("copied " + text.length + " slugs to clipboard");
    }
}


async function rollSlugs(e) {
    if (resp || ! ready)
        return;

    ready = false;

    if (wanted > 0) {
        // a wanted value greater than 0 indicates we have a leftover
        // load that never completed, so let's just try to fetch again

        params['count'] = wanted;
        showStatus("fetching " + wanted + " new slugs");

        resp = fetch('api/v1/slug?' + new URLSearchParams(params));
        await rebuildSlugs();
    }

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
        // we have some un-wanted slugs, so we'll mark them as such
        // and trigger a fetch for replacements. The actual resolution
        // of the fetch result will happen once all of the un-wanted
        // slugs have triggered their destroySlug handler

        wanted = killer;
        params['count'] = wanted;
        showStatus("fetching " + killer + " new slugs");

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


function gotoAbout(e) {
    window.location = "./about.html";
    e.cancelBubble = true;
}


function hideStatus(e) {
    var stat = e.target;
    if (stat.className != "") {
        stat.className = "";
    }
}


function showStatus(stat) {
    var status = document.getElementById("status");
    var s = status.firstChild;
    s.textContent = stat;
    status.className = "showme";
}


function addButtons() {
    var btndiv = document.getElementById("buttons");
    var btn = null;
    var div = null;

    while (btndiv.firstChild) {
        btndiv.removeChild(btndiv.firstChild);
    }

    btn = document.createElement("button");
    btn.onclick = gotoAbout;
    div = document.createElement("div");
    div.setAttribute("class", "about");
    div.appendChild(btn);
    btndiv.appendChild(div);

    // not really a button, but... whatever.
    btn = document.createElement("span");
    div = document.createElement("div");
    div.setAttribute("id", "status");
    div.ontransitionend = hideStatus;
    div.appendChild(btn);
    btndiv.appendChild(div);

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
