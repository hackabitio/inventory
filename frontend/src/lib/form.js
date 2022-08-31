import { invalidate } from '$app/navigation';

export function enhance(form, { pending, error, result } = {}) {
	async function handle_submit(event) {
		// event.preventDefault()

		const data = new FormData(form)

		try {
			let formMethod = form.method === 'dialog' ? 'POST' : form.method
			const response = await fetch(form.action, {
				method: formMethod,
				headers: {
					accept: 'application/json'
				},
				body: data
			});

			if (response.ok) {
				if (result) result({ data, form, response });
				invalidate();
			} else if (error) {
				error({ data, form, error: null, response });
			} else {
				console.error(await response.text());
			}
		} catch (err) {
			if (error && err instanceof Error) {
				error({ data, form, error: err, response: null });
			} else {
				throw err;
			}
		}
	}

	form.addEventListener('submit', handle_submit);

	return {
		destroy() {
			form.removeEventListener('submit', handle_submit);
		}
	};
}

export function addToStock(form, { pending, error, result } = {}) {

	async function handle_submit(event) {
		const data = new FormData(form);
		if (pending) pending({ data, form });

		try {
			if (form.method !== 'dialog') {
				event.preventDefault()
			}
			if (form.action.toLowerCase().indexOf('delete') > -1) {
				if (!confirm("Are you sure you want to remove this record?")) {
					return
				}
			}
			let formMethod = form.method === 'dialog' ? 'POST' : form.method

			const response = await fetch(form.action, {
				method: formMethod,
				headers: {
					accept: 'application/json'
				},
				body: data
			});

			if (response.ok) {
				if (result) result({ data, form, response });
				invalidate();
			} else if (error) {
				error({ data, form, error: null, response });
			} else {
				console.error(await response.text());
			}
		} catch (err) {
			if (error && err instanceof Error) {
				error({ data, form, error: err, response: null });
			} else {
				throw err;
			}
		}
	}

	form.addEventListener('submit', handle_submit);

	return {
		destroy() {
			form.removeEventListener('submit', handle_submit);
		}
	};
}

export function addProduct(form, { pending, error, result } = {}) {

	async function handle_submit(event) {
		const data = new FormData(form);
		if (pending) pending({ data, form });

		try {
			let formMethod = form.method === 'dialog' ? 'POST' : form.method

			const response = await fetch(form.action, {
				method: formMethod,
				headers: {
					accept: 'application/json'
				},
				body: data
			});

			if (response.ok) {
				if (result) result({ data, form, response });
				invalidate();
			} else if (error) {
				error({ data, form, error: null, response });
			} else {
				console.error(await response.text());
			}
		} catch (err) {
			if (error && err instanceof Error) {
				error({ data, form, error: err, response: null });
			} else {
				throw err;
			}
		}
	}

	form.addEventListener('submit', handle_submit);

	return {
		destroy() {
			form.removeEventListener('submit', handle_submit);
		}
	};
}
