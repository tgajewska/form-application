import 'bootstrap';
import './main.scss';


let inputs = document.querySelectorAll('input[required]', 'select[required]');

function checkInput(inputs) {
    [...inputs].forEach(function (el) {

        if ($(el).attr('id') == 'idCard') {
            el.addEventListener('click', function () {
                this.addEventListener('change', function () {
                    showAccept($(".file-upload-button"));                  
                })
                showWarning($(".file-upload-button"));
            })
        }

        else {
            el.addEventListener('blur', function () {

                if ($(this).attr('id') == 'start' || $(this).attr('id') == 'end') {

                    if (($(this).attr('id') == 'start' && $('#end').val().length > 0) || ($(this).attr('id') == 'end' && $('#start').val().length > 0)) {
                        if ($('#start').val() >= $('#end').val()) {
                            showWarning(this, $(this).next().data('warning2'));
                        }
                        else {
                            const dateInputs = $('.details input[type=date]');
                            console.log([...dateInputs]);
                            [...dateInputs].forEach(function (el) { showAccept(el); })
                        }
                        return;
                    }
                }
                               
                if (!this.checkValidity()) {
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
}




var setDates = {
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




$('#birthday').attr('max', setDates.setMaxBirthDateAdult());
$("#start, #end").attr({
    'min': setDates.setMinDate(),
    'max': setDates.setMaxDate()
});

checkInput(inputs);

