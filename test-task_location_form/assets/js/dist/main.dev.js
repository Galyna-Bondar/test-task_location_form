"use strict";

var detectCityLocation = function detectCityLocation() {
  var city = document.querySelector('.input_city');
  var error_placeholder = document.querySelector('.error_placeholder');

  var success = function success(position) {
    console.log(position);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude + " " + longitude);
    var geoApiUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=".concat(latitude, "&longitude=").concat(longitude, "&localityLanguage=en");
    fetch(geoApiUrl).then(function (res) {
      return res.json();
    }).then(function (data) {
      var principalSubdivision = data.principalSubdivision;
      var translationApiUrl = "https://api.mymemory.translated.net/get?q=".concat(principalSubdivision, "&langpair=en|uk");
      fetch(translationApiUrl).then(function (res) {
        return res.json();
      }).then(function (data) {
        var translatedText = data.responseData.translatedText;
        city.value = translatedText; //city.value = data.principalSubdivision;
      });
    });
  };

  var error = function error() {
    error_placeholder.textContent = "!Неможливо визначити вашу геолокацію";
    error_placeholder.style.backgroundColor = "rgb(237, 135, 9)";
    setTimeout(function () {
      error_placeholder.textContent = "";
      error_placeholder.style.backgroundColor = "";
    }, 1500);
  };

  navigator.geolocation.getCurrentPosition(success, error);
};

document.querySelector(".input_city").addEventListener('click', detectCityLocation); //Валідація щодо заборонених символів та цифр

var forbiddenChars = /[!@#$%^&*()_+={}|[\]\\:;'\"<>?/]/;
var digits = /[0-9]/;
var cityInput = document.getElementById('city');
var addressInput = document.getElementById('address');
cityInput.addEventListener('input', function () {
  if (forbiddenChars.test(cityInput.value)) {
    cityInput.setCustomValidity('Місто містить заборонені символи!');
  } else if (digits.test(cityInput.value)) {
    cityInput.setCustomValidity('Місто не може містити цифри!');
  } else {
    cityInput.setCustomValidity('');
  }
});
addressInput.addEventListener('input', function () {
  if (forbiddenChars.test(addressInput.value)) {
    addressInput.setCustomValidity('Адреса містить заборонені символи!');
  } else {
    addressInput.setCustomValidity('');
  }
}); //Валідація та ВІДПРАВКА НА ІМЕЙЛ

function SendMail() {
  var city = document.getElementById("city").value;
  var address = document.getElementById("address").value;

  if (city == "" || address == "") {
    cityInput.setCustomValidity("Будь ласка, заповніть всі поля");
    return false;
  }

  if (forbiddenChars.test(city) || digits.test(city) || forbiddenChars.test(address)) {
    alert("Поля містять заборонені символи або цифри!");
    return false;
  }

  var params = {
    city: city,
    address: address
  };
  form.classList.add('sending');
  emailjs.send("service_p0xvfqj", "template_hoi39le", params).then(function (res) {
    if (res.status === 200) {
      alert("Ваше повідомлення було відправлене на email! Статус " + res.status);
      form.reset();
      form.classList.remove("sending");
    } else {
      alert("Помилка відправки");
      form.classList.remove("sending");
    }
  });
} // Відправка у мій TELEGRAM


$("#form").on('submit', function (e) {
  e.preventDefault();
  var BOT_TOKEN = '5040909885:AAGtPX_nug8vv5yK6dfzQ5G03PyJ6QVOu7g';
  var CHAT_ID = '-1001513438907';
  var text = encodeURI("<b>City:</b> " + $("#city").val() + "\n<b>Address:</b> " + $("#address").val());
  $.get("https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage?chat_id=").concat(CHAT_ID, "&text=").concat(text, "&parse_mode=html"), function (json) {
    if (json.ok) {
      $("#form").trigger('reset');
      alert("Відправлено у мій телеграм!!!");
    } else {
      alert(json.description);
    }
  });
}); // Не звертайте увагу! це я для себе залишила для подальшого опрацювання
//Відправка через PHPMailer, потребує доопрацювання (не встигла за часом, але залишаю собі закоментований, щоб закічнити все сама)
// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById("form");
//     form.addEventListener("submit", formSend);
//     async function formSend(e) {
//         e.preventDefault();
//        // let error = formValidate(form);
//         let formData = new FormData(form);
//         if (formData) {
//         form.classList.add('sending');
//         let response = await fetch("sendmail.php", {
//             method: 'POST',
//             body: formData
//         });
//         if (response.ok){
//             let result = await response.json();
//             alert(result.message);
//             form.reset();
//             form.classList.remove("sending");
//         } else {
//             alert("Помилка відправки");
//             form.classList.remove("sending");
//         }
//     } else {
//         alert ("Заповніть поля");
//     }
//     }
// function formValidate(form) {
//     let error = 0;
//     let formReq = document.querySelectorAll('.req');
//     for (let index = 0; index < formReq.length; index++) {
//         const input = formReq[index];
//         formRemoveError(input);
//         if (input.value === "") {
//             formAddError(input);
//             error++;
//         }
//     }
// }
//     function formAddError(input) {
//         input.parentElement.classList.add('_error');
//         input.classList.add("_error");
//     }
//     function formRemoveError(input) {
//         input.parentElement.classList.remove('_error');
//         input.classList.remove("_error");
//     }
// });