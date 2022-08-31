<script>
	import { addProduct } from '$lib/form';

	export let data
	let categories = Object.keys(data.categories).map((key) => data.categories[key])

	$: filteredProducts = Object.keys(data.products).map((key) => data.products[key])
	let formDialogOpen = false
	let foundProducts = Object.keys(data.products).map((key) => data.products[key])
	let showNames = false
	let filterSku
	let filterName
	let addSku
	let addName
	let addQty
	let addPrice
	let submitDisabled
	let selectedProduct = null
	$: submitDisabled = !addSku || !addName || !addQty || !addPrice

	const filterBySku = async () => {
		const products = Object.keys(data.products).map((key) => data.products[key])
		filteredProducts = filterSku ? products.filter(product => product.sku.indexOf(filterSku) > -1) : products
	}

	const filterByName = async () => {
		const products = Object.keys(data.products).map((key) => data.products[key])
		filteredProducts = filterName ? products.filter(product => product.name.toLowerCase().indexOf(filterName.toLowerCase()) > -1) : products
	}

	const findProduct = async (e) => {
		foundProducts = Object.keys(data.products).map((key) => data.products[key]).filter(product => product.name.toLowerCase().indexOf(addName.toLowerCase()) > -1)
		showNames = addName.length && foundProducts.length
	}

	const selectProduct = product => {
		showNames = false
		addSku = product.sku
		addName = product.name
	}

	const closeDialog = e => {
		if (e.key === 'Escape') {
			formDialogOpen = false
			selectedProduct = null
			document.querySelector('form').reset();
		}
	}

	const formatDate = t => {
		if (t) {
			let d = new Date(t)
			return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`
		} else {
			return ' '
		}
	}

	const categoryName = cat => {
		if (cat) {
			let category = categories.find(c => c.id === cat)
			return category.name ?? '-'
		} else {
			return '-'
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
						use:addProduct={{
							result: async ({ form }) => {
								form.reset();
							}
						}}
		>
			<h1>Add more to stock</h1>
			{#if categories.length}
				<label>
					Category
					<select name="category" id="category">
							<option value="" disabled selected>Please select a category</option>
						{#each categories as category}
							<option value="{category.id}">{category.name}</option>
						{/each}
					</select>
				</label>
			{/if}
			<label>
				Product name
				<input autocomplete="off" type="text" id="addName" name="name" bind:value={addName} placeholder="Product name"  on:keyup={findProduct} />
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
		<button id="addToStock" on:click={() => formDialogOpen = true}>Add stock</button>
	</p>

	<h2>Filter by:</h2>

	<input name="text" autocomplete="off" bind:value="{filterSku}" on:keyup={filterBySku} placeholder="SKU" />
	<input name="text" autocomplete="off" bind:value="{filterName}" on:keyup={filterByName} placeholder="Product name" />

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
				<td class="center-align">
					<a href="#" on:click={() => selectedProduct = product}>View</a>
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

	dialog {
		min-width: 40vw;
		box-shadow: 0 0 0 100vw rgb(0 0 0 / .7);
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
