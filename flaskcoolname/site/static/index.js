

var stmt = document.getElementById("statement");
var vprt = document.getElementById("viewport");

var resp = null;
var ready = true;

var params = {
    "width": 3,
    "separator": '-',
};


function setVars(width, separator) {
    params.width = width;
    params.separator = separator;
    console.log(params);
}


function rollStatement(e) {
    if (resp || ! ready)
        return;

    ready = false;
    stmt.className = "outgoing";

    resp = fetch('api/v1/slug?' + new URLSearchParams(params));
}


async function transitionDone(e) {
    if (! resp) {
        ready = true;
        return;
    }

    resp.then(async (r) => {
        var data = await r.json();
        var slugs = data.results;

        stmt.innerHTML = null;

        for (var i=0; i < slugs.length; i++) {
            var li = document.createElement('li');
            li.textContent = slugs[i]
            stmt.appendChild(li);
        }

        resp = null;
        stmt.className = null;
    });
}


stmt.addEventListener('click', rollStatement);
stmt.addEventListener('transitionend', transitionDone);
vprt.addEventListener('click', rollStatement);


// The end.
