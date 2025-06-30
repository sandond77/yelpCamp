// //for showing range value
// const rangeInput = document.getElementById('rating');
// const rangeOutput = document.getElementById('ratingValue');
// // Set initial value
// rangeOutput.textContent = rangeInput.value;

// rangeInput.addEventListener('input', function () {
// 	rangeOutput.textContent = this.value;
// });

//form validation from bootstrap dos
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
	'use strict';

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll('.needs-validation');

	// Loop over them and prevent submission
	Array.from(forms).forEach((form) => {
		form.addEventListener(
			'submit',
			(event) => {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add('was-validated');
			},
			false
		);
	});
})();
