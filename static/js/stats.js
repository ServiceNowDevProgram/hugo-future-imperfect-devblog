function getPage() {
    var p = getUrlParameter("p") || $("#current-slug").val();
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
    /*  DHS - 2019/02/20
        I don't know if this is the best place for this but it is working. Amenable to factoring elsewhere as long as it binds callback
        prior to first submit of the comment (ie, in the first second or so).
    */
    $(document).ready(function() {
        $("#search").submit(function() {
            var query = $('input[name="q"]').val();
            window.location.href = '/app.do#!search?q='+query+'&category=Blog';
            return false;
        }); 
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
        response.result.comments.forEach( function(comment){
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
    var p = getPage();
    var text = $('#comment-text').val();
    var json = {};
    json.path = p;
    json.text = text;
    var jsonString = JSON.stringify(json);

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
            loadComments(p);
            $('#comment-text').val('');
        },
        error: function(xhr, error_text, statusText) {
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