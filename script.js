var intervalID;

window.addEventListener("load", (event) => {
    function updateMetrics(project, name) {
        fetch(`https://legacy-api.arpa.li/${project}/stats.json`, {
            "method": "GET",
            "headers": {}
        }).then((res) => res.text()).then((stats) => {

            downloaderArray = new Array();
            currentDate = new Date().toLocaleString();
            fullStatData = JSON.parse(stats);
            if (fullStatData.downloaders.indexOf(name) > 0) {
                document.getElementById('msg').innerHTML = "";
                statPlace = document.getElementById("metric");

                for (const [key, value] of Object.entries(fullStatData.downloader_bytes)) {
                    downloaderArray.push({"name": key, "dl": value});
                }
                downloaderArray.sort(function (a, b) {
                    return b.dl - a.dl;
                });
                statPos = downloaderArray.findIndex(e => {
                    return(e.name === name)
                });
                gigsDL = humanBytes(fullStatData.downloader_bytes[name]);
                statTotP = fullStatData.downloaders.length;
                statPlace.innerHTML = `<h2>${name}'s Download Stats</h2>
									<hr>
                                    <p>Project Name: <span class=data>${project}</span></p>
                                    <p>Data Saved: <span class=data>${
                    gigsDL.toLocaleString()
                }</span></p>
                                    <p>Items Saved: <span class=data>${
                    fullStatData.downloader_count[name].toLocaleString()
                }</span></p>
                                    <p>Position: <span class=data>${statPos} / ${statTotP}</span></p>
                                    <p>As of: <span class=data>${currentDate}</span></p>`;
            } else {
                document.getElementById('msg').innerHTML = `<p>${name} is not listed as a downloader.</p>`;
            }


        }).then(console.log.bind(console)).catch(console.error.bind(console));
    }

    document.getElementById('lookup').addEventListener('click', function () {
        if (intervalID) {
            clearInterval(intervalID);
        }
        updateMetrics(document.getElementById('projectName').value, document.getElementById('nickName').value);
        intervalID = setInterval(() => {
            updateMetrics(document.getElementById('projectName').value, document.getElementById('nickName').value);
        }, 300000);

    });

    function humanBytes(bytes) {
        if (bytes > 1024 * 1024 * 1024) {
            return(Math.round(10 * bytes / (1024 * 1024 * 1024)) / 10) + ' GB';
        } else if (bytes > 1024 * 1024) {
            return(Math.round(10 * bytes / (1024 * 1024)) / 10) + ' MB';
        } else {
            return(Math.round(10 * bytes / (1024)) / 10) + ' kB';
        }
    }
});

