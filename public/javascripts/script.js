//const axios = require("axios");

// document.addEventListener(
//   "DOMContentLoaded",
//   () => {
//     console.log("ScriptJS Loaded -- ready to manipulate");
//   },
//   false
// );

$(document).ready(function() {
  console.log("JQuery is ready!");

  //when the URL submit button is clicked....

  $("#submit-form").submit(_ => {
    console.log("This is working");

    //capture the entered text
    const enteredURL = $("input[name='url']").val();
    console.log(enteredURL);

    let validURL = function(url) {
      var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
      if (!regex.test(url)) {
        console.log("Please enter valid URL");
        return false;
      } else {
        return true;
      }
    };

    let URLTest = validURL(enteredURL);

    if (URLTest === false) {
      console.log("FALSE");
    }
  });
});

//function to validate URL

// //validate URL
// let enteredURL = validURL(req.body.url);

// axios
//   .get(
//     "https://newsapi.org/v2/top-headlines?country=us&apiKey=3393221cf7ba4f5ab1a873161304c7f3"
//   )
//   .then(response => {
//     console.log(response);
//   });
