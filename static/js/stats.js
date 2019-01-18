function getPage() {
    var p = getUrlParameter("p");
    if (p) {
        if (! p.endsWith("index.html")) {
            if (p.endsWith("/")) {
                p = p + "index.html";
            } else {
                p = p + "/index.html";
            }
        }
        return p;
    }
}

$(function() {
    $(document).ready(function() {
        console.log("Inside JQuery's ready function");
        var p = getPage();
        loadReadCount(p);
        loadComments(p);
    });
})

function loadReadCount(p) {
    $.get('/api/x_snc_devblog/v1/vfs/getCount?p=' + p , 
    function(response) {
        console.log("In read count "+ JSON.stringify(response, null, 4));
        console.log(response);
        $('#read-count').html("Read Count: " + response.result.count); 
    }
); 
}

function loadComments(p) {
    $.get('/api/x_snc_devblog/v1/vfs/getComments?p=' + p , 
    function(response) {
        var commentBlock = "";
        console.log("response = " + JSON.stringify(response, null, 4));
        console.log(response);
        response.result.comments.forEach( function(comment){
            console.log("in loop with "+ comment.text);
            commentBlock += "<li>"+comment.time + " <br />" + comment.author + " <br />" + comment.text+"</li>";
        } 

        );
        $('#comments').html( commentBlock); 
    }
); 
}

function submitComment() {
    console.log("Clicked submit");
    var p = getPage();
    var text = $('#comment-text').val();
    var json = {};
    json.path = p;
    json.text = text;
    var jsonString = JSON.stringify(json);
    console.log(jsonString);
    jQuery.ajax ({
        url: '/api/x_snc_devblog/v1/vfs/postComment',
        type: "POST",
        data: jsonString,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(){
            console.log("Submit post worked!");
            loadComments(p);
        }
    });



}

var getUrlParameter = function getUrlParameter(sParam) {
    var parameters = window.location.search.substring(1);
    var sPageURL = decodeURIComponent(parameters),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};