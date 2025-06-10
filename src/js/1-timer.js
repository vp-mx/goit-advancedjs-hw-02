import flatpickr from "flatpickr";
import iziToast from "izitoast";

let userSelectedDate = null;
let timerInterval = null;

const startButton = document.querySelector("[data-start]");
const dateTimePicker = document.querySelector("#datetime-picker");
const daysElement = document.querySelector("[data-days]");
const hoursElement = document.querySelector("[data-hours]");
const minutesElement = document.querySelector("[data-minutes]");
const secondsElement = document.querySelector("[data-seconds]");

const labels = document.querySelectorAll(".label");
labels.forEach((label) => {
    label.textContent = label.textContent.toUpperCase();
});

startButton.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate <= new Date()) {
            iziToast.error({
                message: "Please choose a date in the future",
                position: "topRight",
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startButton.disabled = false;
        }
    },
};

flatpickr("#datetime-picker", options);

startButton.addEventListener("click", startTimer);

function startTimer() {
    startButton.disabled = true;
    dateTimePicker.disabled = true;

    timerInterval = setInterval(() => {
        const currentTime = new Date();
        const timeDifference = userSelectedDate - currentTime;

        if (timeDifference <= 0) {
            resetUI();
        } else {
            const time = convertMs(timeDifference);
            updateUI(time);
        }
    }, 1000);
}

function updateUI({ days, hours, minutes, seconds }) {
    daysElement.textContent = addLeadingZero(days);
    hoursElement.textContent = addLeadingZero(hours);
    minutesElement.textContent = addLeadingZero(minutes);
    secondsElement.textContent = addLeadingZero(seconds);
}

function resetUI() {
    dateTimePicker.disabled = false;
    startButton.disabled = true;
    updateUI({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}
