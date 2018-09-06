$(document).ready(function() {
    console.log('JQuery is ready!');

    $('#mylist-submit').submit(e => {
        console.log('This is working');

        const enteredURL = $('#exampleInputURL').val();

        // console.log("----------", enteredURL.length);

        // if (enteredURL.length === undefined) {
        //   console.log("EMPTY");
        // }

        console.log(enteredURL);

        let validURL = function(url) {
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if (!regex.test(url)) {
                console.log('Please enter valid URL');
                return false;
            } else {
                return true;
            }
        };

        let URLTest = validURL(enteredURL);

        if (URLTest === false) {
            e.preventDefault();
            $('#myListSave > div.alert.alert-danger').toggle();
        }
    });
});
