<script>
	import { enhance } from '$lib/form';
	import { api } from './api'
	export let data
	let showNames = false

	let addings = []
	Object.keys(data.additions).forEach(product => {
		addings.push(data.additions[product])
	})

	let products = []
	Object.keys(data.products).forEach(product => {
		products.push(data.products[product])
	})
	let filteredProducts = products

	let filterSku
	let filterName
	let addSku
	let addName
	let product = null

	const getProduct = async () => {
		const response = await api('GET', `product?sku=${sku}`)

		if (response.status === 200) {
			product = await response.json()
		}
	}

	const findProduct = async (e) => {
		let name = e.target.value
		filteredProducts = products.filter(product => product.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
		showNames = name.length && filteredProducts.length
	}

	const selectProduct = product => {
		showNames = false
		addSku = product.sku
		addName = product.name
	}

	let formDialogOpen = false

</script>

<svelte:head>
	<title>Add to stock</title>
	<meta name="description" content="Add to the stock" />
</svelte:head>

<div class="content">
	<h1>Add more to stock</h1>

	<dialog open="{formDialogOpen}" on:close={() => formDialogOpen = false} id="favDialog">
		<form class="add-to-stock" method="dialog">
			<h1>Add more to stock</h1>
			<label>
				Product name
				<input type="text" name="name" bind:value={addName} placeholder="Product name" on:keyup={findProduct} />
				{#if showNames}
					<div class="products-found">
						<ul>
							{#each filteredProducts as pr}
								<li on:click={() => selectProduct(pr)}>{pr.name}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</label>
			<label>
				SKU
				<input type="text" name="sku" bind:value={addSku} placeholder="Product SKU" />
			</label>
			<label>
				Quantity
				<input type="number" name="qty" placeholder="Quantity" />
			</label>
			<label>
				Order price
				<input type="number" name="orderPrice" placeholder="Order price" />
			</label>
			<div>
				<button value="cancel">Cancel</button>
				<button id="confirmBtn" value="default">Add</button>
			</div>
		</form>
	</dialog>
	<p>
		<button id="addToStock" on:click={() => formDialogOpen = true}>Add stock</button>
	</p>

	<h2>Filter by:</h2>
	<form
		class="new"
		action="/add"
		method="post"
		use:enhance={{
			result: async ({ form }) => {
				form.reset();
			}
		}}
	>
		<input name="text" bind:value="{filterSku}" on:change={getProduct} placeholder="SKU" />
		{#if product }
			<p>Product name: {product.name}</p>
			<p>Available quantity: {product.qty}</p>
		{/if}
		<input name="text" bind:value="{filterName}" placeholder="Product name" />
	</form>

	<table>
		<tr class="table-header">
			<th>SKU</th>
			<th>Name</th>
			<th>Quantity</th>
			<th>Order price</th>
			<th>Time</th>
		</tr>
		{#each addings as product}
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

	.products-found {
		position: absolute;
		left: 0;
		top: 100%;
		right: 0;
		z-index: 10;
		background-color: #fff;
		box-shadow: 2px 2px 4px rgb(0 0 0 / 20%);
	}

	.products-found ul {
		list-style: none;
		text-align: left;
	}

	.products-found ul li {
		cursor: pointer;
		padding: 5px;

	}
	.products-found ul li:hover {
		background-color: var(--secondary-color);
	}
</style>
