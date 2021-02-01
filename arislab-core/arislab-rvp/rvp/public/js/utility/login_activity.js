function loginActivity() {
  return {
    onToggleForgotPassword: function () {
      $("#forgot-password").removeClass("hidden");
      $("#login").addClass("hidden");
    },

    onToggleBackToLoginFromForgotPassword: function () {
      $("#login").removeClass("hidden");
      $("#forgot-password").addClass("hidden");
      $("#send-email-complete").addClass("hidden");
    },

    onSendEmailClick: function (email) {
      $.ajax({
        url: "/reset-password/send",
        type: "POST",
        data: {
          email: email,
        },
        dataType: "json",
        success: function (data) {
          $(".text-email").text(email);
          $("#reset-email").val("");
          $("#send-email-complete").removeClass("hidden");
          $("#forgot-password").addClass("hidden");
          loading(false);
        },
        error: function (error) {
          alert(error.message);
        },
      });
    },
  };
}
