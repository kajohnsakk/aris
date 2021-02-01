/*
 *  Document   : login.js
 *  Author     : pixelcave
 *  Description: Custom javascript code used in Login page
 */

var Login = function () {

    // Function for switching form views (login, reminder and register forms)
    var switchView = function (viewHide, viewShow, viewHash) {
        viewHide.slideUp(250);
        viewShow.slideDown(250, function () {
            $('input').placeholder();
        });

        if (viewHash) {
            window.location = '#' + viewHash;
        } else {
            window.location = '#';
        }
    };

    return {
        init: function () {
            /* Switch Login, Reminder and Register form views */
            var formLogin = $('#form-login'),
                formReminder = $('#form-reminder'),
                formRegister = $('#form-register');

            let urlParams = new URLSearchParams(window.location.search);
            if(urlParams.get('email') && urlParams.get('pwd')){
                $("#login-email").val(urlParams.get('email'));
                $("#login-password").val(urlParams.get('pwd'));
            }

            $('#link-register-login').click(function () {
                switchView(formLogin, formRegister, 'register');
            });

            $('#link-register').click(function () {
                switchView(formRegister, formLogin, '');
            });

            $('#link-reminder-login').click(function () {
                switchView(formLogin, formReminder, 'reminder');
            });

            $('#link-reminder').click(function () {
                switchView(formReminder, formLogin, '');
            });

            // If the link includes the hashtag 'register', show the register form instead of login
            if (window.location.hash === '#register') {
                formLogin.hide();
                formRegister.show();
            }

            // If the link includes the hashtag 'reminder', show the reminder form instead of login
            if (window.location.hash === '#reminder') {
                formLogin.hide();
                formReminder.show();
            }

            /*
             *  Jquery Validation, Check out more examples and documentation at https://github.com/jzaefferer/jquery-validation
             */

            /* Login form - Initialize Validation */
            Login.form = $('#form-login').validate({
                errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function (e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function (e) {
                    e.closest('.form-group').removeClass('has-success has-error');
                    e.closest('.help-block').remove();
                },
                rules: {
                    'login-email': {
                        required: true,
                        email: true
                    },
                    'login-password': {
                        required: true,
                        minlength: 5
                    }
                },
                messages: {
                    'login-email': 'Please enter your account\'s email',
                    'login-password': {
                        required: 'Please provide your password',
                        minlength: 'Your password must be at least 5 characters long'
                    }
                },
                submitHandler: (form, e) => {
                    e.preventDefault();
                    Login.login();
                    return false;
                }
            });

            /* Reminder form - Initialize Validation */
            $('#form-reminder').validate({
                errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function (e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function (e) {
                    e.closest('.form-group').removeClass('has-success has-error');
                    e.closest('.help-block').remove();
                },
                rules: {
                    'reminder-email': {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    'reminder-email': 'Please enter your account\'s email'
                }
            });

            /* Register form - Initialize Validation */
            $('#form-register').validate({
                errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function (e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function (e) {
                    if (e.closest('.form-group').find('.help-block').length === 2) {
                        e.closest('.help-block').remove();
                    } else {
                        e.closest('.form-group').removeClass('has-success has-error');
                        e.closest('.help-block').remove();
                    }
                },
                rules: {
                    'register-firstname': {
                        required: true,
                        minlength: 2
                    },
                    'register-lastname': {
                        required: true,
                        minlength: 2
                    },
                    'register-email': {
                        required: true,
                        email: true
                    },
                    'register-password': {
                        required: true,
                        minlength: 5
                    },
                    'register-password-verify': {
                        required: true,
                        equalTo: '#register-password'
                    },
                    'register-terms': {
                        required: true
                    }
                },
                messages: {
                    'register-firstname': {
                        required: 'Please enter your firstname',
                        minlength: 'Please enter your firstname'
                    },
                    'register-lastname': {
                        required: 'Please enter your lastname',
                        minlength: 'Please enter your lastname'
                    },
                    'register-email': 'Please enter a valid email address',
                    'register-password': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long'
                    },
                    'register-password-verify': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long',
                        equalTo: 'Please enter the same password as above'
                    },
                    'register-terms': {
                        required: 'Please accept the terms!'
                    }
                }
            });
        },
        login: function () {
            const email = $("#login-email").val();
            const pwd = $("#login-password").val();
            const obj = {
                email: email,
                password: pwd
            };
            $("#login-loading").show();
            $("#form-login").hide();
            setTimeout(()=>{

                $.ajax({
                    type: 'POST',
                    url: './login',
                    data: JSON.stringify(obj), // or JSON.stringify ({name: 'jonas'}),
                    complete: function (data) {
                        const respJson = data.responseJSON;
                        console.log('data: ', data);
                        console.log("resojson is ",respJson);
                        if (data.status != 200) {
                            $("#login-loading").hide();
                            $("#form-login").show();
                            Login.form.showErrors({
                                "login-email": " ",
                                "login-password": respJson.message
                            })
                        }
                        else{
                            window.location.href = "/platform"+window.location.hash;
                        }
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },500);
        }
    };
}();

