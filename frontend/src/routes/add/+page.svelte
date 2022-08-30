<script>
	import { addToStock } from '$lib/form';
	export let data
	let showNames = false

	$: filteredAdditions = data.additions
	let filteredProducts = data.products

	let filterSku
	let filterName
	let addSku
	let addName
	let addQty
	let addPrice
	let submitDisabled
	$: submitDisabled = !addSku || !addName || !addQty || !addPrice

	const filterBySku = async () => {
		filteredAdditions = filterSku ? data.additions.filter(product => product.sku.toLowerCase().indexOf(filterSku.toLowerCase()) > -1) : data.additions
	}

	const filterByName = async () => {
		filteredAdditions = filterName ? data.additions.filter(product => product.name.toLowerCase().indexOf(filterName.toLowerCase()) > -1) : data.additions
	}

	const findProduct = async (e) => {
		let name = e.target.value
		filteredProducts = data.products.filter(product => product.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
		showNames = name.length && filteredProducts.length
	}

	const selectProduct = product => {
		showNames = false
		addSku = product.sku
		addName = product.name
	}

	const submitForm = e => {
		const formData = new FormData(e.target);
		const submittedData = {};
		for (let field of formData) {
			const [key, value] = field;
			submittedData[key] = value;
		}
	}

	let formDialogOpen = false

	const closeDialog = e => {
		if (e.key === 'Escape') {
			formDialogOpen = false
			document.querySelector('form').reset();
		}
	}
</script>

<svelte:head>
	<title>Add to stock</title>
	<meta name="description" content="Add to the stock" />
</svelte:head>
<svelte:window on:keydown={closeDialog} />

<div class="content">
	<h1>Add more to stock</h1>

	<dialog open="{formDialogOpen}" on:close={() => formDialogOpen = false} id="favDialog">
		<form
						class="add-to-stock"
						method="dialog"
						action="/add"
						use:addToStock={{
							result: async ({ form }) => {
								form.reset();
							}
						}}
		>
			<h1>Add more to stock</h1>
			<label>
				Product name
				<input autocomplete="off" type="text" id="addName" name="name" bind:value={addName} placeholder="Product name" on:keyup={findProduct} />
				{#if showNames}
					<div class="products-autocomplete">
						<ul>
							{#each filteredProducts as pr}
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
			<th>Time</th>
		</tr>
		{#each filteredAdditions as product}
			<tr>
				<td>{product.sku}</td>
				<td>{product.name}</td>
				<td>{product.qty}</td>
				<td>{product.orderPrice}</td>
				<td>{product.time}</td>
			</tr>
		{/each}
	</table>
</div>

<style lang="scss">
	dialog {
		min-width: 40vw;
		box-shadow: 0 0 0 100vw rgb(0 0 0 / .7);
	}

	.add-to-stock {
		display: flex;
		flex-direction: column;
	}

	.add-to-stock label {
		display: grid;
		grid-template-columns: 1fr 4fr;
		position: relative;
		text-align: right;
		grid-gap: 10px;
		margin-bottom: 10px;
	}

</style>
