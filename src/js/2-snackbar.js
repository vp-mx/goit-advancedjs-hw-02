import iziToast from "izitoast";

const form = document.querySelector('.form');
const delayInput = form.querySelector('input[name="delay"]');
const stateInputs = form.querySelectorAll('input[name="state"]');
const submitButton = form.querySelector('button');

form.addEventListener('submit', event => {
    event.preventDefault();

    const delay = Number(delayInput.value);
    const state = getSelectedState();

    if (delay < 0) {
        iziToast.error({
            message: `Invalid delay`,
            position: 'topRight',
        });
        return;
    }

    if (!state) {
        iziToast.error({
            message: `Please select promise state (Fulfilled or Rejected)`,
            position: 'topRight',
        });
        return;
    }

    createPromise(delay, state)
        .then(() => {
            iziToast.success({
                message: `✅ Fulfilled promise in ${delay}ms`,
                position: 'topRight'
            });
        })
        .catch(() => {
            iziToast.error({
                message: `❌ Rejected promise in ${delay}ms`,
                position: 'topRight'
            });
        });

    form.reset();
});

function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else if (state === 'rejected') {
                reject(delay);
            }
        }, delay);
    });
}

function getSelectedState() {
    let selectedState = null;
    stateInputs.forEach(input => {
        if (input.checked) {
            selectedState = input.value;
        }
    });
    return selectedState;
}
