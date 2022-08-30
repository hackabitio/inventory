<script>
	import { addProduct } from '$lib/form';

	export let data
	$: filteredProducts = Object.keys(data).map((key) => data[key])
	let formDialogOpen = false
	let foundProducts = Object.keys(data).map((key) => data[key])
	let showNames = false
	let filterSku
	let filterName
	let addSku
	let addName
	let addQty
	let addPrice
	let submitDisabled
	$: submitDisabled = !addSku || !addName || !addQty || !addPrice

	const filterBySku = async () => {
		const products = Object.keys(data).map((key) => data[key])
		filteredProducts = filterSku ? products.filter(product => product.sku.indexOf(filterSku) > -1) : products
	}

	const filterByName = async () => {
		const products = Object.keys(data).map((key) => data[key])
		filteredProducts = filterName ? products.filter(product => product.name.toLowerCase().indexOf(filterName.toLowerCase()) > -1) : products
	}

	const findProduct = async (e) => {

		foundProducts = Object.keys(data).map((key) => data[key]).filter(product => product.name.toLowerCase().indexOf(addName.toLowerCase()) > -1)
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
			document.querySelector('form').reset();
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
			<th>Inventory box</th>
			<th>QR code</th>
		</tr>
		{#each filteredProducts as product}
			<tr>
				<td>{product.sku}</td>
				<td>{product.name}</td>
				<td>{product.qty}</td>
				<td>{product.orderPrice}</td>
				<td>{product.inventoryBox || ''}</td>
				<td><img class="product-qr-code" src="http://localhost:8000/images/{product.sku}.png" alt=""></td>
			</tr>
		{/each}
	</table>
</section>

<style>
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
		max-width: 80px;
		display: block;
		margin-inline: auto;
	}
</style>
