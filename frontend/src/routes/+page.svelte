<script>
	import { enhance } from '$lib/form'
	import { formatDate } from '$lib/functions'

	export let data
	let categories = Object.keys(data.categories).map((key) => data.categories[key])

	$: filteredProducts = Object.keys(data.products).map((key) => data.products[key])
	let formDialogOpen = false
	let foundProducts = Object.keys(data.products).map((key) => data.products[key])
	let showNames = false
	let filterSku
	let filterName
	let categorySelect
	let addSku
	let addName
	let addQty
	let addPrice
	let submitDisabled
	let selectedProduct = null
	$: submitDisabled = !addSku || !addName || !addQty || !addPrice
	let currentFocus

	const filterBySku = async () => {
		const products = Object.keys(data.products).map((key) => data.products[key])
		filteredProducts = filterSku ? products.filter(product => product.sku.indexOf(filterSku) > -1) : products
	}

	const filterByName = async () => {
		const products = Object.keys(data.products).map((key) => data.products[key])
		filteredProducts = filterName ? products.filter(product => product.name.toLowerCase().indexOf(filterName.toLowerCase()) > -1) : products
	}

	const filterByCategory = async (e) => {
		let filterCategory = e.target.value
		const products = Object.keys(data.products).map((key) => data.products[key])
		if (filterCategory == 0) {
			console.log('All')
			filteredProducts = products
		} else {
			filteredProducts = filterCategory ? products.filter(product => product.category === filterCategory) : products
		}
	}

	const findProduct = async (e) => {
		foundProducts = Object.keys(data.products).map((key) => data.products[key]).filter(product => product.name.toLowerCase().indexOf(addName.toLowerCase()) > -1)
		showNames = addName.length && foundProducts.length
		if (showNames) {
			let autoSuggest = document.querySelectorAll('.products-autocomplete ul li')
			if (e.key === 'ArrowDown') {
				currentFocus++
				setActive(autoSuggest)
			} else if (e.key === 'ArrowUp') {
				currentFocus--
				setActive(autoSuggest)
			} else if (currentFocus > -1 && e.key === 'Enter') {
				selectProduct(filteredProducts[currentFocus])
			} else {
				currentFocus = -1
			}
		}
	}

	const setActive = x => {
		if (!x) return false
		removeActive(x)
		if (currentFocus >= x.length) currentFocus = 0
		if (currentFocus < 0) currentFocus = (x.length - 1)
		x[currentFocus].classList.add("in-focus")
		x[currentFocus].focus()
	}

	const removeActive = x => {
		for (let i = 0; i < x.length; i++) {
			x[i].classList.remove("in-focus")
		}
	}

	const selectProduct = product => {
		showNames = false
		addSku = product.sku
		addName = product.name
	}


	const openDialog = e => {
		formDialogOpen = true
		setTimeout(() => {
			categorySelect.focus()
		}, 100)
	}

	const closeDialog = e => {
		if (e.key === 'Escape') {
			formDialogOpen = false
			selectedProduct = null
			document.querySelector('form').reset();
		}
	}

	const categoryName = cat => {
		if (cat) {
			let category = categories.find(c => c.id === cat)
			return category.name ?? '-'
		} else {
			return ''
		}
	}
</script>

<svelte:head>
	<title>Available stock</title>
	<meta name="description" content="Available stock" />
</svelte:head>
<svelte:window on:keydown={closeDialog} />

<section>
	<h1>Available stock</h1>

	<dialog open="{formDialogOpen}" on:close={() => formDialogOpen = false} id="favDialog">
		<form
						class="add-new-product"
						method="dialog"
						action="/"
						use:enhance={{
							result: async ({ form }) => {
								form.reset();
							}
						}}
		>
			<h1>Add more to stock</h1>
			{#if categories.length}
				<label>
					Category
					<select bind:this={categorySelect} name="category" id="category">
							<option value="" disabled selected>Please select a category</option>
						{#each categories as category}
							<option value="{category.id}">{category.name}</option>
						{/each}
					</select>
				</label>
			{/if}
			<label>
				Product name
				<input autocomplete="off" type="text" id="addName" name="name" bind:value={addName} placeholder="Product name"  on:keyup={findProduct} on:blur={() => showNames = false} />
				{#if showNames}
					<div class="products-autocomplete">
						<ul>
							{#each foundProducts as pr}
								<li on:click={() => selectProduct(pr)}>
									{pr.name}
									<span>sku: {pr.sku}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</label>
			<label>
				SKU
				<input type="text" id="addSku" name="sku" bind:value={addSku} placeholder="Product SKU" />
			</label>
			<label>
				Quantity
				<input type="number" id="qty" name="qty" bind:value={addQty} placeholder="Quantity" />
			</label>
			<label>
				Order price
				<input type="number" id="orderPrice" name="orderPrice" bind:value={addPrice} placeholder="Order price" />
			</label>
			<label>
				More details
				<textarea name="details" id="moreDetails" cols="30" rows="10"></textarea>
			</label>
			<div>
				<button value="cancel" type="reset" on:click={() => formDialogOpen = false}>Cancel</button>
				<button id="confirmBtn" value="default" type="submit" disabled={submitDisabled}>Add</button>
			</div>
		</form>
	</dialog>
	<p>
		<button id="addToStock" on:click={openDialog}>Add stock</button>
	</p>

	<h2>Filter by:</h2>

	<input name="text" autocomplete="off" bind:value="{filterSku}" on:keyup={filterBySku} placeholder="SKU" />
	<input name="text" autocomplete="off" bind:value="{filterName}" on:keyup={filterByName} placeholder="Product name" />
	{#if categories.length}
			Category
			<select on:change={filterByCategory} name="category" id="categoryFilter">
				<option value="0">All</option>
				{#each categories as category}
					<option value="{category.id}">{category.name}</option>
				{/each}
			</select>
	{/if}

	<table>
		<tr class="table-header">
			<th>SKU</th>
			<th>Name</th>
			<th>Quantity</th>
			<th>Order price</th>
			<th>Category</th>
			<th></th>
		</tr>
		{#each filteredProducts as product}
			<tr>
				<td>{product.sku || '-'}</td>
				<td>{product.name || '-'}</td>
				<td>{product.qty || '-'}</td>
				<td>{product.orderPrice || '-'}</td>
				<td>{categoryName(product.category)}</td>
				<td class="center-align record-actions">
					<button class="icon-button" aria-label="View product" on:click={() => selectedProduct = product} >
						<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M6.11138 8.58242C6.11138 5.87359 8.30002 3.67818 11.0005 3.67818C13.7009 3.67818 15.8896 5.87359 15.8896 8.58242C15.8896 11.2912 13.7009 13.4867 11.0005 13.4867C8.30002 13.4867 6.11138 11.2912 6.11138 8.58242ZM11.0005 11.6476C12.6887 11.6476 14.0562 10.2759 14.0562 8.58242C14.0562 6.88892 12.6887 5.51727 11.0005 5.51727C10.9737 5.51727 10.9508 5.51727 10.8897 5.51727C10.9737 5.71267 11.0005 5.91957 11.0005 6.1303C11.0005 7.4828 9.90425 8.58242 8.55593 8.58242C8.34585 8.58242 8.13959 8.5556 7.94479 8.47131C7.94479 8.53261 7.94479 8.5556 7.94479 8.54794C7.94479 10.2759 9.31221 11.6476 11.0005 11.6476ZM3.64468 3.08814C5.44295 1.4115 7.91424 0 11.0005 0C14.0867 0 16.558 1.4115 18.357 3.08814C20.1446 4.75098 21.3402 6.70885 21.9055 8.11115C22.0315 8.41383 22.0315 8.751 21.9055 9.05368C21.3402 10.4215 20.1446 12.3794 18.357 14.0767C16.558 15.7549 14.0867 17.1648 11.0005 17.1648C7.91424 17.1648 5.44295 15.7549 3.64468 14.0767C1.8571 12.3794 0.662325 10.4215 0.0940054 9.05368C-0.0313351 8.751 -0.0313351 8.41383 0.0940054 8.11115C0.662325 6.70885 1.8571 4.75098 3.64468 3.08814ZM11.0005 1.83909C8.51009 1.83909 6.46278 2.97319 4.89292 4.43297C3.42237 5.80463 2.40712 7.3985 1.88842 8.58242C2.40712 9.73185 3.42237 11.3602 4.89292 12.7319C6.46278 14.1916 8.51009 15.3257 11.0005 15.3257C13.4909 15.3257 15.5382 14.1916 17.108 12.7319C18.5786 11.3602 19.5602 9.73185 20.1141 8.58242C19.5602 7.3985 18.5786 5.80463 17.108 4.43297C15.5382 2.97319 13.4909 1.83909 11.0005 1.83909Z" fill="black"/>
						</svg>
					</button>
					<form
						action="/?_method=DELETE"
						method="post"
						use:enhance={{
							pending: () => {
								product.pending_delete = true
								setTimeout(()=>{ product.pending_delete = false }, 3000)
							}
						}}
					>
						<input type="hidden" name="id" value={product.id} />
						<button class="icon-button" aria-label="Delete addition" disabled={product.pending_delete} >
							<svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M5.13036 0.677727C5.33527 0.262356 5.75647 0 6.21563 0H10.7844C11.2435 0 11.6647 0.262356 11.8696 0.677727L12.1429 1.22596H15.7857C16.4574 1.22596 17 1.77496 17 2.45192C17 3.12888 16.4574 3.67788 15.7857 3.67788H1.21429C0.543772 3.67788 0 3.12888 0 2.45192C0 1.77496 0.543772 1.22596 1.21429 1.22596H4.85714L5.13036 0.677727ZM1.18013 4.90385H15.7857V17.1635C15.7857 18.5159 14.6967 19.6154 13.3571 19.6154H3.60871C2.30145 19.6154 1.18013 18.5159 1.18013 17.1635V4.90385ZM4.21585 7.96875V16.5505C4.21585 16.8876 4.52321 17.1635 4.82299 17.1635C5.19107 17.1635 5.43013 16.8876 5.43013 16.5505V7.96875C5.43013 7.63161 5.19107 7.35577 4.82299 7.35577C4.52321 7.35577 4.21585 7.63161 4.21585 7.96875ZM7.85871 7.96875V16.5505C7.85871 16.8876 8.16607 17.1635 8.46585 17.1635C8.83393 17.1635 9.10714 16.8876 9.10714 16.5505V7.96875C9.10714 7.63161 8.83393 7.35577 8.46585 7.35577C8.16607 7.35577 7.85871 7.63161 7.85871 7.96875ZM11.5357 7.96875V16.5505C11.5357 16.8876 11.8089 17.1635 12.1429 17.1635C12.4768 17.1635 12.75 16.8876 12.75 16.5505V7.96875C12.75 7.63161 12.4768 7.35577 12.1429 7.35577C11.8089 7.35577 11.5357 7.63161 11.5357 7.96875Z" fill="black"/>
							</svg>
						</button>
					</form>
				</td>
			</tr>
		{/each}
	</table>
	<dialog class="product-details-dialog" open={selectedProduct !== null} on:close={() => selectedProduct = null} id="productDetails">
		<svg on:click={() => selectedProduct = null} class="close-dialog" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M17.4699 14.929C18.173 15.6321 18.173 16.771 17.4699 17.4741C17.1212 17.8256 16.6599 18 16.1987 18C15.7375 18 15.2774 17.8242 14.9265 17.4727L8.9993 11.5486L3.0727 17.4713C2.72116 17.8256 2.26051 18 1.79986 18C1.33921 18 0.879119 17.8256 0.527303 17.4713C-0.175768 16.7682 -0.175768 15.6292 0.527303 14.9262L6.45559 8.99789L0.527303 3.07242C-0.175768 2.36935 -0.175768 1.23037 0.527303 0.527303C1.23037 -0.175768 2.36935 -0.175768 3.07242 0.527303L8.9993 6.4584L14.9276 0.530115C15.6307 -0.172955 16.7696 -0.172955 17.4727 0.530115C18.1758 1.23319 18.1758 2.37216 17.4727 3.07523L11.5444 9.00351L17.4699 14.929Z" fill="black"/>
		</svg>
		{#if selectedProduct}
			<h1 class="product-name">{selectedProduct.name}</h1>
			<div class="product-details">
				<p>
					<strong>SKU:</strong> {selectedProduct.sku}
				</p>
				<p>
					<strong>Category:</strong> {categoryName(selectedProduct.category)}
				</p>
				<p>
					<strong>Quantity:</strong> {selectedProduct.qty}
				</p>
				<p>
					<strong>Order price:</strong> {selectedProduct.orderPrice}
				</p>
				{#if selectedProduct.inventoryBox}
					<p>
						<strong>inventory placement:</strong> {selectedProduct.inventoryBox}
					</p>
				{/if}
			</div>
			<img class="product-qr-code" src="http://localhost:8000/images/{selectedProduct.sku}.png" alt="">
			{#if selectedProduct.details}
				<div class="product-more-details">
					<h3>More details</h3>
					<p>{@html selectedProduct.details.replace(/\r\n/g, '<br />')}</p>
				</div>
			{/if}
			<div class="product-transactions">
				{#if selectedProduct.additions.length}
					<div class="product-additions">
						<h4>Product additions</h4>
						<ul>
							<li>
								<h4 class="transaction-time">Time</h4>
								<h4 class="transaction-qty">Quantity</h4>
								<h4 class="transaction-price">Price</h4>
							</li>
							{#each selectedProduct.additions as addition}
								<li>
									<div class="transaction-time">
										{formatDate(addition.time)}
									</div>
									<div class="transaction-qty">
										{addition.qty}
									</div>
									<div class="transaction-price">
										{addition.orderPrice}
									</div>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if selectedProduct.deductions.length}
					<div class="product-deductions">
						<h4>Product deductions</h4>
						<ul>
							<li>
								<h4 class="transaction-time">Time</h4>
								<h4 class="transaction-qty">Quantity</h4>
								<h4 class="transaction-price">Price</h4>
							</li>
							{#each selectedProduct.deductions as deduction}
								<li>
									<div class="transaction-time">
										{formatDate(deduction.time) || '-'}
									</div>
									<div class="transaction-qty">
										{deduction.qty || '-'}
									</div>
									<div class="transaction-price">
										{deduction.orderPrice || '-'}
									</div>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/if}
	</dialog>
</section>

<style lang="scss">
	h1 {
		width: 100%;
	}

	.add-new-product {
		display: flex;
		flex-direction: column;
	}

	.add-new-product label {
		display: grid;
		grid-template-columns: 1fr 4fr;
		position: relative;
		text-align: right;
		grid-gap: 10px;
		margin-bottom: 10px;
	}

	.product-qr-code {
		grid-area: images;
		display: block;
		margin-inline: auto;
	}

	.product-details-dialog {
		top: 50%;
		transform: translateY(-50%);
	}

	.product-details-dialog[open] {
		display: grid;
		grid-template-areas:
						"name name name"
						"desc desc images"
						"details details details"
						"transactions transactions transactions";
	}

	.product-name {
		grid-area: name;
	}

	.product-details {
		grid-area: desc;
	}

	.close-dialog {
		position: absolute;
		right: 15px;
		top: 15px;
		cursor: pointer;
	}

	.close-dialog path {
		fill: var(--text-color);
	}

	.close-dialog:hover path {
		fill: var(--accent-color);
	}

	.product-more-details {
		grid-area: details;
	}

	.product-transactions {
		grid-area: transactions;

		.product-additions,
		.product-deductions {

			> h4 {
				margin-bottom: 0;
			}
		}
		.product-deductions {
			margin-top: 40px;

			h4 {
				margin-top: 10px;
			}
		}

		li {
			h4 {
				margin-top: 0;
				margin-bottom: 10px;
			}
		}
	}
</style>
