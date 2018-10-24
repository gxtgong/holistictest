var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");

var tempFileName = "";

if (!fs.existsSync('./testdata')){
    fs.mkdirSync('./testdata');
}

function processed (s) {
	return s.replace(/%20/g, " ");
}
/*var corpus = {
    // two stories: one with a buildup and another with linear emotions
    // how bucket of meaning of story gets filled
    "Death Buys A Coffee": "Death goes to buy a coffee, but inside the cafe, everyone is too preoccupied to notice. At the doorway, he leaves his scythe propped up against the wall and drapes his cobwebbed cloak over the coat hanger. He eyes the menu scrawled overhead with chalk, the frame of his jaw parted in perpetual uncertainty. The barista taps her foot from behind the counter and makes a face. \"Sir, are you ready to order? We have customers waiting, you know,\" she huffs. Death glances over his shoulder to meet the glare of a wrinkly-eyed woman. \"Ah–my bad. Just give me a moment.\" He pauses. \"I’d like a regular, hot, organic caramel latte with mocha drizzle–oh, and make it gluten-free, please.\" \"Your name?\" \"Death,\" says Death. He reaches into his pocket for spare change, though it\'s mostly made up of wadded five-dollar bills and quarters. He makes sure to drop a dime into the tip jar as he nods sheepishly at the barista. She rolls her eyes. \"That\'ll be \$4.39.\" Another worker slides his mug down the countertop, and Death curls his bony fingers around it, taking a whiff. It’s sweet. Perhaps a bit too much for his taste. He wanders into the back of the room, searching for a vacant seat. Somewhere there is a vinyl record player oozing out a man’s low humming of a familiar song. Death sings along, finding an armchair near a window overlooking the street. From outside, figures dart down the sidewalk with faces tucked into mufflers. A red-nosed woman passes and catches him staring. Death smiles, but she turns away. As he is settling in, the door springs open and wind rushes in. He spills a bit of latte. Death winces, then glances up at a little girl with a wide, toothy grin. \"Hi!\" she says. \"I saw you through the window. I like your costume!” She takes a seat next to Death, waving at her mother who’s ordering at the front. A woman with worn lines etched into her skin looks back, her expression vacant. Absent of contentment. If anything, she could appear no less unconcerned about her daughter making conversation with a peculiar, darkly-clothed entity. Instead, the air around her is reminiscent of fresh grief. The girl continues to beam at Death, half-expecting a response. He clears his throat. \"Really,” Death muses. \"Shouldn’t you be in school?” The little girl frowns. \"I would be, but Mama’s going to see Kitty at the vet’s next door.” \"Kitty?” \"That’s our cat. She’s being put down today.” Death takes a slow sip. \"Is that so?” \"Yeah. Mama says that means everything is going to be okay again. You see, Kitty’s been sick for a while.” He sets his mug down, watching the steam spin into sinewy tendrils. Death tilts his head to the side and peers at his scythe, still balanced against the wall undisturbed. He ruffles the hair of the little girl and she giggles. A sad smile creeps onto his face. \"...I see.\"",
    "The Anatomy of a Meal": "They replaced her pinky fingers with tiny dill pickles. At breakfast it was pork sausage, cheap skinny links fashioned into prosthetics and slippery with grease. Three times a day she’d devour the pyramid-portioned meals her mother cooked and wash them down with heavy, thick milk. Racing outside after her plate passed inspection, she’d run the three blocks to my house and breathe loudly at the door, pushing invisibly against my neck and urging me to hurry. She’d lost the fingers before she was born. Doc Nevins said her fingers were never there and that the stork musta forgot them back at his nest. We’d spent our early years in trees together, checking all the birds’ nests, looking for any sign of baby fingers. She kept a little pouch tied to the belt loops on her jeans every day just in case she found them. Then one night at the dinner table her brother Sam said the French fries looked like fingers and Maggie said she was bored of tree-climbing and maybe we should ride bikes instead. From then on she ate only fingers made of carrots and cheese, French toast sticks and slivers of apple, elongated grapes, celery slathered in peanut butter, digit-sized chicken strips and anything else Mrs. Fenley could create in her kitchen. When Maggie heard that milk helped your bones to grow she demanded it at every meal and when her mother wasn’t looking, Maggie would soak her hands in it pushing everything down to the bottom of the glass and wishing for the smallest lump when she pulled them back out. Some days I taped my pinky fingers behind my ring fingers and pretended I was Maggie. I would stare at my hands and tilt them, removing the knuckles and joints Maggie was without. Sometimes I forgot to take the tape off and she would see it twisted around my fingers and frown. She wondered why I wanted what she didn’t, how I could give up her most prized possession so easily but I could never answer her. Instead I would run to my mother and ask for three dollars, wiping away my tears with the sleeves of my T-shirt while she rummaged in her purse. I would tuck the money safely into my front pocket and me and Maggie would ride silently to the grocery store on our bikes. She would wait outside on the curb while I went in and bought her favourite cookies and then we would sit together all afternoon and eat an entire box of ladyfingers."
    };

function split(corpus) {
    for (var title in corpus){
        p = processed(corpus[title]);
        corpus[title] = p.split(" ");
    } 
    //console.log(corpus[title])
};
split(corpus);
//var video = {};
//video["nameArray"] = fs.readdirSync("./demo");
fs.writeFileSync('newcorpus.json', JSON.stringify(corpus, null, 4));*/

http.createServer(function(req, res) {

    console.log(`${req.method} request for ${req.url}`);

    // line 17-25 added from RecordRTC/server.js (request and response replaced by req and res)
    var uri = url.parse(req.url).pathname,
        filename = path.join(process.cwd(), uri);

    var isWin = !!process.platform.match(/^win/);

    if (filename && filename.toString().indexOf(isWin ? '\\uploadFile' : '/uploadFile') != -1 && req.method.toLowerCase() == 'post') {
        uploadFile(req, res);
        return;
    }else if (req.method === "GET") {
        if (req.url === "/") {
            fs.readFile("./home.html", "UTF-8", function(err, html) {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(html);
            });

        } else if (req.url.match(/.js$/)) {

            var jsPath = path.join(__dirname, req.url);
            var jsStream = fs.createReadStream(jsPath, "UTF-8");

            res.writeHead(200, {
                "Content-Type": "text/js"
            });

            jsStream.pipe(res);

        } else if (req.url.match(/.css$/)) {

            var cssPath = path.join(__dirname, req.url);
            var cssStream = fs.createReadStream(cssPath, "UTF-8");

            res.writeHead(200, {
                "Content-Type": "text/css"
            });

            cssStream.pipe(res);

        } else if (req.url.match(/.png$/)) {

            var imgPath = path.join(__dirname, req.url);
            var imgStream = fs.createReadStream(imgPath);

            res.writeHead(200, {
                "Content-Type": "image/png"
            });

            imgStream.pipe(res);

        } else if (req.url.match(/.json$/)) {

            var jsonPath = path.join(__dirname, req.url);
            var jsonStream = fs.createReadStream(jsonPath, "UTF-8");

            res.writeHead(200, {
                "Content-Type": "text/json"
            });

            jsonStream.pipe(res);

        } else if (req.url.match(/.mp4$/)) {

            var mp4Path = path.join(__dirname, processed(req.url));
            var mp4Stream = fs.createReadStream(mp4Path);

            res.writeHead(200, {
            	"Content-Type" : "video/mp4"
            });

            mp4Stream.pipe(res);

        } else if (req.url.match(/.webm$/)) {

            var webmPath = path.join(__dirname, processed(req.url));
            var webmStream = fs.createReadStream(webmPath);

            res.writeHead(200, {
            	"Content-Type" : "video/webm"
            });

            webmStream.pipe(res);

        } else {

            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.end("404 File Not Found");
        }
    } else if (req.method === "POST") {
    	var body = "";
    	req.on("data", function(chunk){
    		body += chunk;
    	})
    	req.on("end", function() {
            tempFileName = req.url.replace("/","").replace(".json","");
            if (!fs.existsSync('./testdata/'+tempFileName)){
                fs.mkdirSync('./testdata/'+tempFileName);
            }
            fs.writeFile('./testdata/'+tempFileName+"/"+tempFileName+".json", body, function(){
                console.log("WRITE data" + " TO " + tempFileName + ".json");
                res.end();
            });
    	})
    }


}).listen(8000);

console.log("File server running on port 8000");

// function added from RecordRTC/server.js
function uploadFile(request, response) {
    // parse a file upload
    //var mime = require('mime'); //error: can't find module mime
    var formidable = require('formidable'); //extra thing installed
    var util = require('util');

    var form = new formidable.IncomingForm();

    //var dir = !!process.platform.match(/^win/) ? '\\uploads\\' : '/uploads/';

    form.uploadDir = __dirname;// + dir;
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = false;

    //rename the file or it will be a random string
    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(__dirname, './testdata/'+tempFileName+'/'+tempFileName+".webm"), function(err){
            if (err) throw err;
        });
    });

    form.parse(request, function(err, fields, files) {
        var file = util.inspect(files);
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.write(JSON.stringify({'fileURL': tempFileName+".webm"}));
        response.end();
    });
}