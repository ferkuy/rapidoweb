var contador = 0;
$(document).ready(function () {

    // Parallax de squares
    if ($(window).width() > 992) {
        $('.bg-square').each(function () {
            var maxParallax = 0.25;
            var factorMax = $(this).data('scroll-direction') === 'up' ? maxParallax : -maxParallax;
            var factorRand = Math.random() * factorMax;
            //console.log(factorRand);

            $(this).paroller({
                factor: factorRand,
                type: 'foreground',
                direction: 'vertical',
                transition: 'all 0s linear'
            });
        });
    }

    /*Inicio comportamiento Modal*/

    $(".aCrediNegocio").click(function (e) {
        $("#modalCrediNegocio").modal('show');
    })

    $("#closeCrediNegocio").click(function (e) {
        $("#modalCrediNegocio").modal('hide');
    });
    $("#myBtn").click(function (e) {
        $("#myModal").modal('show');
        $("#creditName").val("");
        $("#creditSurname").val("");
        $("#creditEmail").val("");
        $("#creditPhone").val("");
        $("#bImporteCuota").text("Calculando...");
        var monto = $('#monto').val();
        var cuotas = $('#cuotas').val();
        console.log("cuotas => ", cuotas);
        console.log("monto => ", monto);
        $.ajax(
            {
                url: '/api/montoCuota',
                type: 'get',
                data: {
                    cuotas: cuotas,
                    importe: monto
                },
                success: function (result) {
                    console.log("response => ", result);
                    $("#bImporteCuota").text("$" + result.importeCuota);
                }
            })
    });

    $("#closeModal").click(function (e) {
        $("#myModal").modal('hide');
    });

    $("#closeModalSuccess").click(function (e) {
        $("#modalSuccess").modal('hide');
    });

    /*Fin comportamiento Modal*/


    $.ajax(
        {
            url: '/api/publicKey',
            type: 'get',
            success: function (result) {
                console.log("response => ", result);
                $("#captcha").html('    <div class="g-recaptcha" data-sitekey="' + result.key + '"></div>');
                // $("#captchaCrediNegocio").html('    <div class="g-recaptcha" data-sitekey="' + result.key + '"></div>')
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = "https://www.google.com/recaptcha/api.js";
                // Use any selector
                $("head").append(s);
            }
        });
    // Contact info Lotie bg animations
    var bgAnimBoxes1 = document.getElementById('bgAnimBoxes1');
    var bgAnimBoxes2 = document.getElementById('bgAnimBoxes2');

    // Lottie bg Boxes 1
    lottie.loadAnimation({
        container: bgAnimBoxes1, // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'lottie/bg-boxes.json' // the path to the animation json
    });

    // Lottie bg Boxes 2
    lottie.loadAnimation({
        container: bgAnimBoxes2, // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'lottie/bg-boxes.json' // the path to the animation json
    });

    $("#bMonto").text("$" + numberSeparator($("#monto").val()));
    $("#bCuotas").text($("#cuotas").val());

    $("#bMontoModal").text("$" + numberSeparator($("#monto").val()));
    $("#bCuotasModal").text($("#cuotas").val());
    // Get the modal

    var modalSuccess = document.getElementById("modalSuccess");
    //    var modalCrediNegocio = document.getElementById("modalCrediNegocio");
    //modalCrediNegocio.style.display = "block";
    // Get the <span> element that closes the modal

    $('#creditDepartment').val(1);
    $("#btnLoadAmount").click(function (e) {
        var monto = $('#monto').val();
        var cuotas = $('#cuotas').val();
        $.ajax(
            {
                url: '/api/montoCuota',
                type: 'get',
                data: {
                    cuotas: cuotas,
                    importe: monto
                },
                success: function (result) {
                    console.log("response => ", result);
                    $("#montoForm").text("$" + result.importeCuota);
                }
            })
    });

    $("#btnCreditRequest").click(function (e) {
        var name = $("#creditName").val();
        var surname = $("#creditSurname").val();
        var email = $("#creditEmail").val();
        var phone = $("#creditPhone").val();
        var terms_and_conditions = $("#terms_and_conditions").prop('checked');
        var loan_clearing = $("input[name=loan_clearing]:checked", "#frmCreditRequest").val();
        var ingresos = $("#ingresos").val();
        var department = $("#crediDepartment").val();
        var ci = $("#creditCI").val();
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
            $("#creditName").addClass('required');
            valid = false;
        } else {
            $("#creditName").removeClass('required');
        }
        if (!ci) {
            $("#creditCI").addClass('required');
            valid = false;
        } else {
            $("#creditCI").removeClass('required');
        }
        if (!ingresos) {
            $("#ingresos").addClass('required');
            valid = false;
        } else {
            $("#ingresos").removeClass('required');
        }
        if (!loan_clearing) {
            $("#pLoanClearing").addClass('required');
            valid = false;
        } else {
            $("#pLoanClearing").removeClass('required');
        }
        if (!terms_and_conditions) {
            $("#pTermsAndConditions").addClass('required');
            valid = false;
        } else {
            $("#pTermsAndConditions").removeClass('required');
        }
        if (!surname) {
            $("#creditSurname").addClass('required');
            valid = false;
        } else {
            $("#creditSurname").removeClass('required');

        }
        if (!email) {
            $("#creditEmail").addClass('required');
            valid = false;
        } else {
            $("#creditEmail").removeClass('required');

        }
        if (!phone) {
            $("#creditPhone").addClass('required');
            valid = false;
        } else {
            $("#creditPhone").removeClass('required');

        }
        if (valid) {
            console.log("terms_and_conditions", terms_and_conditions);
            if (!terms_and_conditions) {
                alert("requerir terminos y condiciones");
            } else {
                var data = new FormData();
                //-
                console.log("Data", data);
                var monto = $('#monto').val();
                var cuotas = $('#cuotas').val();
                var args = {
                    name: name,
                    surname: surname,
                    email: email,
                    loanClearing: loan_clearing,
                    cuotas: cuotas,
                    monto: monto,
                    ingresos: ingresos,
                    department: department,
                    captcha: captcha,
                    ci: ci,
                    phone : phone

                }

                console.log("args => ", args);
                // $.ajax(
                //     {
                //         url: '/api/altaPrestamo',
                //         type: 'post',
                //         data: data,
                //         contentType: false,
                //         processData: false,
                //         success: function (result) {
                //             console.log("result =>", result);
                //             args.id = result.id;
                            $.ajax(
                                {
                                    url: '/api/altaPrestamo2',
                                    type: 'post',
                                    data: args,
                                    success: function (result2) {
                                        console.log("response => ", result2);
                                        $("#textResultTitle").addClass('alert-success').text("Presolicitud ingresada con éxito!");
                                        $("#textResultBody").text("Nuestros operadores se estarán contactando.");
                                        $("#modalSuccess").modal('show');
                                    },
                                    error: function (err) {
                                        console.log(err);
                                        $("#textResultTitle").addClass('alert-danger').text("Error al procesar la solicitud!");
                                        $("#textResultBody").text("Por favor, intente nuevamente. En caso de que persista el error contactarnos.");
                                        $("#modalSuccess").modal('show');
                                    }
                                })
                    //     },
                    //     error: function (err) {
                    //         console.log(err);
                    //         $("#textResultTitle").addClass('alert-danger').text("Error al ingresar solicitud!");
                    //         $("#textResultBody").text("Por favor, intente nuevamente. En caso de que persista el error contactarnos");
                    //         $("#modalSuccess").modal('show');
                    //     }

                    // });
            }
        }

    });
    // When the user clicks on <span> (x), close the modal

    // When the user clicks anywhere outside of the modal, close it
    $(window).scroll(function () {
        var doc = document.documentElement;
        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        var nosotrosPosition = $("#nosotros").position();
        if (top > nosotrosPosition.top && contador == 0) {
            contador++;
            $('.countera').each(function () {
                var $this = $(this);
                jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
                    duration: 1000,
                    easing: 'swing',
                    step: function () {
                        $this.text(Math.ceil(this.Counter));
                    }
                });
            });
        }
        if (top < nosotrosPosition.top) {
            contador = 0;
        }
    });

    $("#nosotros").click(function () {
        console.log("Ola k ase");
    });

    function numberSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    $("#btnCrediNegocioRequest").click(function (e) {
        var name = $("#crediNegocioName").val();
        var surname = $("#crediNegocioSurname").val();
        var email = $("#crediNegocioEmail").val();
        var phone = $("#creditNegocioPhone").val();
        var text = $("#crediNegocioTexto").val();
        var ingresos = $("#crediNegocioIngresos").val();
        var department = $("#crediNegocioDepartment").val();
        var ci = $("#crediNegocioCI").val();
        var valid = true;
        // var captcha = grecaptcha.getResponse();
        // console.log("captcha => ", captcha);

        // if (!captcha) {
        //     $("#lblCaptchaCrediNegocioRequired").removeClass('hideCaptchaRequired');
        //     valid = false;
        // } else {
        //     $("#lblCaptchaCrediNegocioRequired").addClass('hideCaptchaRequired');
        // }
        if (!name) {
            $("#crediNegocioName").addClass('required');
            valid = false;
        } else {
            $("#crediNegocioName").removeClass('required');
        }
        if (!ci) {
            $("#crediNegocioCI").addClass('required');
            valid = false;
        } else {
            $("#crediNegocioCI").removeClass('required');
        }
        if (!ingresos) {
            $("#crediNegocioIngresos").addClass('required');
            valid = false;
        } else {
            $("#crediNegocioIngresos").removeClass('required');
        }
        if (!surname) {
            $("#crediNegocioSurname").addClass('required');
            valid = false;
        } else {
            $("#crediNegocioSurname").removeClass('required');

        }
        if (!email) {
            $("#crediNegocioEmail").addClass('required');
            valid = false;
        } else {
            $("#crediNegocioEmail").removeClass('required');

        }
        if (!phone) {
            $("#creditNegocioPhone").addClass('required');
            valid = false;
        } else {
            $("#creditNegocioPhone").removeClass('required');

        }
        if (!department) {
            $("#crediNegocioDepartment").addClass('required');
            valid = false;
        } else {
            $("#crediNegocioDepartment").removeClass('required');

        }

        if (valid) {
            var data = new FormData();
            jQuery.each(jQuery('#crediNegocioFile')[0].files, function (i, file) {
                data.append('file-' + i, file);
            });
            console.log("files", jQuery('#crediNegocioFile')[0].files);
            $.ajax(
                {
                    url: '/api/crediNegocio',
                    type: 'post',
                    data: data,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        var args = {
                            name: name,
                            surname: surname,
                            email: email,
                            phone: phone,
                            monto: $("#crediNegocioMonto").val(),
                            ingresos: ingresos,
                            department: department,
                            fileName: jQuery('#crediNegocioFile')[0].files.name,
                            observacion : $("#crediNegocioTexto").val(),
                            ci : ci
                        }
                        console.log("response => ", result);
                        args.id = result.id;
                        $.ajax({
                            url: '/api/crediNegocio2',
                            type: 'post',
                            data: args,
                            success: function (result2) {
                                console.log("response2 => ", result2);

                            },
                            error: function (err) {
                                console.log(err);
                                $("#textResultTitle").text("Error al ingresar solicitud!");
                                $("#textResultBody").text("Por favor, intente nuevamente. En caso de que persista el error contactarnos");
                                $("#modalSuccess").modal('show');
                            }
                        })
                        $("#textResultTitle").text("Presolicitud ingresada con éxito!");
                        $("#textResultBody").text("Nuestros operadores se estarán contactando.");
                        $("#modalSuccess").modal('show');
                    },
                    error: function (err) {
                        console.log(err);
                        $("#textResultTitle").text("Error al ingresar solicitud!");
                        $("#textResultBody").text("Por favor, intente nuevamente. En caso de que persista el error contactarnos");
                        $("#modalSuccess").modal('show');
                    }
                })
        }

    })

    $("#btnLoadAmount").click();
});

$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

