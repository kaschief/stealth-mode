var request = require("request");
var cheerio = require("cheerio");

function fetchTitle(url, onComplete = null) {
  request(url, function(error, response, body) {
    //var output = url; // default to URL

    if (!error && response.statusCode === 200) {
      var $ = cheerio.load(body);
      //console.log(`URL = ${url}`);

      //find the title in the head, take text, then trim
      var title = $("head > title").text();
      // .trim();

      //find the first paragraph then take the text
      var description = $("p")
        .first()
        .text();

      var image = $("img")[0]["attribs"]["src"];

      console.log(title, image, description);
      output = `${title}${image}${description}`;
      //console.log(output);
    }
  });
}

fetchTitle("https://www.macrumors.com/2018/09/04/ios-11-adoption-85-percent/");
// .then(([title, image, description]) => {
//   console.log(title);
// });
