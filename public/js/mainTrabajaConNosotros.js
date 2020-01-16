$(document).ready(function () {    
    $.ajax(
            {
                url: '/api/publicKey',
                type: 'get',
                success: function (result) {
                    console.log("response => ", result);
                    $("#captcha").html('    <div class="g-recaptcha" data-sitekey="' + result.key + '"></div>')
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    s.src = "https://www.google.com/recaptcha/api.js";
                    // Use any selector
                    $("head").append(s);
                }
            });
    var modalSuccess = document.getElementById("modalSuccess");

// Get the <span> element that closes the modal
    var spanSuccess = document.getElementsByClassName("close")[0];
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    $("#btnWorkWithUs").click(function (e) {

        var name = $("#nameWorkWithUs").val();
        var email = $("#emailWorkWithUs").val();
        var domicilio = $("#domicilioWorkWithUs").val();
        var phone = $("#telefonoWorkWithUs").val();
        var celular = $("#celularWorkWithUs").val();
        var valid = true;
        var captcha = grecaptcha.getResponse();
        console.log("captcha => ", captcha);

        if (!captcha) {
            $("#lblCaptchaRequired").removeClass('hideCaptchaRequired');
            valid = false;
        } else {
            $("#lblCaptchaRequired").addClass('hideCaptchaRequired');
        }

        if (!name) {
            $("#nameWorkWithUs").addClass('required');
            valid = false;
        } else {
            $("#nameWorkWithUs").removeClass('required');
        }
        if (!email) {
            $("#emailWorkWithUs").addClass('required');
            valid = false;
        } else {
            $("#emailWorkWithUs").removeClass('required');
        }
        if (!domicilio) {
            $("#domicilioWorkWithUs").addClass('required');
            valid = false;
        } else {
            $("#domicilioWorkWithUs").removeClass('required');
        }
        if (!phone) {
            $("#telefonoWorkWithUs").addClass('required');
            valid = false;
        } else {
            $("#telefonoWorkWithUs").removeClass('required');

        }
        if (!celular) {
            $("#celularWorkWithUs").addClass('required');
            valid = false;
        } else {
            $("#celularWorkWithUs").removeClass('required');
        }
        var data = new FormData();
        jQuery.each(jQuery('#cvFile')[0].files, function (i, file) {
            data.append('file-' + i, file);
        });
        console.log("files", jQuery('#cvFile')[0].files)
        if (valid) {
            var args = {
                name: name,
                email: email,
                phone: phone,
                celular: celular,
                domicilio: domicilio,
                fileName: jQuery('#cvFile')[0].files.name,
                captcha: captcha
            }
            $.ajax(
                    {
                        url: '/api/workWithUs',
                        type: 'post',
                        data: data,
                        contentType: false,
                        processData: false,
                        success: function (result) {
                            console.log("response => ", result);
                            args.id = result.id;
                            $.ajax({
                                url: '/api/workWithUs2',
                                type: 'post',
                                data: args,
                                success: function (result2) {
                                    console.log("response2 => ", result2);

                                },
                                error: function (err) {
                                    console.log(err);
                                    $("#textResultTitle").text("Error al ingresar solicitud!.");
                                    $("#textResultBody").text("Por favor, intente nuevamente. En caso de que persista el error contactarnos");
                                    spanSuccess.click();
                                    modalSuccess.style.display = "block";
                                }
                            })
                            $("#textResultTitle").text("Presolicitud ingresada con éxito!.");
                            $("#textResultBody").text("Nuestros operadores se estarán contactando.");
                            spanSuccess.click();
                            modalSuccess.style.display = "block";
                        },
                        error: function (err) {
                            console.log(err);
                            $("#textResultTitle").text("Error al ingresar solicitud!.");
                            $("#textResultBody").text("Por favor, intente nuevamente. En caso de que persista el error contactarnos");
                            spanSuccess.click();
                            modalSuccess.style.display = "block";
                        }
                    })
        }
    });
    spanSuccess.onclick = function () {
        modalSuccess.style.display = "none";
        $("#nameWorkWithUs").val("");
        $("#emailWorkWithUs").val("");
        $("#domicilioWorkWithUs").val("");
        $("#telefonoWorkWithUs").val("");
        $("#celularWorkWithUs").val("");
        $('#cvFile').val('').clone(true);
        $('label[for="cvFile"]').removeClass("selected").html("");
        grecaptcha.reset();
    }
});