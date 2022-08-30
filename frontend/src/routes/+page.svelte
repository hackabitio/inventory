<script>
	import { addProduct } from '$lib/form';

	export let data
	$: filteredProducts = Object.keys(data).map((key) => data[key])
	let formDialogOpen = false
	let filterSku
	let filterName

	const filterBySku = async () => {
		const products = Object.keys(data).map((key) => data[key])
		if (filterSku) {
			filteredProducts = products.filter(product => product.sku.indexOf(filterSku) > -1)
		}
	}

	const filterByName = async () => {
		const products = Object.keys(data).map((key) => data[key])
		if (filterName) {
			filteredProducts = products.filter(product => product.name.toLowerCase().indexOf(filterName.toLowerCase()) > -1)
		}
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
				<input autocomplete="off" type="text" id="addName" name="name" placeholder="Product name" />
			</label>
			<label>
				SKU
				<input type="text" id="addSku" name="sku" placeholder="Product SKU" />
			</label>
			<label>
				Quantity
				<input type="number" id="qty" name="qty" placeholder="Quantity" />
			</label>
			<label>
				Order price
				<input type="number" id="orderPrice" name="orderPrice" placeholder="Order price" />
			</label>
			<div>
				<button value="cancel">Cancel</button>
				<button id="confirmBtn" value="default" type="submit">Add</button>
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
