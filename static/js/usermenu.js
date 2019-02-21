usermenu = {};

usermenu.handleLoginStatus = function (response) {
    var displayName = response.display_name; 

    if (displayName == 'Guest') {
        $('.current-user').hide();
        $('.login').each(function() {
            $(this).removeClass('menu-hidden');
        });
        $("#comment-button").prop("disabled",true);
        $("#comment-button").hide();
        $("#comment-text").hide();
        $("#comment-login").show();
    } else {
        $('.current-user').html(displayName);
        $("#comment-button").prop("disabled",false);
        $("#comment-button").show();
        $("#comment-text").show();
        $("#comment-login").hide();
        $("#comment-notice").html('Submitting comments as ' + displayName);

    }       
};

usermenu.session_id = "";

usermenu.init = function (properties) {
    $(document).ready(function () {
      
        this.getSession = function (token) {
            var headers = {};

            if (token == undefined || token == "") {
            } else {
                headers = { 'X-UserToken': token };
            }

            $.ajax('devportal.do?sysparm_data=\{%22action%22:%22dev.user.session%22,%22data%22:\{\}\}', {
                headers: headers,
        
            })
            /* Leaving empty handlers but not actually doing anything. Add later if needed */
                .done(function (data, textStatus, jqXHR) {
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                })
                .always(function (response, textStatus, jqXHR) { //;paf; see http://stackoverflow.com/a/19498463/2914328
                    /* In always because we will either have a live token in X-UserToken or a rejected transaction with 
                    X-UserToken-Response populated with new one. The work happens here not 
                    */
                   try {
                    var responseToken = jqXHR.getResponseHeader('X-UserToken') ||jqXHR.getResponseHeader('X-UserToken-Response') ;
                   } catch (e) {
                       console.log("Error: "+e);
                   }
                    usermenu.handleLoginStatus(response);
                }
                );
        };
        

        $('.current-user').click(function (e) {
            e.stopPropagation();
            var menu = $('.user-menu ul');
            menu.toggleClass('menu-hidden');

            $('body').on('click', function () {
                menu.attr('class', 'menu-hidden');
            });
        });
        

        $('.logout').click(function () {
            $.get('/logout.do', function (response) {
                var logoutURL = properties.okta + '/login/signout?fromURI=';
                logoutURL += window.location;
                window.location.href = logoutURL;
            });
        });
        this.getSession();
    }
    )
}
