//definicion de la aplicación
//requerimientos externos
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//rutas
//var index = require('./routes/index');
var app = express();
var soap = require('strong-soap').soap;

var dateFormat = require('dateformat');
var formidable = require("formidable");
var uuid = require('uuid');
var config = require('./config.json');
var url = config.rapiUrlWsdl;
var emailModule = require('./mail');

var Recaptcha = require('recaptcha-verify');
var recaptcha = new Recaptcha({
  secret: config.google.secret,
  verbose: true
});
const fs = require('fs')
// view engine setup - para la web api no vamos a utilizar views
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
//registro las rutas al app
//app.use('/', index);
//al ser pocas operaciones no vale la pena armar una arquitectura mas grande
//(con route, controllers, etc), se dejan los metodos aca

app.get('/api/publicKey', (req, res) => {
  res.json({ key: config.google.public })
});

app.get('/api/montoCuota', (req, res) => {
  var cuotas = req.query.cuotas;
  var importe = req.query.importe;
  var vencimiento = new Date();
  vencimiento.setMonth(vencimiento.getMonth() + 1);

  vencimiento = dateFormat(vencimiento, 'yyyymmdd');
  //fijo segun documentacion
  var asistencia = 0;
  var idTasa = getIdTasa(importe, cuotas);
  console.log("vencimiento => ", vencimiento);
  console.log("idTasa => ", idTasa);

  var args = {
    asistencia: asistencia,
    cuotas: cuotas,
    idTasa: idTasa,
    importe: importe,
    vencimientoPrimerCuota: vencimiento
  }

  var options = {}
  soap.createClient(url, options, function (err, client) {
    var method = client['generarMontoCuota'];
    method(args, (err, result, envelope, soapHeader) => {
      console.log('Response Envelope => ', envelope);
      var response = JSON.parse(result.return);
      console.log('Response body => ', response);
      //importeCuota representa el importe a cobrar por cuota en base a la respuesta del wsdl
      res.json({
        importeCuota: response.importeCuota
      });
    })
  });
});
app.post('/api/altaPrestamo', (req, res) => {

  var form = new formidable.IncomingForm();
  var id = uuid.v4()
  form.parse(req);

  form.on('fileBegin', function (name, file) {
    console.log("FileUploading")
    file.path = __dirname + '/altaPrestamoFiles/' + id + file.name;
  });

  form.on('file', function (name, file) {
    console.log('Uploaded altaPrestamo' + id + file.name);
    res.json({ id: id + file.name });
  });

});
app.post('/api/altaPrestamo2', (req, res) => {
  console.log(req.body);
  var tipoPrestamo = 2;
  var nombre = req.body.name;
  var apellido = req.body.surname;
  var email = req.body.email;
  var clearing = req.body.loanClearing;
  var cuotas = req.body.cuotas;
  var monto = req.body.monto;
  var ingresos = req.body.ingresos;
  var department = req.body.department;
  var ci = req.body.ci;
  var id = req.body.id;
  var phone = req.body.phone;
  console.log(`Alta prestamo: nombre => ${nombre}
                               apellido => ${apellido}
                               email => ${email}
                               clearing => ${clearing}
                               cuotas => ${cuotas}
                               monto => ${monto}
                               ingresos => ${ingresos}
                               departamento => ${department}
                               ci => ${ci}
                               telefono => ${phone}`)

  var captcha = req.body.captcha
  // recaptcha.checkResponse(captcha, function (error, response) {
  //   if (error) {
  //     // an internal error?
  //     res.status(400).render('400', {
  //       message: error.toString()
  //     });
  //     return;
  //   }
  // if (response.success) {
  console.log("id:", id);
  var data = fs.readFileSync(__dirname + '/altaPrestamoFiles/' + id, 'base64');

  var args = {
    tipoPrestamo: tipoPrestamo,
    nombre: nombre,
    apellido: apellido,
    emial: email,
    clearing: clearing,
    cuotas: cuotas,
    montoPrestamo: monto,
    ingresos: ingresos,
    canal: 'WEB',
    idDepartamento: department,
    imagen: data.toString('base64'),
    documento: ci,
    telefono: phone
  }
  console.log("ARGS2")
  soap.createClient(url, {}, function (err, client) {
    var method = client['altaPreSolicitudProspecto'];
    method(args, (err, result, envelope, soapHeader) => {
      console.log('Response Envelope => ', envelope);
      var response = JSON.parse(result.return);
      console.log('Response body => ', response);
      try {
        fs.unlinkSync(__dirname + '/altaPrestamoFiles/' + id);
      } catch (err) {
        console.log(err);
      }
      if (response.codigo_retorno != 0) {
        res.status(500).end();
      } else {
        res.json({

        });
      }
    });
  })

  // save session.. create user.. save form data.. render page, return json.. etc.
  // } else {
  //   res.status(500).end();
  //   // show warning, render page, return a json, etc.
  // }
  // });

})
app.get('/terminos_y_condiciones', (req, res) => {

  res.sendFile(path.join(__dirname, 'public/terminos_condiciones.pdf'));

});

app.post('/api/workWithUs', (req, res) => {

  var form = new formidable.IncomingForm();
  var id = uuid.v4()
  form.parse(req);

  form.on('fileBegin', function (name, file) {
    file.path = __dirname + '/cvFiles/' + id + file.name;
  });

  form.on('file', function (name, file) {
    console.log('Uploaded ' + id + file.name);
    res.json({ id: id + file.name });
  });

});

app.post('/api/workWithUs2', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var celular = req.body.celular;
  var domicilio = req.body.domicilio;
  var id = req.body.id;
  var fileName = req.body.fileName
  var captcha = req.body.captcha
  recaptcha.checkResponse(captcha, function (error, response) {
    if (error) {
      // an internal error?
      res.status(400).render('400', {
        message: error.toString()
      });
      return;
    }
    if (response.success) {
      emailModule.sendEmail(config.mail.host, config.mail.port, config.mail.secure,
        config.mail.auth.user, config.mail.auth.pass, config.mail.to, config.mail.subject,
        `Nueva solicitud de trabajo: <br>
        <b>Nombre: </b> ${name} <br> 
        <b>Email:</b> ${email} <br>
        <b>Telefono:</b> ${phone} <br>
        <b>Celular:</b> ${celular} <br>
        <b>Domicilio:</b> ${domicilio}`, fileName, __dirname + '/cvFiles/' + id
      );
      // save session.. create user.. save form data.. render page, return json.. etc.
    } else {
      res.status(200).send('the user is a ROBOT :(');
      // show warning, render page, return a json, etc.
    }
  });

});


app.post('/api/crediNegocio', (req, res) => {

  var form = new formidable.IncomingForm();
  var id = uuid.v4()
  form.parse(req);

  form.on('fileBegin', function (name, file) {
    file.path = __dirname + '/crediNegocioFiles/' + id + file.name;
  });

  form.on('file', function (name, file) {
    console.log('Uploaded crediNegocio' + id + file.name);
    res.json({ id: id + file.name });
  });

});

app.post('/api/crediNegocio2', (req, res) => {
  var nombre = req.body.name;
  var apellido = req.body.surname;
  var email = req.body.email;
  var telefono = req.body.phone;
  var monto = req.body.monto;
  var ingresos = req.body.ingresos;
  var department = req.body.department;
  var fileName = req.body.fileName;
  var id = req.body.id;
  var tipoPrestamo = 3;
  var ci = req.body.ci;
  var observacion = req.body.observacion;
  console.log(`Alta prestamoCrediNegocio: nombre => ${nombre}
                               apellido => ${apellido}
                               email => ${email}
                               telefono => ${telefono}
                               monto => ${monto}
                               ingresos => ${ingresos}
                               departamento => ${department}
                               fileName => ${fileName}
                               id => ${id}
                               ci => ${ci}
                               observacion =>  ${observacion}`)
  var data = fs.readFileSync(__dirname + '/crediNegocioFiles/' + id, 'base64');

  var args = {
    tipoPrestamo: tipoPrestamo,
    nombre: nombre,
    apellido: apellido,
    documento: ci,
    emial: email,
    telefono: telefono,
    montoPrestamo: monto,
    ingresos: ingresos,
    canal: 'WEB',
    idDepartamento: department,
    imagen: data,
    observacion: observacion,
    cuotas: 1
  }
  console.log("TEST");
  soap.createClient(url, {}, function (err, client) {
    var method = client['altaPreSolicitudProspecto'];
    method(args, (err, result, envelope, soapHeader) => {
      console.log('Response Envelope => ', envelope);
      var response = JSON.parse(result.return);
      console.log('Response body => ', response);
      try {
        fs.unlinkSync(__dirname + '/crediNegocioFiles/' + id);
      } catch (err) {
        console.log(err);
      }
      if (response.codigo_retorno != 0) {
        res.status(500).end();
      } else {
        res.json({

        });
      }

    })
  });

});

app.use('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("Error => ", err);
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err })
});

function getIdTasa(importe, cuotas) {
  console.log("importe => ", importe);
  console.log("cuotas => ", cuotas);
  if (importe >= 6000 && importe <= 35000 && cuotas <= 12)
    return 214
  else if (importe > 35001 && cuotas <= 12)
    return 215
  else if (importe >= 6000 && importe <= 35000 && cuotas > 12)
    return 216
  else if (importe > 35001 && cuotas > 12)
    return 217
  else
    throw new Error("tasa indefinida");
}

module.exports = app;
