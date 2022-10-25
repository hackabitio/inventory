<script>
	import { formatDate } from '$lib/functions'
	import { onMount } from 'svelte'

	export let data
	let filterSku
	let skuInput
	let products = null
	let isMobile = false
	let categories = Object.keys(data.categories).map((key) => data.categories[key])
	let allProducts = Object.keys(data.products).map((key) => data.products[key])

	onMount(async () => {
		isMobile = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);
		filterSku = isMobile ? 'BCSCAN ' : ''
	})

	const filterBySku = e => {
		let skus = filterSku.replace('BCSCAN', '').replace(/\s/g, '').toLowerCase()
		skus = skus.split(',')
		products = allProducts.filter(product => skus.includes(product.sku.toLowerCase()))
		if (products && isMobile) {
			skuInput.blur()
		}
	}

	const clearSku = e => {
		if (products && isMobile) {
			filterSku = 'BCSCAN '
			products = null
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
	<title>Product info</title>
	<meta name="description" content="Find product info" />
</svelte:head>

<div class="content">
	<h1>Search product info</h1>
	<input bind:this={skuInput} class="sku-input" name="text" autocomplete="off" bind:value="{filterSku}" on:focus={clearSku} on:input={filterBySku} placeholder="SKU" />

	{#if products}
		{#each products as product}
			<section class="product-details">
				<h3 class="product-name">{product.name}</h3>
				<div class="details">
					<p>
						<strong>SKU:</strong> {product.sku}
					</p>
					<p>
						<strong>Category:</strong> {categoryName(product.category)}
					</p>
					<p>
						<strong>Quantity:</strong> {product.qty}
					</p>
					<p>
						<strong>Order price:</strong> {product.orderPrice}
					</p>
					<p>
						<strong>Warehouse placement:</strong> {product.warehousePlace}
					</p>
					{#if product.inventoryBox}
						<p>
							<strong>inventory placement:</strong> {product.inventoryBox}
						</p>
					{/if}
				</div>
				<img class="product-qr-code" src="qr/{product.sku}.png" alt="">
				{#if product.details}
					<div class="product-more-details">
						<h3>More details</h3>
						<p>{@html product.details.replace(/\r\n/g, '<br />')}</p>
					</div>
				{/if}
				<div class="product-transactions">
					{#if product.additions.length}
						<div class="product-additions">
							<h4>Product additions</h4>
							<ul>
								<li>
									<h4 class="transaction-time">Time</h4>
									<h4 class="transaction-qty">Quantity</h4>
									<h4 class="transaction-price">Price</h4>
								</li>
								{#each product.additions as addition}
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
					{#if product.deductions.length}
						<div class="product-deductions">
							<h4>Product deductions</h4>
							<ul>
								<li>
									<h4 class="transaction-time">Time</h4>
									<h4 class="transaction-qty">Quantity</h4>
									<h4 class="transaction-price">Price</h4>
								</li>
								{#each product.deductions as deduction}
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
			</section>
		{/each}
	{:else}
		<h1>Nothing to display</h1>
	{/if}

</div>

<style lang="scss">
	.sku-input {
		display: block;
		width: calc(100% - 1.5rem);
		padding: 10px;
		font-size: 19px;
	}

	.product-details {
		display: grid;
		grid-template-areas:
						"name name name"
						"desc desc images"
						"details details details"
						"transactions transactions transactions";

	
		& + .product-details {
			border-top: 5px solid rgb(0 0 0 / 5%);
		}
	}

	.product-name {
		grid-area: name;
		margin-bottom: 20px;
	}

	.details {
		grid-area: desc;

		p {
			margin-top: 0;
			margin-bottom: 5px;
		}
	}

	.product-more-details {
		grid-area: details;

		h3 {
			margin-top: 10px;
			margin-bottom: 0;
		}
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

	.product-qr-code {
		grid-area: images;
		display: block;
		margin-inline: auto;
		max-width: 180px;
	}
</style>
