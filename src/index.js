import 'bootstrap';
import './main.scss';

const form = document.querySelector('#appForm');
const inputs = document.querySelectorAll("input:not([type='checkbox']), select");

function checkInput(inputs) {
    [...inputs].forEach(function (el) {
        
        if ($(el).attr('id') == 'idCard') {
            el.addEventListener('click', function () {
                this.addEventListener('change', function () {
                    if (this.checkValidity()) {
                        showAccept($(".file-upload-button"));
                        $('#fileName').text(this.files[0].name);
                    }
                                        
                })
                showWarning($(".file-upload-button"));
            })
        }

        else if ($(el).attr('type') == 'radio') {
            el.addEventListener('click', function () {
                
                showAccept($(this).parent().parent());

            })
        }

        else {



            el.addEventListener('blur', function () {

                if ($(this).attr('id') == 'start') {
                    $('#end').attr('min', $(this).val());
                    if ($('#end').val() < $(this).val()) {
                        $(this).attr('max', $('#end').val())
                    }
                }

                if ($(this).attr('id') == 'end') {
                    $('#start').attr('max', $(this).val());
                    if ($('#start').val() > $(this).val()) {
                        $(this).attr('min', $('#start').val())
                    }
                }



                if (!this.checkValidity()) {

                    if ($(this).val() < $(this).attr('min')) {
                        showWarning(this, $(this).next().data('warning2'));
                        return;
                    }

                    showWarning(this);
                }

                else {
                    showAccept(this);
                }
            })
        }

    })
}



function showAccept(input) {
    const acceptText = $(input).next().data('accept');
    $(input).removeClass('warning').addClass('valid');
    $(input).next().text(acceptText).removeClass('warning');
}

function showWarning(input, text) {
    $(input).removeClass('valid').addClass('warning');
    let warningText;
    if (text) {
        warningText = text;
    }
    else {
        warningText = $(input).next().data('warning');
    }
    $(input).next().text(warningText).addClass('warning');
    return false;
}




const setDates = {
    today: function () { return new Date(); },
    year: function () { return this.today().getFullYear() },
    month: function () { return (this.today().getMonth() + 1).toString().length == 1 ? `0${this.today().getMonth() + 1}` : this.today().getMonth() + 1 },
    day: function () {
        return (this.today().getDate()).toString().length == 1 ? `0${this.today().getDate()}` : this.today().getDate()
    },

    setMaxBirthDateAdult: function () {
        return (this.year() - 18) + '-' + this.month() + '-' + this.day();
    },

    setMinDate: function () {
        const startDate = this.today();
        startDate.setDate(startDate.getDate() + 7);
        const startYear = startDate.getFullYear();
        const startMonth = (startDate.getMonth() + 1).toString().length == 1 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1;
        const startDay = (startDate.getDate()).toString().length == 1 ? `0${startDate.getDate()}` : startDate.getDate();
        return startYear + '-' + startMonth + '-' + startDay;
    },

    setMaxDate: function () {
        const today = this.today();
        const finishYear = today.getFullYear();
        return finishYear + '-12-31';

    }
}


function loadCountriesCodes() {
    fetch('https://restcountries.eu/rest/v2/all')
        .then(response => { return response.json() })
        .then(data => data.map(function (el) {
            const option = document.createElement('option');
            option.innerHTML = el.name;
            country.appendChild(option);
        }))
        .catch(error => {
            stopLoading();
            output.innerHTML = `B³¹d: ${error}`;
        }
        )
}



function checkAllFields(inputs) {
    

    let fieldsAreValid = true;

    [...inputs].forEach(el => {

        if (el.checkValidity()) {
            if ($(el).attr('id') == 'idCard') {
                showAccept($(".file-upload-button"));
            }
            else {
                showAccept(el);
            }
        }
        else {
            
            if ($(el).attr('id') == 'idCard') {
                showWarning($(".file-upload-button"));
            }
            else {
                showWarning(el);
            }
            fieldsAreValid = false;
        }
    });

    if ($("input[type='radio']:checked").length == 0) {
        showWarning($('#experience'));
        fieldsAreValid = false;
    }


    return fieldsAreValid;
}

function submitForm() {
    form.addEventListener('submit', (el) => {
        el.preventDefault();
        if (checkAllFields(inputs)) {
            $('#appForm [type=submit]').attr('disabled', true);
            showAccept($('button[type=submit]'));
            const elements = form.querySelectorAll("input[type='text']:not(:disabled), input[type='date']:not(:disabled), input[type='file']:not(:disabled), input[type='tel']:not(:disabled), input[type='email']:not(:disabled), input[type='checkbox']:checked:not(:disabled), input[type='radio']:checked:not(:disabled), select:not(:disabled)");
            const dataToSend = new FormData;
            [...elements].forEach(el => { dataToSend.append(el.name, el.value); });
            sendData(dataToSend);
        }
        else {
            showWarning($('button[type=submit]'));
        }
    })
}

function sendData(data) {
    $('body').append("<div class='loading'></div>");
    
    for (let pair of data.entries()) {
        
        sessionStorage.setItem(pair[0], pair[1]);
    }
    console.log(sessionStorage);
}

$(function () {
    form.reset();

    $('#birthday').attr('max', setDates.setMaxBirthDateAdult());


    $("#start, #end").attr({
        'min': setDates.setMinDate(),
        'max': setDates.setMaxDate()
    });


    loadCountriesCodes();
    checkInput(inputs);
    submitForm();
})
