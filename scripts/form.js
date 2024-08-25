function extractFormData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function extractRequiredFields(form) {
  return form.dataset.requiredFields.split('|');
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateForm(currElement) {
  const formElement = currElement.closest('.js-form');
  if (!formElement) return null;

  const formData = extractFormData(formElement);
  const requiredFields = extractRequiredFields(formElement);

  for (const field in formData) {
    formData[field] = formData[field] != null ? formData[field].trim() : null;
  }

  let isFocused = false;

  for (const field of requiredFields) {
    const inputElem = formElement.querySelector(`[name="${field}"]`);
    if (!inputElem) continue;

    const errorMessageElem = inputElem.closest('.js-form__input-wrapper').querySelector('.js-form__error-message');
    if (!errorMessageElem) continue;

    if (inputElem.type === 'email' && !validateEmail(inputElem.value)) {
      showErrorMessage(errorMessageElem, 'Please enter a valid email address');

    } else if (inputElem.type === 'checkbox' && !formData[inputElem.name]) {
      showErrorMessage(errorMessageElem, 'To submit this form, please consent to being contacted');

    } else if (!formData[field]) {
      showErrorMessage(errorMessageElem, 'This field is required');
      if (!isFocused) {
        inputElem.focus();
        isFocused = true;
      }

    } else {
      hideErrorMessage(errorMessageElem);
    }
  }

  if (!isFocused) {
    console.log('Valid');
  }
}

function showErrorMessage(element, message) {
  if (!element) return;
  element.textContent = message || 'Invalid Input';
  element.setAttribute('aria-hidden', 'false');
}

function hideErrorMessage(element) {
  element.textContent = '|';
  element.setAttribute('aria-hidden', 'true');
}

function manageRadioButtonGroup(element) {
  element.closest('.js-form__input--radio-wrapper').querySelectorAll(`[name="${element.name}"]`).forEach(elem => {
    const wrapperElement = elem.parentElement;

    if (elem.checked) {
      wrapperElement.classList.add('selected');
    } else {
      wrapperElement.classList.remove('selected');
    }
  });
}

document.addEventListener('click', (e) => {
  const currElement = e.target;

  if (currElement.classList.contains('js-submit-button')) {
    e.preventDefault();
    validateForm(currElement);
  }
  if (currElement.type === 'radio') {
    manageRadioButtonGroup(currElement);
  }
});

const checkedRadioButtons = Array.from(document.querySelectorAll('input:checked'));
if (checkedRadioButtons.length) {
  checkedRadioButtons.forEach(radio => {
    manageRadioButtonGroup(radio);
  });
}
