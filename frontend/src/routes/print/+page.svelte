<script>
	export let data
	let showName = false
	let listView = false
	let categories = Object.keys(data.categories).map((key) => data.categories[key])
	let products = Object.keys(data.products).map((key) => data.products[key])

	// products = products.splice(149, 32)

</script>

<svelte:head>
	<title>&nbsp;</title>
	<meta name="description" content="Find product info" />
</svelte:head>

<div class="content">
	<h1 class="no-print">All products for print</h1>
	<div class="no-print config-header">
		<label for="showName" class="show-names">Show names
			<input id="showName" class="sku-input" name="showName" type="checkbox" on:change={() => showName = !showName} />
		</label>
		<button class="icon-button" aria-label="View product" on:click={() => listView = !listView} >
			{#if listView}
				<svg width="50" height="44" viewBox="0 0 50 44" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 6.25C0 2.80273 2.80273 0 6.25 0H43.75C47.1973 0 50 2.80273 50 6.25V37.5C50 40.9473 47.1973 43.75 43.75 43.75H6.25C2.80273 43.75 0 40.9473 0 37.5V6.25ZM6.25 6.25V12.5H12.5V6.25H6.25ZM43.75 6.25H18.75V12.5H43.75V6.25ZM6.25 18.75V25H12.5V18.75H6.25ZM43.75 18.75H18.75V25H43.75V18.75ZM6.25 31.25V37.5H12.5V31.25H6.25ZM43.75 31.25H18.75V37.5H43.75V31.25Z" fill="black"/>
				</svg>
			{:else}
				<svg width="50" height="44" viewBox="0 0 50 44" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M6.25 0C2.80273 0 0 2.80273 0 6.25V37.5C0 40.9473 2.80273 43.75 6.25 43.75H43.75C47.1973 43.75 50 40.9473 50 37.5V6.25C50 2.80273 47.1973 0 43.75 0H6.25ZM14.8438 6.25V12.5H6.25V6.25H14.8438ZM20.3125 6.25H28.9062V12.5H20.3125V6.25ZM43.75 6.25V12.5H35.1562V6.25H43.75ZM6.25 18.75H14.8438V25H6.25V18.75ZM28.9062 18.75V25H20.3125V18.75H28.9062ZM35.1562 18.75H43.75V25H35.1562V18.75ZM14.8438 31.25V37.5H6.25V31.25H14.8438ZM20.3125 31.25H28.9062V37.5H20.3125V31.25ZM43.75 31.25V37.5H35.1562V31.25H43.75Z" fill="black"/>
				</svg>
			{/if}
		</button>
	</div>

	{#if products}
		{#if listView}
			<ol class="list-products">
				<table>
					<tr class="table-header">
						<th>#</th>
						<th>Name</th>
						<th>SKU</th>
						<th>Cost</th>
						<th>Qty</th>
					</tr>
				{#each products as product, index}
					<tr>
						<td class="product-index">{index + 1}</td>
						<td class="product-name">{product.name}</td>
						<td>{product.sku}</td>
						<td>{parseFloat(product.orderPrice).toFixed(2)}kr</td>
						<td>{product.qty}</td>
					</tr>
				{/each}
				</table>
			</ol>
		{:else}
			<section class="grid-products">
				{#each products as product}
					<div class="product">
						<img class="product-qr-code" src="qr/{product.sku}.png" alt="">
						<div class="sku">
							{product.sku}
						</div>
					</div>
					<div class="product">
					<h4>{product.name}</h4>
					</div>
				{/each}
			</section>
		{/if}
	{:else}
		<h1>Nothing to display</h1>
	{/if}

</div>

<style lang="scss">
	.grid-products {
		--cards-per-line: 5;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-column-gap: 10.5px;
		width: 805px;
	}

	.product {
		//display: inline-grid;
		//width: calc(100% / var(--cards-per-line));
		padding: 5px;
		//outline: 1px solid rgb(0 0 0 / 10%);
		//text-align: center;
		position: relative;
		height: calc(21.2px * 4);
		width: calc(38.1px * 4);;

		.sku {
			font-size: 12px;
			width: 76px;
			word-break: break-word;
			top: 50%;
			transform: translateY(-50%);
			position: relative;
		}

		h4 {
			word-break: break-word;
			margin-top: 0px;
			margin-bottom: 0;
			font-size: 14px;
			text-align: center;
			top: 50%;
			transform: translateY(-50%);
			position: relative;
		}

		@media print {
			break-inside: avoid;


			span {
				font-size: 12px;
				width: 107px;
			}

			h4 {
				word-break: break-word;
				margin-top: 5px;
				margin-bottom: 0;
				font-size: 12px;
				width: 107px;
			}

		}

	}

	.product-qr-code {
		//display: block;
		//margin-inline: auto;
		//max-width: 80%;
		//margin-bottom: 5px;

		position: absolute;
		width: 70px;
		top: 7px;
		right: 7px;
	}

	.config-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.show-names {
		display: block;
		text-align: center;
		margin-bottom: 30px;
	}

	.list-products {
		font-size: 14px;

		h4 {
			margin: 0;
			display: inline-block;
		}

		tr {
			outline: 1px solid rgb(0 0 0 / 10%);
		}

		.product-index {
			padding-left: 0;
		}

		.product-name {
			font-size: 12px;
			width: 55%;
		}
	}
</style>
