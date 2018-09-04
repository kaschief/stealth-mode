document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("ScriptJS Loaded -- ready to manipulate");
  },
  false
);

//function to validate URL

// let validURL = function(url) {
//   var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
//   if (!regex.test(url)) {
//     console.log("Please enter valid URL");
//     return false;
//   } else {
//     return true;
//   }
// };

// //validate URL
// let enteredURL = validURL(req.body.url);

// if (enteredURL === false) {
//   res.render("mylist", {
//     user: req.user,
//     errorMessage: "Please enter a valid URL"
//   });
//   return;
// }
