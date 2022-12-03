<script>
	import { enhance } from '$lib/form'
	import { formatDate } from '$lib/functions'
	import html2canvas from 'html2canvas'

	export let data
	let categories = Object.keys(data.categories).map((key) => data.categories[key])

	const productsArr = () => {
		let products = Object.keys(data.products).map((key) => {
			let product = data.products[key]
			if (product.avgPrice == undefined) {
				let additionsPrice = 0
				let additionsQty = 0
				let productPrice = product.orderPrice
				if (product.additions) {
					product.additions.forEach(addition => {
						additionsQty += addition.qty
						additionsPrice += parseFloat(addition.qty * addition.orderPrice)
					})
					let productQty = product.qty - additionsQty
					productPrice = parseFloat((product.orderPrice * productQty) + additionsPrice) / parseInt(additionsQty + productQty)
				}
				product.avgPrice = productPrice < 1 ? parseFloat(productPrice).toFixed(3) : parseFloat(productPrice).toFixed(2)
			}
			return product
		})

		return products
	}

	$: filteredProducts = productsArr()
	let formDialogOpen = false
	let foundProducts = productsArr()
	let showNames = false
	let filterSku
	let filterName
	let categorySelect
	let selectedCategory
	let addID
	let addSku
	let addName
	let addQty
	let addPrice
	let warehousePlace
	let addDetails = null
	let addCategory
	let submitDisabled
	let selectedProduct = null
	let printProduct = null
	$: submitDisabled = !addSku || !addName || !addQty || !addPrice
	let currentFocus
	let printWidth = 30
	let printHeight = 40
	let qrHeight = 20

	const filterProducts = async () => {
		filteredProducts = productsArr()
		if (selectedCategory == 0) {
			filteredProducts = productsArr()
		} else {
			filteredProducts = selectedCategory ? filteredProducts.filter(product => product.category === selectedCategory) : filteredProducts
		}
		filteredProducts = filterSku ? filteredProducts.filter(product => product.sku.indexOf(filterSku) > -1) : filteredProducts
		filteredProducts = filterName ? filteredProducts.filter(product => product.name.toLowerCase().indexOf(filterName.toLowerCase()) > -1) : filteredProducts
	}

	const findProduct = async (e) => {
		foundProducts = productsArr().filter(product => product.name.toLowerCase().indexOf(addName.toLowerCase()) > -1)
		showNames = addName && addName.length && foundProducts.length
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

	const printPrev = product => {
		printProduct = product
		setTimeout(()=>{
			const el = document.querySelector(".print-details")
			el.style.width = parseInt(printWidth * 10) + 'px'
			el.style.height = parseInt(printHeight * 10) + 'px'
			const qr = el.querySelector('.product-qr-code')
			qr.style.maxWidth = `calc(${qrHeight}px * 10)`
			html2canvas(el, {
				allowTaint: true
			}).then(canvas => {
				document.getElementById('printCanvas').appendChild(canvas)
				el.style.display = 'none'
			});
		}, 10)
	}

	const changeCanvas = () => {
		setTimeout(() => {
			const el = document.querySelector(".print-details")
			el.style.display = 'block'
			el.style.width = parseInt(printWidth * 10) + 'px'
			el.style.height = parseInt(printHeight * 10) + 'px'
			const qr = el.querySelector('.product-qr-code')
			qr.style.maxWidth = `calc(${qrHeight}px * 10)`
			document.getElementById('printCanvas').innerHTML = ''
			html2canvas(el, {
				allowTaint: true
			}).then(canvas => {
				document.getElementById('printCanvas').appendChild(canvas)
				el.style.display = 'none'
			});
		}, 10)
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

	const editProduct = product => {
		openDialog()
		addID = product.id
		addSku = product.sku
		addName = product.name
		addQty = product.qty
		addPrice = product.orderPrice
		addDetails = product.details
		warehousePlace = product.warehousePlace
		addCategory = product.category
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
			printProduct = null
			document.querySelector('form').reset()
			addID = null
			addSku = null
			addName = null
			addQty = null
			addPrice = null
			addDetails = null
			addCategory = null
			warehousePlace = null
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
			<input type="hidden" name="productId" bind:value={addID}>
			<input type="hidden" name="editOrNew" bind:value={addID}>
			{#if categories.length}
				<label>
					Category
					<select bind:this={categorySelect} name="category" id="category">
							<option value="" disabled selected>Please select a category</option>
						{#each categories as category}
							{#if addCategory === category.id}
								<option value="{category.id}" selected>{category.name}</option>
							{:else}
								<option value="{category.id}">{category.name}</option>
							{/if}
						{/each}
					</select>
				</label>
			{/if}
			<label>
				Product name
				<input autocomplete="off" type="text" id="addName" name="name" bind:value={addName} placeholder="Product name" on:input={findProduct} />
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
				<input type="text" id="addSku" name="sku" bind:value={addSku} on:focus={() => showNames = false} placeholder="Product SKU" />
			</label>
			<label>
				Quantity
				<input type="number" id="qty" name="qty" bind:value={addQty} placeholder="Quantity" />
			</label>
			<label>
				Order price
				<input type="number" step="any" id="orderPrice" name="orderPrice" bind:value={addPrice} placeholder="Order price" />
			</label>
			<label>
				Warehouse place
				<input type="text" id="warehousePlace" name="warehousePlace" bind:value={warehousePlace} placeholder="Warehouse place" />
			</label>
			<label>
				More details
				<textarea name="details" id="moreDetails" cols="30" rows="10">{addDetails}</textarea>
			</label>
			<div>
				<button value="cancel" type="reset" on:click={() => formDialogOpen = false}>Cancel</button>
				<button id="confirmBtn" value="default" type="submit" disabled={submitDisabled}>{addID ? 'Update' : 'Add'}</button>
			</div>
		</form>
	</dialog>
	<p>
		<button id="addToStock" on:click={openDialog}>Add stock</button>
	</p>

	<h2>Filter by:</h2>

	<input name="text" autocomplete="off" bind:value="{filterSku}" on:keyup={filterProducts} placeholder="SKU" />
	<input name="text" autocomplete="off" bind:value="{filterName}" on:keyup={filterProducts} placeholder="Product name" />
	{#if categories.length}
			Category
			<select bind:value={selectedCategory} on:change={filterProducts} name="category" id="categoryFilter">
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
			<th>
				<span class="show-in-mobile">Qty</span>
				<span class="hide-in-mobile">Quantity</span>
			</th>
			<th class="hide-in-mobile">Order price</th>
			<th class="hide-in-mobile">Category</th>
			<th class="hide-in-mobile">WHS</th>
			<th>Actions</th>
		</tr>
		{#each filteredProducts as product}
			<tr>
				<td>{product.sku || '-'}</td>
				<td>{product.name || '-'}</td>
				<td>{product.qty || '-'}</td>
				<!-- <td class="hide-in-mobile">{product.orderPrice ? parseFloat(product.orderPrice).toFixed(2) : '-'}</td> -->
				<td class="hide-in-mobile">{product.avgPrice ? product.avgPrice : '-'}</td>
				<td class="hide-in-mobile">{categoryName(product.category)}</td>
				<td class="hide-in-mobile">{product.warehousePlace ? product.warehousePlace : '-'}</td>
				<td class="center-align record-actions">
					<button class="icon-button" aria-label="View product" on:click={() => selectedProduct = product} >
						<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M6.11138 8.58242C6.11138 5.87359 8.30002 3.67818 11.0005 3.67818C13.7009 3.67818 15.8896 5.87359 15.8896 8.58242C15.8896 11.2912 13.7009 13.4867 11.0005 13.4867C8.30002 13.4867 6.11138 11.2912 6.11138 8.58242ZM11.0005 11.6476C12.6887 11.6476 14.0562 10.2759 14.0562 8.58242C14.0562 6.88892 12.6887 5.51727 11.0005 5.51727C10.9737 5.51727 10.9508 5.51727 10.8897 5.51727C10.9737 5.71267 11.0005 5.91957 11.0005 6.1303C11.0005 7.4828 9.90425 8.58242 8.55593 8.58242C8.34585 8.58242 8.13959 8.5556 7.94479 8.47131C7.94479 8.53261 7.94479 8.5556 7.94479 8.54794C7.94479 10.2759 9.31221 11.6476 11.0005 11.6476ZM3.64468 3.08814C5.44295 1.4115 7.91424 0 11.0005 0C14.0867 0 16.558 1.4115 18.357 3.08814C20.1446 4.75098 21.3402 6.70885 21.9055 8.11115C22.0315 8.41383 22.0315 8.751 21.9055 9.05368C21.3402 10.4215 20.1446 12.3794 18.357 14.0767C16.558 15.7549 14.0867 17.1648 11.0005 17.1648C7.91424 17.1648 5.44295 15.7549 3.64468 14.0767C1.8571 12.3794 0.662325 10.4215 0.0940054 9.05368C-0.0313351 8.751 -0.0313351 8.41383 0.0940054 8.11115C0.662325 6.70885 1.8571 4.75098 3.64468 3.08814ZM11.0005 1.83909C8.51009 1.83909 6.46278 2.97319 4.89292 4.43297C3.42237 5.80463 2.40712 7.3985 1.88842 8.58242C2.40712 9.73185 3.42237 11.3602 4.89292 12.7319C6.46278 14.1916 8.51009 15.3257 11.0005 15.3257C13.4909 15.3257 15.5382 14.1916 17.108 12.7319C18.5786 11.3602 19.5602 9.73185 20.1141 8.58242C19.5602 7.3985 18.5786 5.80463 17.108 4.43297C15.5382 2.97319 13.4909 1.83909 11.0005 1.83909Z" fill="black"/>
						</svg>
					</button>
					<button class="icon-button" aria-label="print product" on:click={() => printPrev(product)} >
						<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M4.25 0C3.07793 0 2.125 0.95293 2.125 2.125V5.3125H4.25V2.125H11.7771L12.75 3.09785V5.3125H14.875V3.09785C14.875 2.5334 14.6525 1.99219 14.2541 1.59375L13.2812 0.620898C12.8828 0.222461 12.3416 0 11.7771 0H4.25ZM12.75 11.6875V12.75V14.875H4.25V12.75V12.2188V11.6875H12.75ZM14.875 12.75H15.9375C16.5252 12.75 17 12.2752 17 11.6875V8.5C17 7.32793 16.0471 6.375 14.875 6.375H2.125C0.95293 6.375 0 7.32793 0 8.5V11.6875C0 12.2752 0.474805 12.75 1.0625 12.75H2.125V14.875C2.125 16.0471 3.07793 17 4.25 17H12.75C13.9221 17 14.875 16.0471 14.875 14.875V12.75ZM14.3438 9.82812C13.9021 9.82812 13.5469 9.47285 13.5469 9.03125C13.5469 8.58965 13.9021 8.23438 14.3438 8.23438C14.7854 8.23438 15.1406 8.58965 15.1406 9.03125C15.1406 9.47285 14.7854 9.82812 14.3438 9.82812Z" fill="black"/>
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
					<button class="icon-button" aria-label="Edit product" on:click={() => editProduct(product)} >
						<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13.474 0.696554C14.4028 -0.232185 15.911 -0.232185 16.8398 0.696554L18.3035 2.16148C19.2322 3.08992 19.2322 4.59683 18.3035 5.52564L16.5054 7.32383L11.676 2.49474L13.474 0.696554ZM15.6659 8.16347L7.00263 16.8237C6.61628 17.2101 6.13706 17.4962 5.61325 17.6485L1.14308 18.9637C0.830278 19.0566 0.491848 18.9711 0.261151 18.7074C0.0304466 18.5105 -0.0558067 18.1724 0.0362493 17.8566L1.35111 13.3871C1.50565 12.8633 1.7891 12.384 2.17583 11.9976L10.8364 3.33513L15.6659 8.16347Z" fill="black"/>
						</svg>
					</button>
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
				{#if selectedProduct.warehousePlace}
					<p>
						<strong>Warehouse placement:</strong> {selectedProduct.warehousePlace}
					</p>
				{/if}
			</div>
			<img class="product-qr-code" src="qr/{selectedProduct.sku}.png" alt="">
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
	<dialog class="product-print-dialog" open={printProduct !== null} on:close={() => printProduct = null} id="printProduct">
		<svg on:click={() => printProduct = null} class="close-dialog" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M17.4699 14.929C18.173 15.6321 18.173 16.771 17.4699 17.4741C17.1212 17.8256 16.6599 18 16.1987 18C15.7375 18 15.2774 17.8242 14.9265 17.4727L8.9993 11.5486L3.0727 17.4713C2.72116 17.8256 2.26051 18 1.79986 18C1.33921 18 0.879119 17.8256 0.527303 17.4713C-0.175768 16.7682 -0.175768 15.6292 0.527303 14.9262L6.45559 8.99789L0.527303 3.07242C-0.175768 2.36935 -0.175768 1.23037 0.527303 0.527303C1.23037 -0.175768 2.36935 -0.175768 3.07242 0.527303L8.9993 6.4584L14.9276 0.530115C15.6307 -0.172955 16.7696 -0.172955 17.4727 0.530115C18.1758 1.23319 18.1758 2.37216 17.4727 3.07523L11.5444 9.00351L17.4699 14.929Z" fill="black"/>
		</svg>
		<label for="printWidth">
			Print width
			<input type="number" name="printWidth" id="printWidth" bind:value={printWidth} on:change={changeCanvas}>
		</label>
		<label for="printHeight">
			print height
			<input type="number" name="printHeight" id="printHeight" bind:value={printHeight} on:change={changeCanvas}>
		</label>
		<label for="qrHeight">
			print height
			<input type="number" name="qrHeight" id="qrHeight" bind:value={qrHeight} on:change={changeCanvas}>
		</label>
		{#if printProduct}
			<div class="print-details">
				<img class="product-qr-code" src="qr/{printProduct.sku}.png" alt="">
				<span class="sku">{printProduct.sku}</span>
				<h4 class="product-name">{printProduct.name}</h4>
			</div>

			<div id="printCanvas"></div>
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

	.product-details-dialog,
	.product-print-dialog {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
	}

	.product-details-dialog[open]:not(.product-print-dialog) {
		display: grid;
		grid-template-areas:
						"name name name"
						"desc desc images"
						"details details details"
						"transactions transactions transactions";

		.product-name {
			grid-area: name;
			margin-bottom: 20px;
		}

		.product-details {
			grid-area: desc;

			p {
				margin-top: 0;
				margin-bottom: 5px;
			}
		}
	}


	.close-dialog {
		position: absolute;
		right: 15px;
		top: 15px;
		cursor: pointer;

		path {
			fill: var(--text-color);
		}

		&:hover path {
			fill: var(--accent-color);
		}
	}

	.product-print-dialog {
		min-width: initial;

		label {
			display: flex;
			flex-direction: row;
			margin-top: 10px;
			max-width: 90%;
			gap: 10px;
			align-items: baseline;
			justify-content: space-between;
		}

		.print-details {
			text-align: center;
			padding-top: 20px;
		}

		#printCanvas {
			border: 1px solid rgb(0 0 0 / 20%);
			margin-top: 20px;
		}

		.product-name {
			font-size: 24px;
			font-weight: 400;
			margin-top: 0;
		}

		.sku {
			font-size: 24px;
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
	
	@media only screen and (max-width: 450px) {
		.hide-in-mobile {
			display: none;
		}
	}

	@media only screen and (min-width: 451px) {
		.show-in-mobile {
			display: none;
		}
	}
</style>
