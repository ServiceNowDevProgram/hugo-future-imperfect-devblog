usermenu = {}; 
usermenu.init = function(properties) {
    $(document).ready(function() {

        $('.current-user').click(function(e) {
            e.stopPropagation();
            var menu = $('.user-menu ul'); 
            menu.toggleClass('menu-hidden');

            $('body').on('click', function() {
                menu.attr('class', 'menu-hidden');
            });
        });
        

        $('.logout').click(function() {
            $.get('/logout.do', function(response) {
                var logoutURL = properties.okta + '/login/signout?fromURI='; 
                logoutURL += window.location; 
                window.location.href = logoutURL; 
            }); 
        });
        
        this.getSession = function(token) {
            if (token == "") {
                try {
                    token = window.localStorage.getItem('X-UserToken');
                } catch (e){
                    console.log("Error: "+e);
                }
            }

            $.ajax('https://devportaldev.service-now.com/devportal.do?sysparm_data=\{%22action%22:%22dev.user.session%22,%22data%22:\{\}\}', {
                headers: {'X-UserToken': token},
                401: this.getSessionHandler401,
                200: this.getSessionHandler200
            });


        };

        this.getSessionHandler200 = function(response) {
            var displayName = response.display_name; 
            if (displayName == 'Guest') {
                $('.current-user').hide();
                $('.login').each(function() {
                    $(this).removeClass('menu-hidden');
                });
                $("#comment-button").prop("disabled",true);
            } else {
                $('.current-user').html(displayName);
                $("#comment-button").prop("disabled",false);
            }
        };

        this.getSessionHandler401 = function(response) {
            var headers = response.headers; 
            var token = headers.X-UserToken-Response;
            try {
                window.localStorage.setItem('X-UserToken', token);
            } catch {
            }
            this.getSession(token);
        };

        this.getSession();

/*        $.get('/getSession.do', function(response) {
            var displayName = response.display_name; 
            if (displayName == 'Guest') {
                $('.current-user').hide();
                $('.login').each(function() {
                    $(this).removeClass('menu-hidden');
                });
                $("#comment-button").prop("disabled",true);
            } else {
                $('.current-user').html(displayName);
                $("#comment-button").prop("disabled",false);
            }            
        }); 
*/

    });
}; 