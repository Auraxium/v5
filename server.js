//#region INITIAL
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var path = require("path");
var fs = require("fs");
var cors = require("cors");
var formidable = require("formidable");
var upload = require("express-fileupload");
var jsmediatags = require("jsmediatags");

p = (s) => console.log(s);

var readData = JSON.parse(fs.readFileSync("./used_dir.json", "utf8"));
var common = readData.common;

//#endregion

//#region FUNCTIONS

function delay(secs) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(""), secs);
  });
}

async function ak() {
	while(true) {
		p('hi')
		await delay(1000)
	}
	
}

//ak()

//#endregion

//#region ROUTES

app.use(cors({ 
	origin: "*", 
	credentials: true,
	methods: "*",
	headers: "*"
}));
app.use(express.json());

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.use(upload());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/load", (req, res) => {
  res.sendFile(__dirname + "/test.json");
});

app.post("/save", (req, res) => {
  fs.writeFile("test.json", JSON.stringify(req.body), "utf8", (err) => {
    if (err) {
      console.log("An error occured while writing JSON Object to File: " + err);
      return console.log("ERROR: Failed to save: " + err);
    }
  });
  console.log("File Saved to directory");
  return res.end("File saved.");
});

app.post("/upload", (req, res) => {
  var file = req.files.file;
  var filename = file.name;
  var path = __dirname + "/music/" + filename;

  file.mv(path, (err) => {
    if (err) res.send(err);
    else res.send(path);
  });
});

app.post("/dragevent", (req, res) => {
  var names = req.body;
	//p(names)
  if (typeof names != "object") return p("body not a arr");

	var bool = false;
  var folders = [...common];
  var ignore = [...readData.ignore];
	var result = [];

  p("starting search");

  for (let i = 0; i < folders.length; i++) {
    var startPath = folders[i];

    if (!fs.existsSync(startPath)) {
      console.log("no dir ", startPath);
      continue;
    }
		//if (ignore.findIndex((el) => startPath.endsWith(el)) !== -1) 
		//	continue;
    //ignore.push(startPath);
    var files = fs.readdirSync(startPath);
    for (let h = 0; h < files.length; h++) {
      const fel = files[h];
      try {
        var filename = path.join(startPath, fel);
      //  p(filename);
        var stat = fs.lstatSync(filename);

        if (stat.isDirectory()) folders.push(filename);
        else {
					for (let j = 0; j < names.length; j++) {
						const name = names[j];

						if (filename.endsWith(name.target)) {
							console.log("--found: ", filename);
							names.splice(j, 1);
							j--;
							if (!common.includes(startPath)) common.push(startPath);
							readData.common = common;
							result.push({loc: name.location, newpath: filename});
							fs.unlinkSync(name.deleteTemp);
						}
					}
					if(!names) {
						p('brokesn')
						bool = true
						break;
					}
						
				}
      } catch (err) {p(err)}
			if(bool)
				break
    }
		if(bool)
				break
		// });
  }
	p('search ended')
		fs.writeFileSync("./used_dir.json", JSON.stringify(readData), (err) => {if(err) p(err)});
		return res.send(result) 
});

app.delete("/del_path", bodyParser.text({ type: "*/*" }), (req, res) => {
	fs.unlink(req.body, (err) => {
    if (err) res.send(err);
  })
});

app.get("/song/:path", (req, res) => {
  var song_path = req.params.path.replace(/☹☸☼☺☿☾☻/g, "\\");
  //	p('get ' + song_path)
  res.sendFile(song_path, (err) => {
    if (err) {
      console.log("ERROR: " + err);
      return res.end("ERROR: " + err);
    }
  });
});

app.post("/art/:path", (req, res) => {
  var song_path = req.params.path.replace(/☹☸☼☺☿☾☻/g, "\\");
  //consider: ☹☸☼☺☿☾☻

  jsmediatags.read(song_path, {
    onSuccess: (tag) => {
      if (tag.tags.picture == null) return;
      var pdata = tag.tags.picture.data;
      var format = tag.tags.picture.format;
      let base64String = "";

      for (let i = 0; i < pdata.length; i++)
        base64String += String.fromCharCode(pdata[i]);

      //var uurl = base64String
      return res.end(base64String);
    },
    onError: (err) => p(err),
  });
});

app.listen(8000, null, () => console.log("Running"));

//#endregion
