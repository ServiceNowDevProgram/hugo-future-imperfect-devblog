function getPage() {
    var p = getUrlParameter("p") || $("#current-slug").val();
    console.log("in getPage, p = " + p);
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
//        console.log("Inside JQuery's ready function");
        var p = getPage();
        loadReadCount(p);
        loadComments(p);
    });
})

function loadReadCount(p) {
    $.get('/api/x_snc_devblog/v1/vfs/getCount?p=' + p , 
    function(response) {
        $('#read-count').html("Read Count: " + response.result.count); 
    }
); 
}

function loadComments(p) {
    $.get('/api/x_snc_devblog/v1/vfs/getComments?p=' + p , 
    function(response) {
        var commentBlock = "<ol>";
//        console.log("response = " + JSON.stringify(response, null, 4));
//       console.log(response);
        response.result.comments.forEach( function(comment){
//            console.log("in loop with "+ comment.text);
            commentBlock += "<li>";
            commentBlock += "<div class=\"commenter\">"+comment.author + "</div>";
            commentBlock += "<div class=\"time\">"+comment.time + "</div>";
            commentBlock += "<div class=\"text\">"+comment.text+"</div>";
            commentBlock += "</li>";
        } 
        );
        commentBlock += "</ol>"
        $('#comments').html( commentBlock); 
    }
); 
}

function submitComment(token) {
//    console.log("Clicked submit");
    var p = getPage();
    var text = $('#comment-text').val();
    var json = {};
    json.path = p;
    json.text = text;
    var jsonString = JSON.stringify(json);
    if (!token) {
        token = window.localStorage.getItem('X-UserToken');
    }
//    console.log("In submitComment() function, token = " + token);
//    console.log("In submitComment() function, sessionID = " + sessionID);
    

    jQuery.ajax ({
        url: '/api/x_snc_devblog/v1/vfs/postComment',
        beforeSend: function(request) {
            request.setRequestHeader("X-UserToken", token);
        },
        type: "POST",
        data: jsonString,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(){
//            console.log("Submit post worked!");
            loadComments(p);
            $('#comment-text').val('');
        },
        error: function(xhr, error_text, statusText) {
//            console.log("In error handler");
            var token = xhr.getResponseHeader('X-UserToken-Response');
            submitComment(token);
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