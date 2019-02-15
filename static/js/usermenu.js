usermenu = {};

usermenu.handleLoginStatus = function (response) {
    var displayName = response.display_name; 
    var sessionID = response.session_id;
    if (sessionID != "SYSTEM") {
        usermenu.session_id = sessionID;
        window.localStorage.setItem('SessionID', sessionID);                   
//        console.log("Set usermenu.session_id to " + sessionID);
    }

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
//            console.log("Entering getSession with token=" + token);
            if (token == undefined || token == "") {
//                console.log("No token");
                try {
                    token = window.localStorage.getItem('X-UserToken');
//                    console.log("Retrieved from local storage token: " + token);
                } catch (e) {
                    console.log("Error: " + e);
                }
            } else {
  //              console.log("Token exists and is " + token);
            }

            var headers = {};

            if (token == undefined || token == "") {
//                console.log("No user token");
            } else {
                headers = { 'X-UserToken': token };
//                console.log("adding X-UserToken to ajax call: " + token);
            }

            $.ajax('devportal.do?sysparm_data=\{%22action%22:%22dev.user.session%22,%22data%22:\{\}\}', {
                headers: headers,
        
            })
                .done(function (data, textStatus, jqXHR) {
                    //console.log("Success handler: " + JSON.stringify(data) + " " + textStatus);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
//                    console.log("Error handler: " + textStatus + " " + errorThrown);
                })
                .always(function (response, textStatus, jqXHR) { //;paf; see http://stackoverflow.com/a/19498463/2914328
//                    console.log("jQuery version: " + $.fn.jquery);
//                    console.log("arg1:", response);
//                    console.log("arg2:", textStatus);
//                    console.log("arg3:", jqXHR);
                    var responseToken = jqXHR.getResponseHeader('X-UserToken') ||jqXHR.getResponseHeader('X-UserToken-Response') ;
//                    console.log("X-UserToken = " + responseToken);
                    if (token != responseToken) {
                        // If we come here, we are getting a new token
                        window.localStorage.setItem('X-UserToken', responseToken);
//                        console.log("Set X-UserToken in local storage to " + responseToken);
                    }
//                    console.log("this =  " +JSON.stringify(this));
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
  //      console.log("In main thread, right before calling getSession()");
        this.getSession();
    }
    )
}