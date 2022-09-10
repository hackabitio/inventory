<script>
	export let data
	let showName = false
	let categories = Object.keys(data.categories).map((key) => data.categories[key])
	let products = Object.keys(data.products).map((key) => data.products[key])

</script>

<svelte:head>
	<title>&nbsp;</title>
	<meta name="description" content="Find product info" />
</svelte:head>

<div class="content">
	<h1 class="no-print">All products for print</h1>
	<label for="showName" class="show-names no-print">Show names
		<input id="showName" class="sku-input" name="showName" type="checkbox" on:change={() => showName = !showName} />
	</label>
	<section class="products">
		{#if products}
			{#each products as product}
				<div class="product">
					<img class="product-qr-code" src="http://localhost:8000/images/{product.sku}.png" alt="">
					<span>
						{product.sku}
					</span>
					{#if showName}
						<h4>{product.name}</h4>
					{/if}
				</div>
			{:else}
				<h1>Nothing to display</h1>
			{/each}
		{/if}
	</section>

</div>

<style lang="scss">
	.products {
		--cards-per-line: 6;

	}

	.product {
		display: inline-grid;
		width: calc(100% / var(--cards-per-line));
		padding: 5px;
		outline: 1px solid rgb(0 0 0 / 10%);
		text-align: center;

		span {
			font-size: 14px;
		}

		h4 {
			word-break: break-word;
			margin-top: 5px;
			margin-bottom: 0;
			font-size: 14px;
		}

		@media print {
			break-inside: avoid;
		}

		h4 {
			font-size: 12px;
		}
	}

	.product-qr-code {
		display: block;
		margin-inline: auto;
		max-width: 80%;
		margin-bottom: 5px;
	}

	.show-names {
		display: block;
		text-align: center;
		margin-bottom: 30px;
	}
</style>
