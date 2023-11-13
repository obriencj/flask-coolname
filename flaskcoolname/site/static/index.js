
var stmt = document.getElementById("statement");
var vprt = document.getElementById("viewport");

var resp = null;


async function rollStatement(_e) {
    resp = fetch('/api/v1/slug');
    stmt.className = "outgoing";
}


function refillStatement(slugs) {
    stmt.innerHTML = null;
    for (var i=0; i < slugs.length; i++) {
        var li = document.createElement('li');
        li.textContent = slugs[i]
        stmt.appendChild(li);
    }

    stmt.className = "";
}


async function transitionDone(_e) {
    console.log("enter transition")
    if (stmt.className == "outgoing") {
        resp.then(async (r) => {
            var data = await r.json();
            refillStatement(data.results);
        });
        resp = null;
    }
    console.log("exit transition")
}


stmt.addEventListener('click', rollStatement);
stmt.addEventListener('transitionend', transitionDone);
vprt.addEventListener('click', rollStatement);

// The end.
